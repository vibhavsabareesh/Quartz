import React from 'react';
import { cn } from '@/lib/utils';
import { useMode } from '@/contexts/ModeContext';
import { CalendarDay } from '@/hooks/useCalendarData';
import { format, parseISO } from 'date-fns';
import { X, Clock, CheckCircle2, Flame, Sparkles, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useNavigate } from 'react-router-dom';

interface CalendarDayDetailProps {
  day: CalendarDay | null;
  open: boolean;
  onClose: () => void;
}

export function CalendarDayDetail({ day, open, onClose }: CalendarDayDetailProps) {
  const { experienceProfile, hasMode } = useMode();
  const navigate = useNavigate();
  
  const sensorySafe = hasMode('sensory_safe');
  const motorFriendly = experienceProfile.largeButtons;
  const dyslexiaMode = hasMode('dyslexia');

  if (!day) return null;

  const dateObj = parseISO(day.date);
  const formattedDate = format(dateObj, 'EEEE, MMMM d, yyyy');

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent 
        side="right" 
        className={cn(
          "w-full sm:max-w-md",
          dyslexiaMode && "text-lg leading-relaxed"
        )}
      >
        <SheetHeader>
          <SheetTitle className={cn(dyslexiaMode && "text-xl")}>
            {formattedDate}
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] mt-4">
          <div className={cn("space-y-6", dyslexiaMode && "space-y-8")}>
            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className={cn(
                "flex flex-col items-center p-3 rounded-lg bg-muted",
                motorFriendly && "p-4"
              )}>
                <CheckCircle2 className={cn(
                  "w-5 h-5 mb-1",
                  sensorySafe ? "text-muted-foreground" : "text-green-500"
                )} />
                <span className="text-2xl font-bold">{day.tasksCompleted}</span>
                <span className="text-xs text-muted-foreground">Tasks</span>
              </div>
              
              <div className={cn(
                "flex flex-col items-center p-3 rounded-lg bg-muted",
                motorFriendly && "p-4"
              )}>
                <Clock className={cn(
                  "w-5 h-5 mb-1",
                  sensorySafe ? "text-muted-foreground" : "text-blue-500"
                )} />
                <span className="text-2xl font-bold">{day.totalMinutes}</span>
                <span className="text-xs text-muted-foreground">Minutes</span>
              </div>
              
              <div className={cn(
                "flex flex-col items-center p-3 rounded-lg bg-muted",
                motorFriendly && "p-4"
              )}>
                <Sparkles className={cn(
                  "w-5 h-5 mb-1",
                  sensorySafe ? "text-muted-foreground" : "text-yellow-500"
                )} />
                <span className="text-2xl font-bold">{day.xpEarned}</span>
                <span className="text-xs text-muted-foreground">XP</span>
              </div>
            </div>

            {/* Streak indicator */}
            {day.streakMaintained && (
              <div className={cn(
                "flex items-center gap-2 p-3 rounded-lg",
                sensorySafe ? "bg-muted" : "bg-orange-500/10"
              )}>
                <Flame className={cn(
                  "w-5 h-5",
                  sensorySafe ? "text-muted-foreground" : "text-orange-500"
                )} />
                <span className={cn(
                  "font-medium",
                  sensorySafe ? "text-foreground" : "text-orange-600 dark:text-orange-400"
                )}>
                  Streak maintained!
                </span>
              </div>
            )}

            <Separator />

            {/* Focus Sessions */}
            <div>
              <h3 className={cn(
                "font-semibold mb-3 flex items-center gap-2",
                dyslexiaMode && "text-lg"
              )}>
                <Clock className="w-4 h-4" />
                Focus Sessions
              </h3>
              
              {day.sessions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No focus sessions this day</p>
              ) : (
                <div className="space-y-2">
                  {day.sessions.map((session) => (
                    <div 
                      key={session.id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg bg-muted/50",
                        motorFriendly && "p-4"
                      )}
                    >
                      <div>
                        <span className="text-sm">
                          {format(parseISO(session.started_at), 'h:mm a')}
                        </span>
                        <span className="text-muted-foreground text-sm ml-2">
                          {session.actual_duration || session.planned_duration} min
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {session.completed && (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        )}
                        <span className="text-sm font-medium">
                          +{session.xp_earned} XP
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Completed Tasks */}
            <div>
              <h3 className={cn(
                "font-semibold mb-3 flex items-center gap-2",
                dyslexiaMode && "text-lg"
              )}>
                <CheckCircle2 className="w-4 h-4" />
                Completed Tasks
              </h3>
              
              {day.tasks.filter(t => t.status === 'completed').length === 0 ? (
                <p className="text-sm text-muted-foreground">No completed tasks this day</p>
              ) : (
                <div className="space-y-2">
                  {day.tasks
                    .filter(t => t.status === 'completed')
                    .map((task) => (
                      <div 
                        key={task.id}
                        className={cn(
                          "p-3 rounded-lg bg-muted/50",
                          motorFriendly && "p-4"
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium">{task.title}</p>
                            {task.subject_name && (
                              <div className="flex items-center gap-1 mt-1">
                                <BookOpen className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {task.subject_name}
                                </span>
                              </div>
                            )}
                          </div>
                          {task.estimated_minutes && (
                            <span className="text-xs text-muted-foreground">
                              ~{task.estimated_minutes}m
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
