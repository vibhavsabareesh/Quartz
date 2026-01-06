-- Drop the existing public policy that exposes correct_answer
DROP POLICY IF EXISTS "Anyone can view practice questions" ON public.practice_questions;

-- Create a function to get practice questions WITHOUT revealing answers
CREATE OR REPLACE FUNCTION public.get_practice_questions(p_chapter_id uuid)
RETURNS TABLE (
  id uuid,
  chapter_id uuid,
  question_text text,
  question_type text,
  options text[],
  is_math boolean,
  math_steps text[]
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    pq.id,
    pq.chapter_id,
    pq.question_text,
    pq.question_type,
    pq.options,
    pq.is_math,
    pq.math_steps
  FROM public.practice_questions pq
  WHERE pq.chapter_id = p_chapter_id;
$$;

-- Create a function to check if an answer is correct (returns true/false, not the answer)
CREATE OR REPLACE FUNCTION public.check_answer(p_question_id uuid, p_user_answer text)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_correct_answer text;
  v_is_correct boolean;
BEGIN
  SELECT correct_answer INTO v_correct_answer
  FROM public.practice_questions
  WHERE id = p_question_id;
  
  IF v_correct_answer IS NULL THEN
    RETURN jsonb_build_object('error', 'Question not found');
  END IF;
  
  v_is_correct := LOWER(TRIM(v_user_answer)) = LOWER(TRIM(v_correct_answer));
  
  RETURN jsonb_build_object(
    'is_correct', v_is_correct,
    'correct_answer', CASE WHEN v_is_correct THEN v_correct_answer ELSE NULL END
  );
END;
$$;

-- Grant execute permissions on these functions
GRANT EXECUTE ON FUNCTION public.get_practice_questions(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_answer(uuid, text) TO anon, authenticated;