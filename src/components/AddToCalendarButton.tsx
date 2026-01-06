import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Check, Loader2 } from 'lucide-react';
import { useGoogleCalendar } from '@/hooks/useGoogleCalendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddToCalendarButtonProps {
  title: string;
  description?: string;
  duration?: number; // in minutes
  taskId?: string;
  sessionId?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function AddToCalendarButton({
  title,
  description,
  duration = 30,
  taskId,
  sessionId,
  variant = 'outline',
  size = 'default',
  className,
}: AddToCalendarButtonProps) {
  const { isConnected, connect, createEvent } = useGoogleCalendar();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  
  const [eventTitle, setEventTitle] = useState(title);
  const [eventDescription, setEventDescription] = useState(description || '');
  const [eventDate, setEventDate] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  });
  const [eventDuration, setEventDuration] = useState(duration.toString());
  const [reminder, setReminder] = useState('10');

  const handleAddToCalendar = async () => {
    if (!isConnected) {
      connect();
      return;
    }

    setIsLoading(true);
    
    const startTime = new Date(eventDate).toISOString();
    const endTime = new Date(
      new Date(eventDate).getTime() + parseInt(eventDuration) * 60 * 1000
    ).toISOString();

    const event = await createEvent({
      title: eventTitle,
      description: eventDescription,
      startTime,
      endTime,
      reminders: reminder !== 'none' ? [parseInt(reminder)] : undefined,
      taskId,
      sessionId,
    });

    setIsLoading(false);

    if (event) {
      setIsAdded(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsAdded(false);
      }, 1500);
    }
  };

  if (isAdded) {
    return (
      <Button variant={variant} size={size} className={className} disabled>
        <Check className="w-4 h-4 mr-2" />
        Added!
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Calendar className="w-4 h-4 mr-2" />
          {isConnected ? 'Add to Calendar' : 'Connect Calendar'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add to Google Calendar</DialogTitle>
          <DialogDescription>
            {isConnected
              ? 'Schedule this study session in your calendar.'
              : 'Connect your Google Calendar to add events.'}
          </DialogDescription>
        </DialogHeader>
        
        {isConnected ? (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  rows={2}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="datetime">Date & Time</Label>
                <Input
                  id="datetime"
                  type="datetime-local"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Select value={eventDuration} onValueChange={setEventDuration}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="25">25 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="reminder">Reminder</Label>
                  <Select value={reminder} onValueChange={setReminder}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="5">5 minutes before</SelectItem>
                      <SelectItem value="10">10 minutes before</SelectItem>
                      <SelectItem value="15">15 minutes before</SelectItem>
                      <SelectItem value="30">30 minutes before</SelectItem>
                      <SelectItem value="60">1 hour before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button onClick={handleAddToCalendar} disabled={isLoading || !eventTitle}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 mr-2" />
                    Add Event
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-6 text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              Connect your Google Calendar to sync study sessions and get reminders.
            </p>
            <Button onClick={connect}>
              <Calendar className="w-4 h-4 mr-2" />
              Connect Google Calendar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
