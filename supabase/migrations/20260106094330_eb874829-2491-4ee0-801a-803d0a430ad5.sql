-- Add level and skills fields to practice_questions
ALTER TABLE public.practice_questions
ADD COLUMN IF NOT EXISTS level integer DEFAULT 2 CHECK (level >= 1 AND level <= 6),
ADD COLUMN IF NOT EXISTS skills text[] DEFAULT '{}';

-- Add skills field to chapters
ALTER TABLE public.chapters
ADD COLUMN IF NOT EXISTS skills text[] DEFAULT '{}';

-- Create flashcards table
CREATE TABLE IF NOT EXISTS public.flashcards (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id uuid NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  front text NOT NULL,
  back text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on flashcards
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;

-- Anyone can view flashcards (public content)
CREATE POLICY "Anyone can view flashcards" ON public.flashcards
FOR SELECT USING (true);

-- Create exit_ticket_results table
CREATE TABLE IF NOT EXISTS public.exit_ticket_results (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  session_id uuid REFERENCES public.focus_sessions(id),
  chapter_id uuid REFERENCES public.chapters(id),
  subject_name text NOT NULL,
  questions_attempted integer NOT NULL DEFAULT 0,
  questions_correct integer NOT NULL DEFAULT 0,
  skills_assessed text[] DEFAULT '{}',
  weak_skills text[] DEFAULT '{}',
  revision_task_created boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.exit_ticket_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own exit tickets" ON public.exit_ticket_results
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own exit tickets" ON public.exit_ticket_results
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create study_plans table for Quartz Road
CREATE TABLE IF NOT EXISTS public.study_plans (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  name text NOT NULL DEFAULT 'My Study Plan',
  exam_dates jsonb DEFAULT '[]',
  topics jsonb DEFAULT '[]',
  available_hours_per_day integer DEFAULT 2,
  priority_subjects text[] DEFAULT '{}',
  generated_plan jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own plans" ON public.study_plans
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own plans" ON public.study_plans
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own plans" ON public.study_plans
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own plans" ON public.study_plans
FOR DELETE USING (auth.uid() = user_id);

-- Add pomodoro preferences to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS pomodoro_work_minutes integer DEFAULT 25,
ADD COLUMN IF NOT EXISTS pomodoro_break_minutes integer DEFAULT 5,
ADD COLUMN IF NOT EXISTS pomodoro_long_break_minutes integer DEFAULT 15,
ADD COLUMN IF NOT EXISTS pomodoro_cycles_before_long_break integer DEFAULT 4;

-- Create pomodoro_sessions table for cycle tracking
CREATE TABLE IF NOT EXISTS public.pomodoro_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  focus_session_id uuid REFERENCES public.focus_sessions(id),
  cycle_number integer NOT NULL DEFAULT 1,
  work_completed boolean DEFAULT false,
  break_completed boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.pomodoro_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own pomodoro sessions" ON public.pomodoro_sessions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pomodoro sessions" ON public.pomodoro_sessions
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pomodoro sessions" ON public.pomodoro_sessions
FOR UPDATE USING (auth.uid() = user_id);

-- Add answer_explanation to practice_questions
ALTER TABLE public.practice_questions
ADD COLUMN IF NOT EXISTS explanation text;

-- Add level progress tracking to user_progress
ALTER TABLE public.user_progress
ADD COLUMN IF NOT EXISTS levels_progress jsonb DEFAULT '{}';

-- Backfill existing questions with level 2 (Explain) as default
UPDATE public.practice_questions SET level = 2 WHERE level IS NULL;
UPDATE public.practice_questions SET skills = '{}' WHERE skills IS NULL;
UPDATE public.chapters SET skills = '{}' WHERE skills IS NULL;