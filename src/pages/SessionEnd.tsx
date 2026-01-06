import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Flame, Clock, Home, RotateCcw, AlertTriangle, Target } from 'lucide-react';
import { AddToCalendarButton } from '@/components/AddToCalendarButton';
import { ExitTicket, ExitTicketResult, ExitTicketResults } from '@/components/ExitTicket';

interface SessionEndState {
  completed: boolean;
  reason: string;
  xpEarned: number;
  duration: number;
  task?: {
    id?: string;
    title: string;
    subject_name: string;
    chapter_id?: string;
  };
  sessionId?: string;
}

export default function SessionEnd() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as SessionEndState | undefined;
  
  const [showExitTicket, setShowExitTicket] = useState(state?.completed ?? false);
  const [exitTicketResult, setExitTicketResult] = useState<ExitTicketResult | null>(null);

  if (!state) {
    navigate('/home');
    return null;
  }

  const { completed, reason, xpEarned, duration, task, sessionId } = state;

  const handleExitTicketComplete = (result: ExitTicketResult) => {
    setExitTicketResult(result);
    setShowExitTicket(false);
  };

  const handleExitTicketSkip = () => {
    setShowExitTicket(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {showExitTicket && task ? (
          <motion.div
            key="exit-ticket"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Quick Check</h2>
              <p className="text-muted-foreground">Let's see what you learned!</p>
            </div>
            <ExitTicket
              chapterId={task.chapter_id}
              subjectName={task.subject_name}
              sessionId={sessionId}
              onComplete={handleExitTicketComplete}
              onSkip={handleExitTicketSkip}
            />
          </motion.div>
        ) : exitTicketResult ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg space-y-4"
          >
            <ExitTicketResults result={exitTicketResult} />
            <div className="flex flex-col gap-3">
              {completed && task && (
                <AddToCalendarButton
                  title={`Study: ${task.title}`}
                  description={`Subject: ${task.subject_name}\nDuration: ${duration} minutes\nXP Earned: ${xpEarned}`}
                  duration={duration}
                  variant="outline"
                  className="w-full"
                />
              )}
              <Button onClick={() => navigate('/home')} className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="summary"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-md w-full"
          >
            <Card className="p-8 text-center">
              {completed ? (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/20 flex items-center justify-center"
                  >
                    <Sparkles className="w-10 h-10 text-success" />
                  </motion.div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">Session Complete!</h1>
                  <p className="text-muted-foreground mb-6">
                    {task ? `Great work on "${task.title}"!` : 'Great focus session!'}
                  </p>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-warning/20 flex items-center justify-center"
                  >
                    <AlertTriangle className="w-10 h-10 text-warning" />
                  </motion.div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">Session Ended</h1>
                  <p className="text-muted-foreground mb-6">
                    {reason === 'tab_left' 
                      ? 'Focus was interrupted when you left the page.'
                      : reason === 'user_stopped'
                      ? 'You stopped the session early.'
                      : 'Session was not completed.'}
                  </p>
                </>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-muted/50">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-xp-gold" />
                    <span className="text-2xl font-bold text-foreground">{xpEarned}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">XP Earned</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="text-2xl font-bold text-foreground">{duration}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Minutes</p>
                </div>
              </div>

              {/* Streak indicator */}
              {completed && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-8 p-4 rounded-xl bg-streak-orange/10 border border-streak-orange/30"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Flame className="w-5 h-5 text-streak-orange" />
                    <span className="font-medium text-foreground">Streak maintained!</span>
                  </div>
                </motion.div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-3">
                {completed && task && (
                  <AddToCalendarButton
                    title={`Study: ${task.title}`}
                    description={`Subject: ${task.subject_name}\nDuration: ${duration} minutes\nXP Earned: ${xpEarned}`}
                    duration={duration}
                    variant="outline"
                    className="w-full"
                  />
                )}
                <Button onClick={() => navigate('/home')} className="w-full">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
                {!completed && (
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(-1)}
                    className="w-full"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
