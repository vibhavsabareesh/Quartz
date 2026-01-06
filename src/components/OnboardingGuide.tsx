import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useMode } from '@/contexts/ModeContext';
import { useNavigate } from 'react-router-dom';
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
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    icon: <Sparkles className="w-8 h-8 text-primary" />,
    title: "Welcome to Quartz! ✨",
    message: "I'm your AI study guide. I'll help you get comfortable with how Quartz works. It's designed to adapt to how you learn best!",
    tip: "You can explore at your own pace. No pressure!"
  },
  {
    id: 'library',
    icon: <BookOpen className="w-8 h-8 text-primary" />,
    title: "Your Learning Library 📚",
    message: "The Library has all your subjects organized by chapters. Each chapter has notes, flashcards, practice questions, and an AI tutor to help you understand concepts.",
    tip: "Start with topics you find interesting - it makes learning easier!"
  },
  {
    id: 'home',
    icon: <Target className="w-8 h-8 text-primary" />,
    title: "Your Daily Plan 🎯",
    message: "The Home page shows your personalized daily tasks. Quartz creates a plan based on your energy and how much time you have. Tasks are broken into small, manageable micro-steps.",
    tip: "On low energy days, it's okay to do less. Progress is progress!"
  },
  {
    id: 'focus',
    icon: <Timer className="w-8 h-8 text-primary" />,
    title: "Focus Sessions ⏰",
    message: "When you're ready to study, start a focus session. You'll get a gentle timer and clear steps to follow. Take breaks when you need them!",
    tip: "The coffee cup timer fills up as you work - it's oddly satisfying!"
  },
  {
    id: 'modes',
    icon: <Brain className="w-8 h-8 text-primary" />,
    title: "Made for You 🧠",
    message: "Quartz adapts to different learning needs - whether you need larger text, step-by-step math help, or a calmer interface. You can customize everything in Settings.",
    tip: "Try the onboarding quiz to personalize your experience!"
  },
  {
    id: 'complete',
    icon: <Heart className="w-8 h-8 text-primary" />,
    title: "You're All Set! 🎉",
    message: "You've earned your first 10 XP just for completing this guide! XP helps track your progress. Now go explore and learn something new!",
    tip: "Remember: small steps lead to big achievements!"
  }
];

interface OnboardingGuideProps {
  onComplete: () => void;
}

export function OnboardingGuide({ onComplete }: OnboardingGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { setIsGuestMode } = useMode();
  const navigate = useNavigate();

  const step = onboardingSteps[currentStep];
  const isLastStep = currentStep === onboardingSteps.length - 1;
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  const handleNext = () => {
    if (isLastStep) {
      // Award XP and complete
      setIsGuestMode(true);
      localStorage.setItem('quartz-guest-xp', '10');
      localStorage.setItem('quartz-onboarding-complete', 'true');
      onComplete();
      navigate('/home');
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    setIsGuestMode(true);
    localStorage.setItem('quartz-onboarding-complete', 'true');
    onComplete();
    navigate('/home');
  };

  return (
    <div className="min-h-screen gradient-calm flex flex-col items-center justify-center p-4">
      {/* Progress bar */}
      <div className="w-full max-w-md mb-6">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-sm text-muted-foreground mt-2 text-center">
          Step {currentStep + 1} of {onboardingSteps.length}
        </p>
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <Card className="p-6">
            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
              {step.icon}
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-foreground text-center mb-3">
              {step.title}
            </h2>

            {/* Message */}
            <p className="text-muted-foreground text-center mb-4 leading-relaxed">
              {step.message}
            </p>

            {/* Tip */}
            {step.tip && (
              <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg mb-6">
                <Lightbulb className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">{step.tip}</p>
              </div>
            )}

            {/* XP Preview on last step */}
            {isLastStep && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center justify-center gap-2 p-4 bg-xp-gold/10 rounded-lg mb-6"
              >
                <Sparkles className="w-6 h-6 text-xp-gold" />
                <span className="text-2xl font-bold text-xp-gold">+10 XP</span>
                <CheckCircle2 className="w-6 h-6 text-success" />
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              {!isLastStep && (
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={handleSkip}
                >
                  Skip Tour
                </Button>
              )}
              <Button
                className="flex-1 gap-2"
                onClick={handleNext}
              >
                {isLastStep ? (
                  <>
                    Start Exploring
                    <Sparkles className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Step indicators */}
      <div className="flex gap-2 mt-6">
        {onboardingSteps.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentStep ? 'bg-primary' : 'bg-muted-foreground/30'
            }`}
            aria-label={`Go to step ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
