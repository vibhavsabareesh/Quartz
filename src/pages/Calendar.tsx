import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useMode } from '@/contexts/ModeContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { CalendarGrid } from '@/components/CalendarGrid';
import { useCalendarData } from '@/hooks/useCalendarData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  Trophy, 
  Clock, 
  Sparkles,
  Calendar as CalendarIcon 
} from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';

export default function Calendar() {
  const { experienceProfile, hasMode } = useMode();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const calendarData = useCalendarData(year, month);

  const sensorySafe = hasMode('sensory_safe');
  const motorFriendly = experienceProfile.largeButtons;
  const dyslexiaMode = hasMode('dyslexia');
  const adhdMode = hasMode('adhd');

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handleToday = () => setCurrentDate(new Date());

  // Streak milestones for ADHD mode motivation
  const getStreakMessage = (streak: number) => {
    if (streak >= 30) return "🏆 Legendary! A whole month of consistency!";
    if (streak >= 14) return "🔥 Two weeks strong! You're unstoppable!";
    if (streak >= 7) return "⭐ One week streak! Keep the momentum!";
    if (streak >= 3) return "💪 Nice streak! You're building habits!";
    return "Start your streak today!";
  };

  return (
    <AppLayout>
      <div className={cn(
        "max-w-4xl mx-auto space-y-6",
        dyslexiaMode && "space-y-8"
      )}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-6 h-6 text-primary" />
            <h1 className={cn(
              "text-2xl font-bold",
              dyslexiaMode && "text-3xl"
            )}>
              Study Calendar
            </h1>
          </div>

          {/* Streak counter - prominent in ADHD mode */}
          {adhdMode && (
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full",
              sensorySafe ? "bg-muted" : "bg-orange-500/10"
            )}>
              <Flame className={cn(
                "w-5 h-5",
                sensorySafe ? "text-muted-foreground" : "text-orange-500"
              )} />
              <span className={cn(
                "font-bold",
                sensorySafe ? "text-foreground" : "text-orange-600 dark:text-orange-400",
                dyslexiaMode && "text-lg"
              )}>
                {calendarData.currentStreak} day streak
              </span>
            </div>
          )}
        </div>

        {/* ADHD Mode: Motivational message */}
        {adhdMode && !calendarData.loading && (
          <Card className={cn(
            sensorySafe ? "bg-muted" : "bg-gradient-to-r from-primary/10 to-accent/10"
          )}>
            <CardContent className="py-3">
              <p className={cn(
                "text-center font-medium",
                dyslexiaMode && "text-lg"
              )}>
                {getStreakMessage(calendarData.currentStreak)}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Month navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size={motorFriendly ? "lg" : "default"}
            onClick={handlePrevMonth}
            className={cn(motorFriendly && "min-w-[56px] min-h-[56px]")}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Previous</span>
          </Button>

          <div className="flex items-center gap-2">
            <h2 className={cn(
              "text-xl font-semibold",
              dyslexiaMode && "text-2xl"
            )}>
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToday}
              className={cn(motorFriendly && "min-h-[44px]")}
            >
              Today
            </Button>
          </div>

          <Button
            variant="outline"
            size={motorFriendly ? "lg" : "default"}
            onClick={handleNextMonth}
            className={cn(motorFriendly && "min-w-[56px] min-h-[56px]")}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Stats cards */}
        {!calendarData.loading && (
          <div className={cn(
            "grid grid-cols-2 sm:grid-cols-4 gap-3",
            dyslexiaMode && "gap-4"
          )}>
            <Card>
              <CardContent className={cn(
                "flex items-center gap-3 p-4",
                motorFriendly && "p-5"
              )}>
                <div className={cn(
                  "p-2 rounded-lg",
                  sensorySafe ? "bg-muted" : "bg-orange-500/10"
                )}>
                  <Flame className={cn(
                    "w-5 h-5",
                    sensorySafe ? "text-muted-foreground" : "text-orange-500"
                  )} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{calendarData.currentStreak}</p>
                  <p className="text-xs text-muted-foreground">Day Streak</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className={cn(
                "flex items-center gap-3 p-4",
                motorFriendly && "p-5"
              )}>
                <div className={cn(
                  "p-2 rounded-lg",
                  sensorySafe ? "bg-muted" : "bg-blue-500/10"
                )}>
                  <Clock className={cn(
                    "w-5 h-5",
                    sensorySafe ? "text-muted-foreground" : "text-blue-500"
                  )} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{calendarData.totalMinutesMonth}</p>
                  <p className="text-xs text-muted-foreground">Minutes</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className={cn(
                "flex items-center gap-3 p-4",
                motorFriendly && "p-5"
              )}>
                <div className={cn(
                  "p-2 rounded-lg",
                  sensorySafe ? "bg-muted" : "bg-yellow-500/10"
                )}>
                  <Sparkles className={cn(
                    "w-5 h-5",
                    sensorySafe ? "text-muted-foreground" : "text-yellow-500"
                  )} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{calendarData.totalXpMonth}</p>
                  <p className="text-xs text-muted-foreground">XP Earned</p>
                </div>
              </CardContent>
            </Card>

            {/* Best day - highlighted in ADHD mode */}
            {calendarData.bestDay && calendarData.bestDay.xpEarned > 0 && (
              <Card className={cn(
                adhdMode && !sensorySafe && "ring-2 ring-primary/50"
              )}>
                <CardContent className={cn(
                  "flex items-center gap-3 p-4",
                  motorFriendly && "p-5"
                )}>
                  <div className={cn(
                    "p-2 rounded-lg",
                    sensorySafe ? "bg-muted" : "bg-green-500/10"
                  )}>
                    <Trophy className={cn(
                      "w-5 h-5",
                      sensorySafe ? "text-muted-foreground" : "text-green-500"
                    )} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{calendarData.bestDay.xpEarned}</p>
                    <p className="text-xs text-muted-foreground">Best Day XP</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Calendar grid */}
        <Card>
          <CardContent className={cn(
            "p-2 sm:p-4",
            dyslexiaMode && "p-4 sm:p-6"
          )}>
            {calendarData.loading ? (
              <div className="space-y-4">
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <Skeleton key={i} className="h-8" />
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 35 }).map((_, i) => (
                    <Skeleton key={i} className="h-16" />
                  ))}
                </div>
              </div>
            ) : calendarData.error ? (
              <div className="text-center py-8 text-destructive">
                <p>Failed to load calendar data</p>
                <p className="text-sm text-muted-foreground mt-1">{calendarData.error}</p>
              </div>
            ) : (
              <CalendarGrid
                year={year}
                month={month}
                days={calendarData.days}
              />
            )}
          </CardContent>
        </Card>

        {/* Mobile list view hint */}
        <p className="text-center text-sm text-muted-foreground sm:hidden">
          Tap any day to see details
        </p>
      </div>
    </AppLayout>
  );
}
