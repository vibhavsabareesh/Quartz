import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useMode } from '@/contexts/ModeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { 
  Sparkles, 
  BookOpen, 
  Target, 
  Brain, 
  Timer,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
  Heart
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  icon: React.ReactNode;
  title: string;
  message: string;
  tip?: string;
  route?: string;
  // Position of the guide card for this step
  position?: 'bottom-center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    icon: <Sparkles className="w-8 h-8 text-primary" />,
    title: "Welcome to Quartz! ✨",
    message: "I'm your AI study guide. I'll take you on a tour of how Quartz works. It's designed to adapt to how you learn best!",
    tip: "You can explore at your own pace. No pressure!",
    route: '/',
    position: 'center'
  },
  {
    id: 'library',
    icon: <BookOpen className="w-8 h-8 text-primary" />,
    title: "Your Learning Library 📚",
    message: "This is the Library! All your subjects are organized by chapters. Each chapter has notes, flashcards, practice questions, and an AI tutor.",
    tip: "Start with topics you find interesting - it makes learning easier!",
    route: '/library',
    position: 'bottom-right'
  },
  {
    id: 'home',
    icon: <Target className="w-8 h-8 text-primary" />,
    title: "Your Daily Plan 🎯",
    message: "This is your Home page! It shows personalized daily tasks based on your energy and available time. Tasks are broken into small, manageable micro-steps.",
    tip: "On low energy days, it's okay to do less. Progress is progress!",
    route: '/home',
    position: 'bottom-left'
  },
  {
    id: 'progress',
    icon: <Timer className="w-8 h-8 text-primary" />,
    title: "Track Your Progress 📊",
    message: "Here you can see your learning journey! Track XP, streaks, completed sessions, and badges you've earned.",
    tip: "The coffee cup timer fills up as you work - it's oddly satisfying!",
    route: '/progress',
    position: 'top-right'
  },
  {
    id: 'settings',
    icon: <Brain className="w-8 h-8 text-primary" />,
    title: "Made for You 🧠",
    message: "In Settings, you can customize Quartz to your needs - larger text, step-by-step math help, calmer interface, and more!",
    tip: "Try the different accessibility modes to find what works for you!",
    route: '/settings',
    position: 'top-left'
  },
  {
    id: 'complete',
    icon: <Heart className="w-8 h-8 text-primary" />,
    title: "You're All Set! 🎉",
    message: "You've earned your first 10 XP just for completing this guide! Now explore and start learning!",
    tip: "Remember: small steps lead to big achievements!",
    position: 'center'
  }
];

// Get position classes for the guide card - keep everything centered
function getPositionClasses(position: OnboardingStep['position']): string {
  // All positions now stay centered to avoid going into dead space
  return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
}

interface OnboardingGuideProps {
  onComplete: () => void;
}

export function OnboardingGuide({ onComplete }: OnboardingGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { setIsGuestMode } = useMode();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const step = onboardingSteps[currentStep];
  const isLastStep = currentStep === onboardingSteps.length - 1;
  const isFirstStep = currentStep === 0;
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  // Navigate to the step's route when step changes
  useEffect(() => {
    if (step.route && location.pathname !== step.route) {
      navigate(step.route);
    }
  }, [currentStep, step.route, navigate, location.pathname]);

  // Enable guest mode on mount if not authenticated
  useEffect(() => {
    if (!user) {
      setIsGuestMode(true);
    }
  }, [user, setIsGuestMode]);

  const handleNext = async () => {
    if (isLastStep) {
      // Award XP based on user type
      if (user) {
        // Authenticated user - update database
        const { data: existingProgress } = await supabase
          .from('user_progress')
          .select('id, total_xp')
          .eq('user_id', user.id)
          .single();

        if (existingProgress) {
          await supabase
            .from('user_progress')
            .update({ total_xp: (existingProgress.total_xp || 0) + 10 })
            .eq('id', existingProgress.id);
        } else {
          await supabase
            .from('user_progress')
            .insert({ user_id: user.id, total_xp: 10 });
        }
      } else {
        // Guest user - store in localStorage
        localStorage.setItem('quartz-guest-xp', '10');
      }
      
      localStorage.setItem('quartz-onboarding-complete', 'true');
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('quartz-onboarding-complete', 'true');
    onComplete();
  };

  const positionClasses = getPositionClasses(step.position);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Subtle overlay - no blur, just a light dim */}
      <motion.div 
        key={`overlay-${currentStep}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-background/30 pointer-events-auto" 
      />
      
      {/* Floating guide card - moves to different positions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ 
            duration: 0.4,
            type: "spring",
            stiffness: 300,
            damping: 25
          }}
          className={`absolute w-full max-w-md px-4 pointer-events-auto ${positionClasses}`}
        >
          {/* Progress bar */}
          <div className="mb-3">
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1 text-center">
              Step {currentStep + 1} of {onboardingSteps.length}
            </p>
          </div>

          {/* Card */}
          <Card className="p-5 shadow-2xl border-2 border-primary/20 bg-card/95 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              {/* Animated Icon */}
              <motion.div 
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {step.icon}
              </motion.div>

              <div className="flex-1 min-w-0">
                {/* Title */}
                <h2 className="text-lg font-bold text-foreground mb-1">
                  {step.title}
                </h2>

                {/* Message */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.message}
                </p>

                {/* Tip */}
                {step.tip && (
                  <div className="flex items-start gap-2 mt-3 p-2 bg-muted/50 rounded-lg">
                    <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">{step.tip}</p>
                  </div>
                )}

                {/* XP Preview on last step */}
                {isLastStep && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-2 mt-3 p-2 bg-xp-gold/10 rounded-lg"
                  >
                    <Sparkles className="w-5 h-5 text-xp-gold" />
                    <span className="text-lg font-bold text-xp-gold">+10 XP</span>
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              {!isLastStep && !isFirstStep && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                >
                  Skip Tour
                </Button>
              )}
              <Button
                className="flex-1 gap-2"
                size="sm"
                onClick={handleNext}
              >
                {isLastStep ? (
                  user ? (
                    <>
                      Start Learning
                      <Sparkles className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Create Account
                      <Sparkles className="w-4 h-4" />
                    </>
                  )
                ) : isFirstStep ? (
                  <>
                    Start Tour
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>

            {/* Step indicators */}
            <div className="flex justify-center gap-1.5 mt-3">
              {onboardingSteps.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    index === currentStep ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`}
                  animate={index === currentStep ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.5 }}
                />
              ))}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}