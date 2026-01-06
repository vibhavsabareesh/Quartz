import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  htmlLink?: string;
}

interface SyncedEvent {
  id: string;
  google_event_id: string;
  task_id: string | null;
  session_id: string | null;
  event_title: string;
  event_start: string;
  event_end: string;
}

export function useGoogleCalendar() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [syncedEvents, setSyncedEvents] = useState<SyncedEvent[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  const checkConnection = useCallback(async () => {
    if (!user) {
      setIsConnected(false);
      setIsLoading(false);
      return;
    }

    try {
      const { data: session } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke('google-calendar-auth', {
        body: { action: 'check-connection' },
        headers: session.session ? {
          Authorization: `Bearer ${session.session.access_token}`,
        } : undefined,
      });

      setIsConnected(response.data?.connected || false);
    } catch (error) {
      console.error('Error checking connection:', error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  // Check for callback parameter in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('google_calendar') === 'connected') {
      setIsConnected(true);
      toast({
        title: 'Google Calendar Connected',
        description: 'Your calendar is now synced with the app.',
      });
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [toast]);

  const connect = useCallback(async () => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please log in to connect Google Calendar.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await supabase.functions.invoke('google-calendar-auth', {
        body: {
          action: 'get-auth-url',
          userId: user.id,
          redirectUrl: window.location.origin + window.location.pathname,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (response.data?.authUrl) {
        window.location.href = response.data.authUrl;
      }
    } catch (error) {
      console.error('Error getting auth URL:', error);
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect to Google Calendar. Please try again.',
        variant: 'destructive',
      });
    }
  }, [user, toast]);

  const disconnect = useCallback(async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke('google-calendar-auth', {
        body: { action: 'disconnect' },
        headers: session.session ? {
          Authorization: `Bearer ${session.session.access_token}`,
        } : undefined,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      setIsConnected(false);
      setEvents([]);
      setSyncedEvents([]);
      
      toast({
        title: 'Disconnected',
        description: 'Google Calendar has been disconnected.',
      });
    } catch (error) {
      console.error('Error disconnecting:', error);
      toast({
        title: 'Error',
        description: 'Failed to disconnect Google Calendar.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const fetchEvents = useCallback(async (options?: { maxResults?: number; timeMin?: string; timeMax?: string }) => {
    if (!isConnected) return [];

    try {
      const { data: session } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke('google-calendar-sync', {
        body: {
          action: 'list-events',
          ...options,
        },
        headers: session.session ? {
          Authorization: `Bearer ${session.session.access_token}`,
        } : undefined,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      setEvents(response.data?.events || []);
      return response.data?.events || [];
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch calendar events.',
        variant: 'destructive',
      });
      return [];
    }
  }, [isConnected, toast]);

  const createEvent = useCallback(async (params: {
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    reminders?: number[];
    taskId?: string;
    sessionId?: string;
  }) => {
    if (!isConnected) {
      toast({
        title: 'Not Connected',
        description: 'Please connect Google Calendar first.',
        variant: 'destructive',
      });
      return null;
    }

    try {
      const { data: session } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke('google-calendar-sync', {
        body: {
          action: 'create-event',
          ...params,
        },
        headers: session.session ? {
          Authorization: `Bearer ${session.session.access_token}`,
        } : undefined,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      toast({
        title: 'Event Created',
        description: 'Added to your Google Calendar.',
      });

      return response.data?.event;
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: 'Error',
        description: 'Failed to create calendar event.',
        variant: 'destructive',
      });
      return null;
    }
  }, [isConnected, toast]);

  const updateEvent = useCallback(async (params: {
    eventId: string;
    title?: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    reminders?: number[];
  }) => {
    if (!isConnected) return null;

    try {
      const { data: session } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke('google-calendar-sync', {
        body: {
          action: 'update-event',
          ...params,
        },
        headers: session.session ? {
          Authorization: `Bearer ${session.session.access_token}`,
        } : undefined,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      toast({
        title: 'Event Updated',
        description: 'Calendar event has been updated.',
      });

      return response.data?.event;
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        title: 'Error',
        description: 'Failed to update calendar event.',
        variant: 'destructive',
      });
      return null;
    }
  }, [isConnected, toast]);

  const deleteEvent = useCallback(async (eventId: string) => {
    if (!isConnected) return false;

    try {
      const { data: session } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke('google-calendar-sync', {
        body: {
          action: 'delete-event',
          eventId,
        },
        headers: session.session ? {
          Authorization: `Bearer ${session.session.access_token}`,
        } : undefined,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      toast({
        title: 'Event Deleted',
        description: 'Removed from your Google Calendar.',
      });

      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete calendar event.',
        variant: 'destructive',
      });
      return false;
    }
  }, [isConnected, toast]);

  const fetchSyncedEvents = useCallback(async () => {
    if (!isConnected) return [];

    try {
      const { data: session } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke('google-calendar-sync', {
        body: { action: 'get-synced-events' },
        headers: session.session ? {
          Authorization: `Bearer ${session.session.access_token}`,
        } : undefined,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      setSyncedEvents(response.data?.events || []);
      return response.data?.events || [];
    } catch (error) {
      console.error('Error fetching synced events:', error);
      return [];
    }
  }, [isConnected]);

  return {
    isConnected,
    isLoading,
    events,
    syncedEvents,
    connect,
    disconnect,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    fetchSyncedEvents,
    checkConnection,
  };
}
