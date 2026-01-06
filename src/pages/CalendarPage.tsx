import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGoogleCalendar } from '@/hooks/useGoogleCalendar';
import { GoogleCalendarConnect } from '@/components/GoogleCalendarConnect';
import { AddToCalendarButton } from '@/components/AddToCalendarButton';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  Loader2,
  Plus,
  RefreshCw
} from 'lucide-react';
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameDay, 
  addDays, 
  addWeeks, 
  subWeeks,
  parseISO,
  isToday,
  startOfDay,
  endOfDay
} from 'date-fns';
import { cn } from '@/lib/utils';

interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  htmlLink?: string;
}

export default function CalendarPage() {
  const { isConnected, isLoading: isConnectionLoading, events, fetchEvents } = useGoogleCalendar();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week'>('week');
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);

  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start on Monday
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const loadEvents = async () => {
    if (!isConnected) return;
    
    setIsLoadingEvents(true);
    const timeMin = view === 'day' 
      ? startOfDay(currentDate).toISOString()
      : startOfWeek(currentDate, { weekStartsOn: 1 }).toISOString();
    const timeMax = view === 'day'
      ? endOfDay(currentDate).toISOString()
      : endOfWeek(currentDate, { weekStartsOn: 1 }).toISOString();
    
    await fetchEvents({ maxResults: 50, timeMin, timeMax });
    setIsLoadingEvents(false);
  };

  useEffect(() => {
    loadEvents();
  }, [isConnected, currentDate, view]);

  const navigatePrevious = () => {
    if (view === 'day') {
      setCurrentDate(addDays(currentDate, -1));
    } else {
      setCurrentDate(subWeeks(currentDate, 1));
    }
  };

  const navigateNext = () => {
    if (view === 'day') {
      setCurrentDate(addDays(currentDate, 1));
    } else {
      setCurrentDate(addWeeks(currentDate, 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getEventsForDay = (day: Date): CalendarEvent[] => {
    return events.filter(event => {
      const eventDate = event.start.dateTime || event.start.date;
      if (!eventDate) return false;
      try {
        return isSameDay(parseISO(eventDate), day);
      } catch {
        return false;
      }
    });
  };

  const formatEventTime = (event: CalendarEvent) => {
    const startDate = event.start.dateTime;
    if (!startDate) return 'All day';
    
    try {
      return format(parseISO(startDate), 'h:mm a');
    } catch {
      return '';
    }
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventPosition = (event: CalendarEvent) => {
    const startDate = event.start.dateTime;
    const endDate = event.end.dateTime;
    
    if (!startDate) return { top: 0, height: 60 };
    
    try {
      const start = parseISO(startDate);
      const end = endDate ? parseISO(endDate) : addDays(start, 0);
      
      const startHour = start.getHours() + start.getMinutes() / 60;
      const endHour = end.getHours() + end.getMinutes() / 60;
      const duration = Math.max(endHour - startHour, 0.5);
      
      return {
        top: startHour * 60,
        height: duration * 60,
      };
    } catch {
      return { top: 0, height: 60 };
    }
  };

  if (isConnectionLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <CalendarIcon className="w-6 h-6" />
              Calendar
            </h1>
            <p className="text-muted-foreground">View and manage your study sessions</p>
          </div>
          <div className="flex items-center gap-2">
            {isConnected && (
              <AddToCalendarButton
                title="Study Session"
                description="Focus time for studying"
                duration={30}
                variant="default"
              />
            )}
          </div>
        </motion.div>

        {!isConnected ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-8 text-center">
              <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">Connect Google Calendar</h2>
              <p className="text-muted-foreground mb-6">
                Connect your Google Calendar to view and sync your study sessions.
              </p>
              <GoogleCalendarConnect showCard={false} />
            </Card>
          </motion.div>
        ) : (
          <>
            {/* Calendar Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={navigatePrevious}>
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" onClick={goToToday}>
                        Today
                      </Button>
                      <Button variant="outline" size="icon" onClick={navigateNext}>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={loadEvents} disabled={isLoadingEvents}>
                        <RefreshCw className={cn("w-4 h-4", isLoadingEvents && "animate-spin")} />
                      </Button>
                    </div>
                    
                    <h2 className="text-lg font-semibold text-foreground">
                      {view === 'day' 
                        ? format(currentDate, 'EEEE, MMMM d, yyyy')
                        : `${format(weekDays[0], 'MMM d')} - ${format(weekDays[6], 'MMM d, yyyy')}`
                      }
                    </h2>
                    
                    <Tabs value={view} onValueChange={(v) => setView(v as 'day' | 'week')}>
                      <TabsList>
                        <TabsTrigger value="day">Day</TabsTrigger>
                        <TabsTrigger value="week">Week</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Calendar View */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-0">
                  {view === 'week' ? (
                    // Week View
                    <div className="overflow-x-auto">
                      {/* Week Header */}
                      <div className="grid grid-cols-8 border-b">
                        <div className="p-3 text-center text-xs text-muted-foreground border-r">
                          Time
                        </div>
                        {weekDays.map((day) => (
                          <div
                            key={day.toISOString()}
                            className={cn(
                              "p-3 text-center border-r last:border-r-0",
                              isToday(day) && "bg-primary/10"
                            )}
                          >
                            <div className="text-xs text-muted-foreground">
                              {format(day, 'EEE')}
                            </div>
                            <div className={cn(
                              "text-lg font-semibold",
                              isToday(day) ? "text-primary" : "text-foreground"
                            )}>
                              {format(day, 'd')}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Time Grid */}
                      <div className="relative" style={{ height: '600px', overflowY: 'auto' }}>
                        <div className="grid grid-cols-8">
                          {/* Time Column */}
                          <div className="border-r">
                            {hours.slice(6, 22).map((hour) => (
                              <div
                                key={hour}
                                className="h-[60px] border-b text-xs text-muted-foreground pr-2 text-right pt-1"
                              >
                                {format(new Date().setHours(hour, 0), 'h a')}
                              </div>
                            ))}
                          </div>
                          
                          {/* Day Columns */}
                          {weekDays.map((day) => {
                            const dayEvents = getEventsForDay(day);
                            return (
                              <div
                                key={day.toISOString()}
                                className={cn(
                                  "relative border-r last:border-r-0",
                                  isToday(day) && "bg-primary/5"
                                )}
                              >
                                {hours.slice(6, 22).map((hour) => (
                                  <div
                                    key={hour}
                                    className="h-[60px] border-b border-dashed"
                                  />
                                ))}
                                
                                {/* Events */}
                                {dayEvents.map((event) => {
                                  const { top, height } = getEventPosition(event);
                                  const adjustedTop = top - 6 * 60; // Adjust for starting at 6am
                                  
                                  if (adjustedTop < 0 || adjustedTop > 16 * 60) return null;
                                  
                                  return (
                                    <div
                                      key={event.id}
                                      className="absolute left-1 right-1 bg-primary/20 border-l-2 border-primary rounded px-1 py-0.5 overflow-hidden cursor-pointer hover:bg-primary/30 transition-colors"
                                      style={{
                                        top: `${adjustedTop}px`,
                                        height: `${Math.min(height, (16 * 60) - adjustedTop)}px`,
                                        minHeight: '20px',
                                      }}
                                      title={event.summary}
                                    >
                                      <div className="text-xs font-medium text-foreground truncate">
                                        {event.summary}
                                      </div>
                                      {height > 30 && (
                                        <div className="text-xs text-muted-foreground truncate">
                                          {formatEventTime(event)}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Day View
                    <div className="relative" style={{ height: '600px', overflowY: 'auto' }}>
                      <div className="grid grid-cols-[80px_1fr]">
                        {/* Time Column */}
                        <div className="border-r">
                          {hours.slice(6, 22).map((hour) => (
                            <div
                              key={hour}
                              className="h-[60px] border-b text-xs text-muted-foreground pr-2 text-right pt-1"
                            >
                              {format(new Date().setHours(hour, 0), 'h a')}
                            </div>
                          ))}
                        </div>
                        
                        {/* Day Column */}
                        <div className="relative">
                          {hours.slice(6, 22).map((hour) => (
                            <div
                              key={hour}
                              className="h-[60px] border-b border-dashed"
                            />
                          ))}
                          
                          {/* Events */}
                          {getEventsForDay(currentDate).map((event) => {
                            const { top, height } = getEventPosition(event);
                            const adjustedTop = top - 6 * 60;
                            
                            if (adjustedTop < 0 || adjustedTop > 16 * 60) return null;
                            
                            return (
                              <div
                                key={event.id}
                                className="absolute left-2 right-2 bg-primary/20 border-l-4 border-primary rounded-r px-3 py-2 overflow-hidden cursor-pointer hover:bg-primary/30 transition-colors"
                                style={{
                                  top: `${adjustedTop}px`,
                                  height: `${Math.min(height, (16 * 60) - adjustedTop)}px`,
                                  minHeight: '40px',
                                }}
                              >
                                <div className="font-medium text-foreground">
                                  {event.summary}
                                </div>
                                <div className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatEventTime(event)}
                                </div>
                                {event.description && height > 80 && (
                                  <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                    {event.description}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* No events message */}
                  {events.length === 0 && !isLoadingEvents && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-center text-muted-foreground bg-background/80 p-4 rounded-lg">
                        <CalendarIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No events scheduled</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
