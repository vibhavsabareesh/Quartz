import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Target, BookOpen, ArrowRight, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChapterCompletionReportProps {
  type: 'flashcards' | 'practice';
  chapterTitle: string;
  stats: {
    total: number;
    correct?: number;
    known?: number;
    accuracy?: number;
  };
  xpEarned: number;
  onContinue: () => void;
  onRetry: () => void;
}

export function ChapterCompletionReport({
  type,
  chapterTitle,
  stats,
  xpEarned,
  onContinue,
  onRetry,
}: ChapterCompletionReportProps) {
  const isFlashcards = type === 'flashcards';
  const successRate = isFlashcards 
    ? Math.round((stats.known || 0) / stats.total * 100)
    : stats.accuracy || 0;
  
  const getMessage = () => {
    if (successRate >= 80) return { emoji: '🎉', text: 'Outstanding!', color: 'text-success' };
    if (successRate >= 60) return { emoji: '👍', text: 'Great job!', color: 'text-primary' };
    if (successRate >= 40) return { emoji: '💪', text: 'Keep practicing!', color: 'text-warning' };
    return { emoji: '📚', text: 'More study needed', color: 'text-muted-foreground' };
  };

  const message = getMessage();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4"
          >
            <span className="text-4xl">{message.emoji}</span>
          </motion.div>
          
          <h2 className={cn("text-2xl font-bold text-center", message.color)}>
            {message.text}
          </h2>
          <p className="text-center text-muted-foreground mt-1">
            {isFlashcards ? 'Flashcards Complete' : 'Practice Complete'}
          </p>
        </div>

        <CardContent className="p-6 space-y-6">
          {/* XP Earned */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-3 p-4 bg-primary/5 rounded-lg"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Star className="w-6 h-6 text-primary fill-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">XP Earned</p>
              <p className="text-2xl font-bold text-primary">+{xpEarned} XP</p>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="p-4 bg-muted/30 rounded-lg text-center"
            >
              <BookOpen className="w-5 h-5 mx-auto text-muted-foreground mb-2" />
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">
                {isFlashcards ? 'Cards Reviewed' : 'Questions'}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="p-4 bg-muted/30 rounded-lg text-center"
            >
              <Target className="w-5 h-5 mx-auto text-muted-foreground mb-2" />
              <p className={cn(
                "text-2xl font-bold",
                successRate >= 70 ? "text-success" : successRate >= 40 ? "text-warning" : "text-destructive"
              )}>
                {successRate}%
              </p>
              <p className="text-xs text-muted-foreground">
                {isFlashcards ? 'Mastered' : 'Accuracy'}
              </p>
            </motion.div>
          </div>

          {isFlashcards && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex justify-center gap-4 text-sm"
            >
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                ✓ {stats.known || 0} Known
              </Badge>
              <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                ↻ {stats.total - (stats.known || 0)} Learning
              </Badge>
            </motion.div>
          )}

          {!isFlashcards && stats.correct !== undefined && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center text-sm text-muted-foreground"
            >
              You got <span className="font-semibold text-success">{stats.correct}</span> out of{' '}
              <span className="font-semibold">{stats.total}</span> correct
            </motion.div>
          )}

          {/* Chapter */}
          <div className="pt-4 border-t text-center">
            <p className="text-xs text-muted-foreground">Chapter</p>
            <p className="font-medium">{chapterTitle}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onRetry} className="flex-1 gap-2">
              <RotateCcw className="w-4 h-4" />
              Try Again
            </Button>
            <Button onClick={onContinue} className="flex-1 gap-2">
              Continue
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
