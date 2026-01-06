import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID');
const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

async function refreshAccessToken(refreshToken: string): Promise<{ access_token: string; expires_in: number } | null> {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID!,
        client_secret: GOOGLE_CLIENT_SECRET!,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      console.error('Token refresh failed:', await response.text());
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}

async function getValidAccessToken(userId: string, supabase: any): Promise<string | null> {
  const { data: tokenData, error } = await supabase
    .from('user_google_tokens')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !tokenData) {
    console.error('No tokens found for user:', userId);
    return null;
  }

  const expiresAt = new Date(tokenData.expires_at);
  const now = new Date();

  // If token expires in less than 5 minutes, refresh it
  if (expiresAt.getTime() - now.getTime() < 5 * 60 * 1000) {
    if (!tokenData.refresh_token) {
      console.error('No refresh token available');
      return null;
    }

    const newTokens = await refreshAccessToken(tokenData.refresh_token);
    if (!newTokens) {
      return null;
    }

    const newExpiresAt = new Date(Date.now() + (newTokens.expires_in * 1000));

    await supabase
      .from('user_google_tokens')
      .update({
        access_token: newTokens.access_token,
        expires_at: newExpiresAt.toISOString(),
      })
      .eq('user_id', userId);

    return newTokens.access_token;
  }

  return tokenData.access_token;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user from auth header
    const userClient = createClient(
      SUPABASE_URL!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await userClient.auth.getUser();
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid user' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const accessToken = await getValidAccessToken(user.id, supabase);

    if (!accessToken) {
      return new Response(JSON.stringify({ error: 'Google Calendar not connected' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { action, ...params } = await req.json();

    // List upcoming events
    if (action === 'list-events') {
      const { maxResults = 10, timeMin, timeMax } = params;
      
      const url = new URL('https://www.googleapis.com/calendar/v3/calendars/primary/events');
      url.searchParams.set('maxResults', maxResults.toString());
      url.searchParams.set('singleEvents', 'true');
      url.searchParams.set('orderBy', 'startTime');
      
      if (timeMin) url.searchParams.set('timeMin', timeMin);
      else url.searchParams.set('timeMin', new Date().toISOString());
      
      if (timeMax) url.searchParams.set('timeMax', timeMax);

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to list events:', errorText);
        return new Response(JSON.stringify({ error: 'Failed to fetch events' }), {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const data = await response.json();
      return new Response(JSON.stringify({ events: data.items || [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create event
    if (action === 'create-event') {
      const { title, description, startTime, endTime, reminders, taskId, sessionId } = params;

      const event = {
        summary: title,
        description: description || '',
        start: {
          dateTime: startTime,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: endTime,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        reminders: reminders ? {
          useDefault: false,
          overrides: reminders.map((minutes: number) => ({
            method: 'popup',
            minutes,
          })),
        } : { useDefault: true },
      };

      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to create event:', errorText);
        return new Response(JSON.stringify({ error: 'Failed to create event' }), {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const createdEvent = await response.json();

      // Store in synced_calendar_events
      await supabase
        .from('synced_calendar_events')
        .insert({
          user_id: user.id,
          google_event_id: createdEvent.id,
          task_id: taskId || null,
          session_id: sessionId || null,
          event_title: title,
          event_start: startTime,
          event_end: endTime,
        });

      return new Response(JSON.stringify({ event: createdEvent }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update event
    if (action === 'update-event') {
      const { eventId, title, description, startTime, endTime, reminders } = params;

      const event: any = {};
      if (title) event.summary = title;
      if (description !== undefined) event.description = description;
      if (startTime) event.start = { dateTime: startTime, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone };
      if (endTime) event.end = { dateTime: endTime, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone };
      if (reminders) {
        event.reminders = {
          useDefault: false,
          overrides: reminders.map((minutes: number) => ({
            method: 'popup',
            minutes,
          })),
        };
      }

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to update event:', errorText);
        return new Response(JSON.stringify({ error: 'Failed to update event' }), {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const updatedEvent = await response.json();

      // Update in synced_calendar_events
      if (title || startTime || endTime) {
        await supabase
          .from('synced_calendar_events')
          .update({
            ...(title && { event_title: title }),
            ...(startTime && { event_start: startTime }),
            ...(endTime && { event_end: endTime }),
          })
          .eq('google_event_id', eventId)
          .eq('user_id', user.id);
      }

      return new Response(JSON.stringify({ event: updatedEvent }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Delete event
    if (action === 'delete-event') {
      const { eventId } = params;

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok && response.status !== 404) {
        const errorText = await response.text();
        console.error('Failed to delete event:', errorText);
        return new Response(JSON.stringify({ error: 'Failed to delete event' }), {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Remove from synced_calendar_events
      await supabase
        .from('synced_calendar_events')
        .delete()
        .eq('google_event_id', eventId)
        .eq('user_id', user.id);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get synced events
    if (action === 'get-synced-events') {
      const { data: syncedEvents, error } = await userClient
        .from('synced_calendar_events')
        .select('*')
        .eq('user_id', user.id)
        .order('event_start', { ascending: true });

      if (error) {
        console.error('Failed to get synced events:', error);
        return new Response(JSON.stringify({ error: 'Failed to get synced events' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ events: syncedEvents }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in google-calendar-sync:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
