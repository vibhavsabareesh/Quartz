import React from 'react';
import { cn } from '@/lib/utils';
import { Lock, Check, Star } from 'lucide-react';

interface LevelProgress {
  level: number;
  name: string;
  questionsCompleted: number;
  questionsRequired: number;
  unlocked: boolean;
  current: boolean;
}

interface LevelsLadderProps {
  progress: LevelProgress[];
  onLevelClick?: (level: number) => void;
  compact?: boolean;
}

const LEVEL_NAMES = [
  { level: 1, name: 'Recall', color: 'bg-blue-500' },
  { level: 2, name: 'Explain', color: 'bg-green-500' },
  { level: 3, name: 'Apply', color: 'bg-yellow-500' },
  { level: 4, name: 'Compare', color: 'bg-orange-500' },
  { level: 5, name: 'Judge', color: 'bg-red-500' },
  { level: 6, name: 'Create', color: 'bg-purple-500' },
];

export function LevelsLadder({ progress, onLevelClick, compact = false }: LevelsLadderProps) {
  const getLevelColor = (level: number, unlocked: boolean) => {
    if (!unlocked) return 'bg-muted';
    return LEVEL_NAMES.find(l => l.level === level)?.color || 'bg-primary';
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {LEVEL_NAMES.map(({ level, name }) => {
          const levelProgress = progress.find(p => p.level === level);
          const unlocked = levelProgress?.unlocked ?? false;
          const completed = levelProgress && levelProgress.questionsCompleted >= levelProgress.questionsRequired;
          
          return (
            <div
              key={level}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                unlocked ? getLevelColor(level, true) + ' text-white' : 'bg-muted text-muted-foreground',
                completed && 'ring-2 ring-offset-2 ring-primary',
                onLevelClick && unlocked && 'cursor-pointer hover:scale-110'
              )}
              onClick={() => unlocked && onLevelClick?.(level)}
              title={`${name}: ${levelProgress?.questionsCompleted || 0}/${levelProgress?.questionsRequired || 2}`}
            >
              {completed ? <Check className="w-4 h-4" /> : level}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-foreground flex items-center gap-2">
        <Star className="w-4 h-4 text-primary" />
        Levels Ladder
      </h3>
      
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />
        
        <div className="space-y-2">
          {LEVEL_NAMES.map(({ level, name, color }) => {
            const levelProgress = progress.find(p => p.level === level);
            const unlocked = levelProgress?.unlocked ?? (level === 1);
            const completed = levelProgress && levelProgress.questionsCompleted >= levelProgress.questionsRequired;
            const current = levelProgress?.current ?? false;
            const questionsCompleted = levelProgress?.questionsCompleted || 0;
            const questionsRequired = levelProgress?.questionsRequired || 2;
            
            return (
              <div
                key={level}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg transition-all relative",
                  current && "bg-primary/10 border border-primary",
                  unlocked && onLevelClick && "cursor-pointer hover:bg-muted",
                  !unlocked && "opacity-50"
                )}
                onClick={() => unlocked && onLevelClick?.(level)}
              >
                {/* Level indicator */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold z-10",
                    unlocked ? color + ' text-white' : 'bg-muted text-muted-foreground'
                  )}
                >
                  {!unlocked ? (
                    <Lock className="w-4 h-4" />
                  ) : completed ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    level
                  )}
                </div>
                
                {/* Level info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">
                      Level {level}: {name}
                    </span>
                    {unlocked && (
                      <span className="text-sm text-muted-foreground">
                        {questionsCompleted}/{questionsRequired}
                      </span>
                    )}
                  </div>
                  
                  {/* Progress bar */}
                  {unlocked && (
                    <div className="h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all", color)}
                        style={{ width: `${Math.min(100, (questionsCompleted / questionsRequired) * 100)}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground mt-2">
        Complete 2 questions at each level to unlock the next
      </p>
    </div>
  );
}

// Helper to calculate level progress from question attempts
export function calculateLevelProgress(
  attempts: { level: number; is_correct: boolean }[],
  questionsPerLevel: number = 2
): LevelProgress[] {
  const levelStats: Record<number, { correct: number; total: number }> = {};
  
  // Initialize all levels
  for (let i = 1; i <= 6; i++) {
    levelStats[i] = { correct: 0, total: 0 };
  }
  
  // Count attempts per level
  attempts.forEach(a => {
    if (a.level >= 1 && a.level <= 6) {
      levelStats[a.level].total++;
      if (a.is_correct) levelStats[a.level].correct++;
    }
  });
  
  // Calculate which levels are unlocked
  const progress: LevelProgress[] = [];
  let allPreviousCompleted = true;
  let currentLevel = 1;
  
  for (let level = 1; level <= 6; level++) {
    const stats = levelStats[level];
    const completed = stats.correct >= questionsPerLevel;
    const unlocked = level === 1 || allPreviousCompleted;
    
    if (unlocked && !completed) {
      currentLevel = level;
    }
    
    progress.push({
      level,
      name: LEVEL_NAMES.find(l => l.level === level)?.name || '',
      questionsCompleted: stats.correct,
      questionsRequired: questionsPerLevel,
      unlocked,
      current: unlocked && !completed && allPreviousCompleted,
    });
    
    if (!completed) allPreviousCompleted = false;
  }
  
  return progress;
}