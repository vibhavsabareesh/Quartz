-- Create table to track user question attempts
CREATE TABLE public.question_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  question_id uuid NOT NULL REFERENCES public.practice_questions(id) ON DELETE CASCADE,
  chapter_id uuid NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  selected_answer text NOT NULL,
  is_correct boolean NOT NULL,
  attempted_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.question_attempts ENABLE ROW LEVEL SECURITY;

-- RLS policies - users can only see/insert their own attempts
CREATE POLICY "Users can view own attempts"
ON public.question_attempts
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attempts"
ON public.question_attempts
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Index for efficient queries
CREATE INDEX idx_question_attempts_user ON public.question_attempts(user_id);
CREATE INDEX idx_question_attempts_question ON public.question_attempts(question_id);
CREATE INDEX idx_question_attempts_chapter ON public.question_attempts(chapter_id);

-- Update check_answer function to record the attempt
CREATE OR REPLACE FUNCTION public.check_answer(p_question_id uuid, p_user_answer text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_correct_answer text;
  v_chapter_id uuid;
  v_is_correct boolean;
  v_user_id uuid;
BEGIN
  -- Get current user
  v_user_id := auth.uid();
  
  -- Get the correct answer and chapter_id
  SELECT correct_answer, chapter_id INTO v_correct_answer, v_chapter_id
  FROM public.practice_questions
  WHERE id = p_question_id;
  
  IF v_correct_answer IS NULL THEN
    RETURN jsonb_build_object('error', 'Question not found');
  END IF;
  
  v_is_correct := LOWER(TRIM(p_user_answer)) = LOWER(TRIM(v_correct_answer));
  
  -- Record the attempt if user is authenticated
  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.question_attempts (user_id, question_id, chapter_id, selected_answer, is_correct)
    VALUES (v_user_id, p_question_id, v_chapter_id, p_user_answer, v_is_correct);
  END IF;
  
  RETURN jsonb_build_object(
    'is_correct', v_is_correct,
    'correct_answer', CASE WHEN v_is_correct THEN v_correct_answer ELSE NULL END
  );
END;
$$;

-- Function to get user's performance stats for a chapter
CREATE OR REPLACE FUNCTION public.get_chapter_performance(p_chapter_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_total_attempts integer;
  v_correct_attempts integer;
  v_unique_questions integer;
  v_mastered_questions integer;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Not authenticated');
  END IF;
  
  -- Get total and correct attempts
  SELECT COUNT(*), COUNT(*) FILTER (WHERE is_correct)
  INTO v_total_attempts, v_correct_attempts
  FROM public.question_attempts
  WHERE user_id = v_user_id AND chapter_id = p_chapter_id;
  
  -- Get unique questions attempted
  SELECT COUNT(DISTINCT question_id)
  INTO v_unique_questions
  FROM public.question_attempts
  WHERE user_id = v_user_id AND chapter_id = p_chapter_id;
  
  -- Get mastered questions (answered correctly at least once)
  SELECT COUNT(DISTINCT question_id)
  INTO v_mastered_questions
  FROM public.question_attempts
  WHERE user_id = v_user_id AND chapter_id = p_chapter_id AND is_correct = true;
  
  RETURN jsonb_build_object(
    'total_attempts', v_total_attempts,
    'correct_attempts', v_correct_attempts,
    'accuracy', CASE WHEN v_total_attempts > 0 THEN ROUND((v_correct_attempts::numeric / v_total_attempts) * 100) ELSE 0 END,
    'unique_questions', v_unique_questions,
    'mastered_questions', v_mastered_questions
  );
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_chapter_performance(uuid) TO authenticated;