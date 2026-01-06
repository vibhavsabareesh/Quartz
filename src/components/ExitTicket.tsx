import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useMode } from '@/contexts/ModeContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  CheckCircle2,
  XCircle,
  ChevronRight,
  BookOpen,
  Target,
  CalendarPlus,
} from 'lucide-react';

interface ExitTicketProps {
  chapterId?: string;
  subjectName: string;
  sessionId?: string;
  onComplete: (results: ExitTicketResult) => void;
  onSkip: () => void;
}

interface Question {
  id: string;
  question_text: string;
  options: string[];
  level: number;
  skills: string[];
}

export interface ExitTicketResult {
  questionsAttempted: number;
  questionsCorrect: number;
  skillsAssessed: string[];
  weakSkills: string[];
  recommendedLevel: number;
  recommendedAction: string;
  needsRevision: boolean;
}

export function ExitTicket({ 
  chapterId, 
  subjectName, 
  sessionId, 
  onComplete, 
  onSkip 
}: ExitTicketProps) {
  const { user } = useAuth();
  const { isGuestMode, experienceProfile } = useMode();
  const { toast } = useToast();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ questionId: string; answer: string; correct: boolean }[]>([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, [chapterId]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      // Get 3 random questions for exit ticket
      let query = supabase
        .from('practice_questions')
        .select('id, question_text, options, level, skills')
        .order('level')
        .limit(10);

      if (chapterId) {
        query = query.eq('chapter_id', chapterId);
      }

      const { data } = await query;
      
      if (data && data.length > 0) {
        // Shuffle and take 3
        const shuffled = data.sort(() => Math.random() - 0.5);
        setQuestions(shuffled.slice(0, 3) as Question[]);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
    }
    setLoading(false);
  };

  const checkAnswer = async () => {
    if (!selectedAnswer || !questions[currentIndex]) return;
    
    setChecking(true);
    try {
      const { data, error } = await supabase.rpc('check_answer', {
        p_question_id: questions[currentIndex].id,
        p_user_answer: selectedAnswer,
      });

      if (error) throw error;

      const result = data as { is_correct: boolean };
      setIsCorrect(result.is_correct);
      setShowResult(true);
      
      setAnswers([...answers, {
        questionId: questions[currentIndex].id,
        answer: selectedAnswer,
        correct: result.is_correct,
      }]);

    } catch (error) {
      console.error('Error checking answer:', error);
    }
    setChecking(false);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setIsCorrect(false);
    } else {
      completeTicket();
    }
  };

  const completeTicket = async () => {
    const correct = answers.filter(a => a.correct).length;
    const allSkills = questions.flatMap(q => q.skills || []);
    const uniqueSkills = [...new Set(allSkills)];
    
    // Find weak skills based on incorrect answers
    const incorrectQuestions = answers
      .filter(a => !a.correct)
      .map(a => questions.find(q => q.id === a.questionId))
      .filter(Boolean);
    
    const weakSkills = [...new Set(incorrectQuestions.flatMap(q => q?.skills || []))];
    
    // Determine recommendation
    const accuracy = correct / questions.length;
    const needsRevision = accuracy < 0.6;
    
    let recommendedLevel = 2;
    let recommendedAction = 'Continue to next chapter';
    
    if (accuracy < 0.4) {
      recommendedLevel = 1;
      recommendedAction = 'Review basics and key concepts';
    } else if (accuracy < 0.7) {
      recommendedLevel = 2;
      recommendedAction = 'Practice more explain-level questions';
    } else if (accuracy >= 0.9) {
      recommendedLevel = 4;
      recommendedAction = 'Ready for advanced analysis questions';
    }

    const result: ExitTicketResult = {
      questionsAttempted: questions.length,
      questionsCorrect: correct,
      skillsAssessed: uniqueSkills,
      weakSkills,
      recommendedLevel,
      recommendedAction,
      needsRevision,
    };

    // Save results if logged in
    if (!isGuestMode && user) {
      await supabase.from('exit_ticket_results').insert({
        user_id: user.id,
        session_id: sessionId,
        chapter_id: chapterId,
        subject_name: subjectName,
        questions_attempted: questions.length,
        questions_correct: correct,
        skills_assessed: uniqueSkills,
        weak_skills: weakSkills,
        revision_task_created: needsRevision,
      });

      // Create revision task for tomorrow if needed
      if (needsRevision) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        await supabase.from('daily_tasks').insert({
          user_id: user.id,
          date: tomorrow.toISOString().split('T')[0],
          title: `Review: ${subjectName} (${weakSkills.join(', ')})`,
          subject_name: subjectName,
          chapter_id: chapterId,
          estimated_minutes: 15,
          status: 'pending',
          order_index: 0,
          micro_steps: ['Review weak concepts', 'Practice similar questions', 'Check understanding'],
          completed_micro_steps: 0,
        });

        toast({
          title: 'Revision Added',
          description: 'A revision task has been added for tomorrow.',
        });
      }
    }

    onComplete(result);
  };

  if (loading) {
    return (
      <Card className="max-w-lg mx-auto">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Loading quick check...</p>
        </CardContent>
      </Card>
    );
  }

  if (questions.length === 0) {
    onSkip();
    return null;
  }

  const currentQuestion = questions[currentIndex];

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Quick Check
          </span>
          <Badge variant="secondary">
            {currentIndex + 1}/{questions.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Question */}
        <div>
          <p className="font-medium text-foreground mb-4">
            {currentQuestion.question_text}
          </p>
          
          {/* Skills tags */}
          <div className="flex gap-1 mb-4">
            {currentQuestion.skills?.map(skill => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>

          {/* Options */}
          <div className="space-y-2">
            {currentQuestion.options?.map((option, i) => (
              <button
                key={i}
                onClick={() => !showResult && setSelectedAnswer(option)}
                disabled={showResult}
                className={cn(
                  "w-full p-3 rounded-lg border text-left transition-all",
                  selectedAnswer === option && !showResult && "border-primary bg-primary/10",
                  showResult && selectedAnswer === option && isCorrect && "border-success bg-success/10",
                  showResult && selectedAnswer === option && !isCorrect && "border-destructive bg-destructive/10",
                  !showResult && "hover:border-primary/50"
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Result */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "p-4 rounded-lg flex items-center gap-3",
                isCorrect ? "bg-success/10" : "bg-destructive/10"
              )}
            >
              {isCorrect ? (
                <CheckCircle2 className="w-6 h-6 text-success" />
              ) : (
                <XCircle className="w-6 h-6 text-destructive" />
              )}
              <p className="font-medium">
                {isCorrect ? 'Correct!' : 'Not quite right'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex gap-3">
          {!showResult ? (
            <>
              <Button variant="outline" onClick={onSkip} className="flex-1">
                Skip
              </Button>
              <Button 
                onClick={checkAnswer} 
                disabled={!selectedAnswer || checking}
                className="flex-1"
              >
                {checking ? 'Checking...' : 'Check Answer'}
              </Button>
            </>
          ) : (
            <Button onClick={nextQuestion} className="w-full">
              {currentIndex < questions.length - 1 ? (
                <>
                  Next Question
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  See Results
                  <BookOpen className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Results display component
export function ExitTicketResults({ result }: { result: ExitTicketResult }) {
  const accuracy = (result.questionsCorrect / result.questionsAttempted) * 100;
  
  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Quick Check Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score */}
        <div className="text-center py-4">
          <p className="text-4xl font-bold text-foreground">
            {result.questionsCorrect}/{result.questionsAttempted}
          </p>
          <p className="text-muted-foreground">
            {accuracy >= 80 ? '🌟 Excellent!' : accuracy >= 60 ? '👍 Good job!' : '💪 Keep practicing!'}
          </p>
        </div>

        {/* Skills assessed */}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Skills checked:</p>
          <div className="flex flex-wrap gap-1">
            {result.skillsAssessed.map(skill => (
              <Badge key={skill} variant="secondary">{skill}</Badge>
            ))}
          </div>
        </div>

        {/* Weak skills */}
        {result.weakSkills.length > 0 && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Areas to improve:</p>
            <div className="flex flex-wrap gap-1">
              {result.weakSkills.map(skill => (
                <Badge key={skill} variant="outline" className="text-warning border-warning">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Recommendation */}
        <div className="p-4 bg-muted rounded-lg">
          <p className="font-medium text-foreground mb-1">Recommended next step:</p>
          <p className="text-muted-foreground">{result.recommendedAction}</p>
        </div>

        {/* Revision notice */}
        {result.needsRevision && (
          <div className="p-4 bg-primary/10 rounded-lg flex items-center gap-3">
            <CalendarPlus className="w-5 h-5 text-primary" />
            <p className="text-sm">
              A revision task has been added to tomorrow's plan.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}