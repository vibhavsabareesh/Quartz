import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMode } from '@/contexts/ModeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { CoffeeCupTimer, CycleIndicator } from '@/components/CoffeeCupTimer';
import { supabase } from '@/integrations/supabase/client';
import { MicroStep } from '@/lib/demo-data';
import { cn } from '@/lib/utils';
import { 
  Play, 
  Pause, 
  Square, 
  Check,
  Clock,
  AlertCircle,
  SkipForward,
  Coffee
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  subject_name: string;
  chapter_id?: string;
  micro_steps: MicroStep[] | string[];
  completed_micro_steps: number;
}

// Pomodoro presets
const POMODORO_PRESETS = {
  short: { work: 10, break: 2, longBreak: 5 },
  standard: { work: 25, break: 5, longBreak: 15 },
  long: { work: 45, break: 10, longBreak: 20 },
};

export default function FocusSession() {
  const { taskId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { experienceProfile, hasMode, isGuestMode } = useMode();
  const { user } = useAuth();

  const task = location.state?.task as Task | undefined;

  // Pomodoro state
  const [preset, setPreset] = useState<'short' | 'standard' | 'long'>('standard');
  const [currentCycle, setCurrentCycle] = useState(0);
  const [totalCycles] = useState(4);
  const [isBreak, setIsBreak] = useState(false);
  const [isLongBreak, setIsLongBreak] = useState(false);
  
  const pomodoroConfig = POMODORO_PRESETS[preset];
  const currentDuration = isBreak 
    ? (isLongBreak ? pomodoroConfig.longBreak : pomodoroConfig.break)
    : pomodoroConfig.work;

  const [timeLeft, setTimeLeft] = useState(currentDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(task?.completed_micro_steps || 0);
  const [showEndingSoon, setShowEndingSoon] = useState(false);
  const [wasInterrupted, setWasInterrupted] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<Date | null>(null);
  const totalWorkMinutesRef = useRef(0);

  // Sensory mode check
  const isSensoryMode = hasMode('sensory_safe') || experienceProfile.sensoryMode.reduceMotion;

  // Handle visibility change (anti-escape)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isRunning && !isBreak) {
        // User left the tab during focus (not during break)
        setWasInterrupted(true);
        endSession(false, 'tab_left');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isRunning, isBreak]);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          
          // Show ending soon banner (last minute, only during work)
          if (!isBreak && experienceProfile.showEndingSoonBanner && newTime <= 60 && newTime > 0) {
            setShowEndingSoon(true);
          }
          
          if (newTime <= 0) {
            handlePhaseComplete();
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, isBreak, experienceProfile.showEndingSoonBanner]);

  // Reset time when phase changes
  useEffect(() => {
    setTimeLeft(currentDuration * 60);
    setShowEndingSoon(false);
  }, [isBreak, isLongBreak, preset]);

  const handlePhaseComplete = () => {
    setIsRunning(false);
    setShowEndingSoon(false);
    
    if (isBreak) {
      // Break is over, start next work cycle
      if (currentCycle >= totalCycles - 1) {
        // All cycles complete, end session
        endSession(true, 'completed');
      } else {
        setIsBreak(false);
        setIsLongBreak(false);
        setCurrentCycle(prev => prev + 1);
        // Auto-start next cycle
        setTimeout(() => setIsRunning(true), 1000);
      }
    } else {
      // Work phase complete
      totalWorkMinutesRef.current += pomodoroConfig.work;
      
      // Check if it's time for long break
      const isLongBreakTime = (currentCycle + 1) % totalCycles === 0;
      setIsBreak(true);
      setIsLongBreak(isLongBreakTime);
      // Auto-start break
      setTimeout(() => setIsRunning(true), 1000);
    }
  };

  const startSession = async () => {
    setIsRunning(true);
    startTimeRef.current = new Date();
    setWasInterrupted(false);

    if (!isGuestMode && user && !sessionId) {
      const { data } = await supabase
        .from('focus_sessions')
        .insert({
          user_id: user.id,
          task_id: taskId !== 'quick' ? taskId : null,
          planned_duration: pomodoroConfig.work * totalCycles,
        })
        .select()
        .single();

      if (data) {
        setSessionId(data.id);
      }
    }
  };

  const pauseSession = () => {
    setIsRunning(false);
  };

  const endSession = useCallback(async (completed: boolean, reason: string) => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);

    const actualDuration = totalWorkMinutesRef.current + 
      (isBreak ? 0 : Math.floor((pomodoroConfig.work * 60 - timeLeft) / 60));

    const xpEarned = completed ? actualDuration : 0;

    if (!isGuestMode && user && sessionId) {
      await supabase
        .from('focus_sessions')
        .update({
          ended_at: new Date().toISOString(),
          actual_duration: actualDuration,
          completed,
          end_reason: reason,
          xp_earned: xpEarned,
        })
        .eq('id', sessionId);

      // Update progress
      if (completed) {
        const { data: currentProgress } = await supabase
          .from('user_progress')
          .select('total_xp, total_focused_minutes, total_sessions_completed')
          .eq('user_id', user.id)
          .single();

        if (currentProgress) {
          await supabase.from('user_progress').update({
            total_xp: (currentProgress.total_xp || 0) + xpEarned,
            total_focused_minutes: (currentProgress.total_focused_minutes || 0) + actualDuration,
            total_sessions_completed: (currentProgress.total_sessions_completed || 0) + 1,
          }).eq('user_id', user.id);
        }

        // Mark task as completed
        if (taskId && taskId !== 'quick') {
          await supabase
            .from('daily_tasks')
            .update({ status: 'completed' })
            .eq('id', taskId);
        }
      }
    }

    // Navigate to session end
    navigate('/session-end', {
      state: {
        completed,
        reason,
        xpEarned,
        duration: actualDuration,
        task,
        sessionId,
      },
    });
  }, [isGuestMode, user, sessionId, pomodoroConfig.work, timeLeft, isBreak, taskId, task, navigate]);

  const completeStep = () => {
    if (task && currentStep < task.micro_steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const selectPreset = (p: 'short' | 'standard' | 'long') => {
    if (!isRunning) {
      setPreset(p);
      setCurrentCycle(0);
      setIsBreak(false);
      setIsLongBreak(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((currentDuration * 60 - timeLeft) / (currentDuration * 60)) * 100;
  const coffeeProgress = 100 - progress; // Coffee drains as time passes

  if (!task && taskId !== 'quick') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="focus-overlay flex flex-col items-center justify-center p-4">
      <AnimatePresence>
        {wasInterrupted && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-4 left-4 right-4 p-4 bg-warning/10 border border-warning rounded-lg flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-warning" />
            <p className="text-sm">
              Session ended because focus was interrupted. Want to try 10 minutes?
            </p>
            <Button size="sm" onClick={() => { selectPreset('short'); setWasInterrupted(false); }}>
              Try 10 min
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-md w-full text-center space-y-8">
        {/* Task Info */}
        {task && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl font-bold text-foreground mb-2">{task.title}</h1>
            <p className="text-muted-foreground">{task.subject_name}</p>
          </motion.div>
        )}

        {/* Phase indicator */}
        <div className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-full",
          isBreak ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" : "bg-primary/10 text-primary"
        )}>
          <Coffee className="w-4 h-4" />
          <span className="font-medium">
            {isBreak ? (isLongBreak ? 'Long Break' : 'Short Break') : 'Focus Time'}
          </span>
        </div>

        {/* Coffee Cup Timer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center"
        >
          <CoffeeCupTimer
            progress={coffeeProgress}
            isRunning={isRunning}
            isBreak={isBreak}
            sensoryMode={isSensoryMode}
            size="lg"
          />
          
          <p className="text-5xl font-bold text-foreground mt-4">{formatTime(timeLeft)}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {isRunning ? (isBreak ? 'Recharging...' : 'Focusing...') : 'Ready'}
          </p>
        </motion.div>

        {/* Cycle Indicator */}
        <CycleIndicator 
          currentCycle={currentCycle} 
          totalCycles={totalCycles} 
          isBreak={isBreak} 
        />

        {/* Preset Selector (before start) */}
        {!isRunning && timeLeft === currentDuration * 60 && currentCycle === 0 && !isBreak && (
          <div className="flex justify-center gap-3">
            {[
              { key: 'short', label: '10 min', mins: 10 },
              { key: 'standard', label: '25 min', mins: 25 },
              { key: 'long', label: '45 min', mins: 45 },
            ].map(({ key, label }) => (
              <Button
                key={key}
                variant={preset === key ? 'default' : 'outline'}
                size="lg"
                onClick={() => selectPreset(key as any)}
              >
                {label}
              </Button>
            ))}
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {!isRunning ? (
            <Button size="lg" className="h-14 px-8 gap-2" onClick={startSession}>
              <Play className="w-5 h-5" />
              {timeLeft < currentDuration * 60 ? 'Resume' : 'Start'}
            </Button>
          ) : (
            <>
              <Button size="lg" variant="outline" className="h-14 px-6" onClick={pauseSession}>
                <Pause className="w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="destructive"
                className="h-14 px-6"
                onClick={() => endSession(false, 'user_stopped')}
              >
                <Square className="w-5 h-5" />
              </Button>
            </>
          )}
        </div>

        {/* Micro-steps */}
        {task && task.micro_steps.length > 0 && !isBreak && (() => {
          const step = task.micro_steps[currentStep];
          const stepText = typeof step === 'string' ? step : step.text;
          const isSkippable = typeof step === 'object' && step.skippable;
          
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-left space-y-3"
            >
              <h3 className="font-medium text-foreground text-center">Current Step</h3>
              <div className="p-4 bg-card rounded-xl border">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-primary">{currentStep + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground">{stepText}</p>
                    {isSkippable && (
                      <span className="text-xs text-muted-foreground mt-1 inline-block">
                        (can be skipped)
                      </span>
                    )}
                  </div>
                  {currentStep < task.micro_steps.length - 1 && (
                    <div className="flex gap-1">
                      {isSkippable && (
                        <Button size="sm" variant="ghost" onClick={completeStep} title="Skip step">
                          <SkipForward className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={completeStep} title="Complete step">
                        <Check className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  Step {currentStep + 1} of {task.micro_steps.length}
                </div>
              </div>
            </motion.div>
          );
        })()}

        {/* Break message */}
        {isBreak && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl"
          >
            <p className="text-lg font-medium text-blue-700 dark:text-blue-300">
              {isLongBreak ? '☕ Time for a longer break!' : '🍵 Quick recharge time'}
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
              {isLongBreak 
                ? 'Stand up, stretch, grab a snack. You earned it!'
                : 'Take a breath, look away from the screen.'}
            </p>
          </motion.div>
        )}
      </div>

      {/* Ending Soon Banner */}
      <AnimatePresence>
        {showEndingSoon && experienceProfile.showEndingSoonBanner && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="ending-soon-banner"
          >
            <p className="text-warning font-medium">
              ⏰ Session ending in less than a minute
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
