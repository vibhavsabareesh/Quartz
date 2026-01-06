import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useMode } from '@/contexts/ModeContext';
import { CalendarDay } from '@/hooks/useCalendarData';
import { CalendarDayCell } from './CalendarDayCell';
import { CalendarDayDetail } from './CalendarDayDetail';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  format, 
  isSameMonth,
  getDate 
} from 'date-fns';

interface CalendarGridProps {
  year: number;
  month: number;
  days: CalendarDay[];
  weekStartsOn?: 0 | 1; // 0 = Sunday, 1 = Monday
}

const WEEKDAY_LABELS_SUN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAY_LABELS_MON = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function CalendarGrid({ year, month, days, weekStartsOn = 0 }: CalendarGridProps) {
  const { experienceProfile, hasMode } = useMode();
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const sensorySafe = hasMode('sensory_safe');
  const dyslexiaMode = hasMode('dyslexia');
  const autismMode = hasMode('autism');

  // Calculate the calendar grid dates
  const monthStart = startOfMonth(new Date(year, month));
  const monthEnd = endOfMonth(new Date(year, month));
  const calendarStart = startOfWeek(monthStart, { weekStartsOn });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weekdayLabels = weekStartsOn === 0 ? WEEKDAY_LABELS_SUN : WEEKDAY_LABELS_MON;

  // Map days data by date string for quick lookup
  const daysByDate = new Map(days.map(d => [d.date, d]));

  const handleDayClick = (day: CalendarDay | null) => {
    if (!day) return;
    setSelectedDay(day);
    setDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    // Delay clearing selected day for animation
    setTimeout(() => setSelectedDay(null), 200);
  };

  return (
    <>
      <div className={cn(
        "w-full",
        dyslexiaMode && "text-lg"
      )}>
        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-1">
          {weekdayLabels.map((label) => (
            <div 
              key={label}
              className={cn(
                "text-center py-2 text-sm font-medium text-muted-foreground",
                dyslexiaMode && "text-base py-3"
              )}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className={cn(
          "grid grid-cols-7 gap-0.5 sm:gap-1",
          dyslexiaMode && "gap-1 sm:gap-2"
        )}>
          {calendarDays.map((date) => {
            const dateStr = format(date, 'yyyy-MM-dd');
            const dayData = daysByDate.get(dateStr) || null;
            const isCurrentMonth = isSameMonth(date, monthStart);
            const dayNumber = isCurrentMonth ? getDate(date) : null;

            return (
              <CalendarDayCell
                key={dateStr}
                day={isCurrentMonth ? dayData : null}
                dayNumber={dayNumber}
                isCurrentMonth={isCurrentMonth}
                onClick={() => isCurrentMonth && handleDayClick(dayData)}
              />
            );
          })}
        </div>
      </div>

      {/* Day detail panel - uses Sheet for autism mode predictability */}
      <CalendarDayDetail
        day={selectedDay}
        open={detailOpen}
        onClose={handleCloseDetail}
      />
    </>
  );
}
