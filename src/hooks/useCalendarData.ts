import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useMode } from '@/contexts/ModeContext';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, parseISO, isSameDay } from 'date-fns';

interface FocusSession {
  id: string;
  started_at: string;
  ended_at: string | null;
  actual_duration: number | null;
  planned_duration: number;
  completed: boolean;
  xp_earned: number;
  task_id: string | null;
}

interface DailyTask {
  id: string;
  title: string;
  subject_name: string | null;
  status: string;
  estimated_minutes: number | null;
  completed_micro_steps: number | null;
  micro_steps: string[] | null;
}

export interface CalendarDay {
  date: string;
  tasksCompleted: number;
  totalTasks: number;
  totalMinutes: number;
  streakMaintained: boolean;
  xpEarned: number;
  sessions: FocusSession[];
  tasks: DailyTask[];
}

export interface CalendarData {
  days: CalendarDay[];
  currentStreak: number;
  bestDay: CalendarDay | null;
  totalXpMonth: number;
  totalMinutesMonth: number;
  loading: boolean;
  error: string | null;
}

// Generate mock data for guest mode
function generateMockData(year: number, month: number): CalendarDay[] {
  const start = startOfMonth(new Date(year, month));
  const end = endOfMonth(new Date(year, month));
  const days = eachDayOfInterval({ start, end });

  return days.map((date, index) => {
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const hasActivity = Math.random() > (isWeekend ? 0.6 : 0.3);
    const tasksCompleted = hasActivity ? Math.floor(Math.random() * 4) + 1 : 0;
    const totalMinutes = hasActivity ? Math.floor(Math.random() * 90) + 15 : 0;
    const xpEarned = tasksCompleted * 10 + Math.floor(totalMinutes / 5);

    return {
      date: format(date, 'yyyy-MM-dd'),
      tasksCompleted,
      totalTasks: tasksCompleted + (hasActivity ? Math.floor(Math.random() * 2) : 0),
      totalMinutes,
      streakMaintained: hasActivity && tasksCompleted > 0,
      xpEarned,
      sessions: hasActivity ? [{
        id: `mock-${index}`,
        started_at: new Date(date.setHours(14, 0, 0)).toISOString(),
        ended_at: new Date(date.setHours(14, totalMinutes, 0)).toISOString(),
        actual_duration: totalMinutes,
        planned_duration: 25,
        completed: true,
        xp_earned: xpEarned,
        task_id: null,
      }] : [],
      tasks: hasActivity ? Array.from({ length: tasksCompleted }, (_, i) => ({
        id: `mock-task-${index}-${i}`,
        title: ['Review Chapter Notes', 'Practice Problems', 'Flashcard Review', 'Summary Writing'][i % 4],
        subject_name: ['Mathematics', 'Physics', 'Chemistry', 'Biology'][i % 4],
        status: 'completed',
        estimated_minutes: Math.floor(Math.random() * 20) + 10,
        completed_micro_steps: 3,
        micro_steps: ['Step 1', 'Step 2', 'Step 3'],
      })) : [],
    };
  });
}

export function useCalendarData(year: number, month: number): CalendarData {
  const { user } = useAuth();
  const { isGuestMode } = useMode();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    if (isGuestMode || !user) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const start = startOfMonth(new Date(year, month));
        const end = endOfMonth(new Date(year, month));
        const startStr = format(start, 'yyyy-MM-dd');
        const endStr = format(end, 'yyyy-MM-dd');

        // Fetch focus sessions
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('focus_sessions')
          .select('*')
          .gte('started_at', `${startStr}T00:00:00`)
          .lte('started_at', `${endStr}T23:59:59`)
          .order('started_at', { ascending: true });

        if (sessionsError) throw sessionsError;

        // Fetch daily tasks
        const { data: tasksData, error: tasksError } = await supabase
          .from('daily_tasks')
          .select('*')
          .gte('date', startStr)
          .lte('date', endStr)
          .order('date', { ascending: true });

        if (tasksError) throw tasksError;

        // Fetch current streak
        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select('current_streak')
          .single();

        if (progressError && progressError.code !== 'PGRST116') throw progressError;

        setSessions(sessionsData || []);
        setTasks(tasksData || []);
        setCurrentStreak(progressData?.current_streak || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch calendar data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [year, month, user, isGuestMode]);

  const calendarData = useMemo((): CalendarData => {
    if (isGuestMode) {
      const mockDays = generateMockData(year, month);
      const bestDay = mockDays.reduce((best, day) => 
        day.xpEarned > (best?.xpEarned || 0) ? day : best, mockDays[0]);
      
      return {
        days: mockDays,
        currentStreak: 12,
        bestDay,
        totalXpMonth: mockDays.reduce((sum, d) => sum + d.xpEarned, 0),
        totalMinutesMonth: mockDays.reduce((sum, d) => sum + d.totalMinutes, 0),
        loading: false,
        error: null,
      };
    }

    const start = startOfMonth(new Date(year, month));
    const end = endOfMonth(new Date(year, month));
    const daysInMonth = eachDayOfInterval({ start, end });

    const days: CalendarDay[] = daysInMonth.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      
      // Filter sessions for this day
      const daySessions = sessions.filter(s => {
        const sessionDate = parseISO(s.started_at);
        return isSameDay(sessionDate, date);
      });

      // Filter tasks for this day - using the date from Supabase response
      const dayTasks = tasks.filter(t => {
        // The date field comes from Supabase as a string in format 'yyyy-MM-dd'
        const taskDate = (t as any).date as string;
        return taskDate === dateStr;
      });
      const completedTasks = dayTasks.filter(t => t.status === 'completed');

      // Calculate totals
      const totalMinutes = daySessions.reduce((sum, s) => sum + (s.actual_duration || 0), 0);
      const xpEarned = daySessions.reduce((sum, s) => sum + (s.xp_earned || 0), 0);
      const streakMaintained = completedTasks.length > 0 || daySessions.some(s => s.completed);

      return {
        date: dateStr,
        tasksCompleted: completedTasks.length,
        totalTasks: dayTasks.length,
        totalMinutes,
        streakMaintained,
        xpEarned,
        sessions: daySessions,
        tasks: dayTasks,
      };
    });

    const bestDay = days.reduce((best, day) => 
      day.xpEarned > (best?.xpEarned || 0) ? day : best, days[0] || null);

    return {
      days,
      currentStreak,
      bestDay,
      totalXpMonth: days.reduce((sum, d) => sum + d.xpEarned, 0),
      totalMinutesMonth: days.reduce((sum, d) => sum + d.totalMinutes, 0),
      loading,
      error,
    };
  }, [year, month, sessions, tasks, currentStreak, isGuestMode, loading, error]);

  return calendarData;
}
