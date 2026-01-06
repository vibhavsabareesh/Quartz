-- Create table for storing Google OAuth tokens
CREATE TABLE public.user_google_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  scope TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create table for tracking synced calendar events
CREATE TABLE public.synced_calendar_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  google_event_id TEXT NOT NULL,
  task_id UUID REFERENCES daily_tasks(id) ON DELETE SET NULL,
  session_id UUID REFERENCES focus_sessions(id) ON DELETE SET NULL,
  event_title TEXT NOT NULL,
  event_start TIMESTAMP WITH TIME ZONE NOT NULL,
  event_end TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, google_event_id)
);

-- Enable RLS
ALTER TABLE public.user_google_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.synced_calendar_events ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_google_tokens
CREATE POLICY "Users can view their own tokens" 
ON public.user_google_tokens 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tokens" 
ON public.user_google_tokens 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tokens" 
ON public.user_google_tokens 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tokens" 
ON public.user_google_tokens 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS policies for synced_calendar_events
CREATE POLICY "Users can view their own synced events" 
ON public.synced_calendar_events 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own synced events" 
ON public.synced_calendar_events 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own synced events" 
ON public.synced_calendar_events 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own synced events" 
ON public.synced_calendar_events 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_user_google_tokens_updated_at
BEFORE UPDATE ON public.user_google_tokens
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_synced_calendar_events_updated_at
BEFORE UPDATE ON public.synced_calendar_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();