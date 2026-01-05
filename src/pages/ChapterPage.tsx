import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { useMode } from '@/contexts/ModeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { 
  ArrowLeft, 
  BookOpen, 
  Key, 
  HelpCircle,
  Play,
  ChevronRight,
  ChevronLeft,
  Check,
  X
} from 'lucide-react';
import { generateMicroSteps } from '@/lib/demo-data';
import { useToast } from '@/hooks/use-toast';

interface Chapter {
  id: string;
  chapter_number: number;
  title: string;
  summary: string;
  key_points: string[];
  subjects: { name: string } | null;
  board: string;
  grade: number;
}

interface PracticeQuestion {
  id: string;
  question_text: string;
  question_type: string;
  options: string[];
  correct_answer: string;
  is_math: boolean;
  math_steps: string[];
}

export default function ChapterPage() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const { experienceProfile, hasMode, isGuestMode } = useMode();
  const { user } = useAuth();
  const { toast } = useToast();

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'summary' | 'keypoints' | 'practice'>('summary');
  
  // Practice state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [currentMathStep, setCurrentMathStep] = useState(0);

  // Reading support state
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    loadChapter();
  }, [chapterId]);

  const loadChapter = async () => {
    if (!chapterId) return;
    
    setLoading(true);
    
    try {
      const { data: chapterData } = await supabase
        .from('chapters')
        .select('*, subjects(name)')
        .eq('id', chapterId)
        .single();

      if (chapterData) {
        setChapter(chapterData as Chapter);
      }

      const { data: questionsData } = await supabase
        .from('practice_questions')
        .select('*')
        .eq('chapter_id', chapterId);

      if (questionsData) {
        setQuestions(questionsData as PracticeQuestion[]);
      }
    } catch (error) {
      console.error('Error loading chapter:', error);
    }
    
    setLoading(false);
  };

  const addToTodaysPlan = async () => {
    if (!chapter) return;

    if (isGuestMode) {
      toast({
        title: 'Added to today\'s plan!',
        description: `"${chapter.title}" is now in your tasks.`,
      });
      navigate('/home');
      return;
    }

    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      await supabase.from('daily_tasks').insert({
        user_id: user.id,
        chapter_id: chapter.id,
        date: today,
        title: chapter.title,
        subject_name: (chapter.subjects as any)?.name,
        estimated_minutes: experienceProfile.defaultTimerMinutes,
        status: 'pending',
        order_index: 99, // Will be at the end
        micro_steps: generateMicroSteps(
          chapter.title,
          experienceProfile.microStepsGranularity === 'detailed'
        ),
        completed_micro_steps: 0,
      });

      toast({
        title: 'Added to today\'s plan!',
        description: `"${chapter.title}" is now in your tasks.`,
      });
      navigate('/home');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not add to today\'s plan.',
        variant: 'destructive',
      });
    }
  };

  const checkAnswer = () => {
    setShowResult(true);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setCurrentMathStep(0);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setCurrentMathStep(0);
    }
  };

  // Split summary into sections for reading support
  const summarySections = chapter?.summary?.split('. ').filter(s => s.trim()) || [];
  
  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion?.correct_answer;
  const showMathStepMode = hasMode('step_by_step_math') && currentQuestion?.is_math && currentQuestion?.math_steps?.length > 0;

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-muted-foreground">Loading chapter...</p>
        </div>
      </AppLayout>
    );
  }

  if (!chapter) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <p className="text-muted-foreground">Chapter not found</p>
          <Button onClick={() => navigate('/library')}>Back to Library</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Button variant="ghost" size="sm" onClick={() => navigate('/library')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Library
          </Button>
          
          <div className="flex items-start justify-between gap-4">
            <div>
              <Badge variant="secondary" className="mb-2">
                Chapter {chapter.chapter_number}
              </Badge>
              <h1 className="text-2xl font-bold text-foreground">{chapter.title}</h1>
              <p className="text-muted-foreground mt-1">
                {(chapter.subjects as any)?.name} • {chapter.board} Grade {chapter.grade}
              </p>
            </div>
            <Button onClick={addToTodaysPlan}>
              <Play className="w-4 h-4 mr-2" />
              Add to Today
            </Button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          {[
            { id: 'summary', label: 'Summary', icon: BookOpen },
            { id: 'keypoints', label: 'Key Points', icon: Key },
            { id: 'practice', label: 'Practice', icon: HelpCircle },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'summary' && (
            <Card>
              <CardContent className="p-6">
                {experienceProfile.readingMode.oneSectionAtATime ? (
                  <div className="space-y-4">
                    <div 
                      className={`reading-chunk ${
                        experienceProfile.readingMode.highlightCurrent ? 'highlight-current' : ''
                      }`}
                    >
                      <p className={experienceProfile.readingMode.largeFont ? 'text-lg leading-relaxed' : ''}>
                        {summarySections[currentSection]}.
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentSection(prev => Math.max(0, prev - 1))}
                        disabled={currentSection === 0}
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Section {currentSection + 1} of {summarySections.length}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentSection(prev => Math.min(summarySections.length - 1, prev + 1))}
                        disabled={currentSection === summarySections.length - 1}
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className={`${
                    experienceProfile.readingMode.largeFont ? 'text-lg' : ''
                  } ${
                    experienceProfile.readingMode.increasedSpacing ? 'leading-loose' : 'leading-relaxed'
                  }`}>
                    {chapter.summary}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'keypoints' && (
            <Card>
              <CardContent className="p-6">
                <ul className="space-y-4">
                  {chapter.key_points?.map((point, index) => (
                    <li
                      key={index}
                      className={`flex items-start gap-3 ${
                        experienceProfile.readingMode.largeFont ? 'text-lg' : ''
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">{index + 1}</span>
                      </div>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {activeTab === 'practice' && (
            <div className="space-y-4">
              {questions.length === 0 ? (
                <Card className="p-8 text-center">
                  <HelpCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No practice questions yet</p>
                  <p className="text-muted-foreground">Check back later!</p>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Question {currentQuestionIndex + 1} of {questions.length}
                      </CardTitle>
                      {currentQuestion?.is_math && (
                        <Badge variant="secondary">Math</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Question */}
                    <p className={`font-medium ${
                      experienceProfile.readingMode.largeFont ? 'text-xl' : 'text-lg'
                    }`}>
                      {currentQuestion?.question_text}
                    </p>

                    {/* Math Step Mode */}
                    {showMathStepMode && !showResult && (
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-muted-foreground">
                          Step-by-step solution:
                        </p>
                        {currentQuestion.math_steps.slice(0, currentMathStep + 1).map((step, index) => (
                          <div
                            key={index}
                            className="math-step-box"
                          >
                            <span className="text-xs font-bold text-primary">Step {index + 1}</span>
                            <p className="mt-1">{step}</p>
                          </div>
                        ))}
                        {currentMathStep < currentQuestion.math_steps.length - 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentMathStep(prev => prev + 1)}
                          >
                            Show next step
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Options */}
                    {currentQuestion?.question_type === 'mcq' && (
                      <div className="space-y-3">
                        {currentQuestion.options?.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => !showResult && setSelectedAnswer(option)}
                            disabled={showResult}
                            className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                              showResult
                                ? option === currentQuestion.correct_answer
                                  ? 'border-success bg-success/10'
                                  : option === selectedAnswer
                                  ? 'border-destructive bg-destructive/10'
                                  : 'border-border'
                                : selectedAnswer === option
                                ? 'border-primary bg-primary/10'
                                : 'border-border hover:border-primary/50'
                            } ${experienceProfile.largeButtons ? 'min-h-[56px]' : ''}`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{option}</span>
                              {showResult && option === currentQuestion.correct_answer && (
                                <Check className="w-5 h-5 text-success" />
                              )}
                              {showResult && option === selectedAnswer && option !== currentQuestion.correct_answer && (
                                <X className="w-5 h-5 text-destructive" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={prevQuestion}
                        disabled={currentQuestionIndex === 0}
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                      </Button>
                      
                      {!showResult ? (
                        <Button
                          onClick={checkAnswer}
                          disabled={!selectedAnswer}
                        >
                          Check Answer
                        </Button>
                      ) : (
                        <Button onClick={nextQuestion}>
                          {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
}
