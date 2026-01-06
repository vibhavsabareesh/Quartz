import React from 'react';
import { cn } from '@/lib/utils';
import { useMode } from '@/contexts/ModeContext';
import { Flame } from 'lucide-react';
import { CalendarDay } from '@/hooks/useCalendarData';
import { isToday, parseISO } from 'date-fns';

interface CalendarDayCellProps {
  day: CalendarDay | null;
  dayNumber: number | null;
  isCurrentMonth: boolean;
  onClick?: () => void;
}

export function CalendarDayCell({ day, dayNumber, isCurrentMonth, onClick }: CalendarDayCellProps) {
  const { experienceProfile, hasMode } = useMode();
  
  const isTodayDate = day ? isToday(parseISO(day.date)) : false;
  const hasActivity = day && (day.tasksCompleted > 0 || day.totalMinutes > 0);
  const isCompleteDay = day && day.tasksCompleted > 0 && day.totalMinutes >= 25;
  const isPartialDay = hasActivity && !isCompleteDay;

  // Mode-specific styling
  const sensorySafe = hasMode('sensory_safe');
  const motorFriendly = experienceProfile.largeButtons;
  const dyslexiaMode = hasMode('dyslexia');

  const getBackgroundColor = () => {
    if (!isCurrentMonth || !day) return 'bg-muted/30';
    if (sensorySafe) {
      if (isCompleteDay) return 'bg-muted';
      if (isPartialDay) return 'bg-muted/60';
      return 'bg-background';
    }
    if (isCompleteDay) return 'bg-green-500/20 dark:bg-green-500/30';
    if (isPartialDay) return 'bg-yellow-500/20 dark:bg-yellow-500/30';
    return 'bg-background';
  };

  return (
    <button
      onClick={onClick}
      disabled={!day || !isCurrentMonth}
      className={cn(
        "relative flex flex-col items-center justify-start p-1 sm:p-2 border border-border/50 transition-colors",
        getBackgroundColor(),
        !sensorySafe && "hover:bg-accent/50",
        !isCurrentMonth && "opacity-40 cursor-default",
        isCurrentMonth && day && "cursor-pointer",
        isTodayDate && "ring-2 ring-primary ring-inset",
        motorFriendly ? "min-h-[64px] min-w-[64px]" : "min-h-[48px] min-w-[48px]",
        dyslexiaMode && "text-lg"
      )}
      aria-label={day ? `${day.date}: ${day.tasksCompleted} tasks, ${day.totalMinutes} minutes` : undefined}
    >
      {dayNumber && (
        <>
          {/* Day number */}
          <span className={cn(
            "font-medium",
            dyslexiaMode ? "text-base" : "text-sm",
            isTodayDate && "text-primary font-bold"
          )}>
            {dayNumber}
          </span>

          {/* Activity indicators */}
          {day && hasActivity && (
            <div className="flex flex-col items-center gap-0.5 mt-1">
              {/* Streak flame */}
              {day.streakMaintained && (
                <Flame className={cn(
                  "w-3 h-3 sm:w-4 sm:h-4",
                  sensorySafe ? "text-muted-foreground" : "text-orange-500"
                )} />
              )}
              
              {/* Minutes badge - hidden on very small screens */}
              <span className={cn(
                "hidden sm:block text-xs text-muted-foreground",
                dyslexiaMode && "text-sm"
              )}>
                {day.totalMinutes}m
              </span>
            </div>
          )}

          {/* Tasks badge - compact on mobile */}
          {day && day.tasksCompleted > 0 && (
            <span className={cn(
              "absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1",
              "text-[10px] sm:text-xs px-1 rounded-full",
              sensorySafe ? "bg-muted text-muted-foreground" : "bg-primary/20 text-primary"
            )}>
              {day.tasksCompleted}
            </span>
          )}
        </>
      )}
    </button>
  );
}
