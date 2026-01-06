import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CoffeeCupTimerProps {
  progress: number; // 0-100, where 100 is full (start), 0 is empty (done)
  isRunning: boolean;
  isBreak?: boolean;
  sensoryMode?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function CoffeeCupTimer({ 
  progress, 
  isRunning, 
  isBreak = false,
  sensoryMode = false,
  size = 'md' 
}: CoffeeCupTimerProps) {
  const sizeClasses = {
    sm: 'w-24 h-32',
    md: 'w-32 h-44',
    lg: 'w-40 h-56',
  };

  const coffeeLevel = Math.max(0, Math.min(100, progress));
  const coffeeColor = isBreak ? '#88C8D6' : '#8B4513';
  const cupColor = '#F5F5DC';

  return (
    <div className={cn("relative", sizeClasses[size])}>
      {/* Steam - only if running and not sensory mode */}
      {isRunning && !isBreak && !sensoryMode && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-6 rounded-full bg-muted-foreground/20"
              animate={{
                y: [0, -8, 0],
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      {/* Cup SVG */}
      <svg viewBox="0 0 100 140" className="w-full h-full">
        {/* Cup body */}
        <path
          d="M15 20 L15 100 Q15 120 30 120 L70 120 Q85 120 85 100 L85 20 Z"
          fill={cupColor}
          stroke="#D4C4A8"
          strokeWidth="2"
        />
        
        {/* Coffee liquid with mask */}
        <defs>
          <clipPath id="cupClip">
            <path d="M17 22 L17 98 Q17 118 31 118 L69 118 Q83 118 83 98 L83 22 Z" />
          </clipPath>
        </defs>
        
        <g clipPath="url(#cupClip)">
          <motion.rect
            x="17"
            width="66"
            fill={coffeeColor}
            initial={false}
            animate={{
              y: 22 + (96 * (100 - coffeeLevel) / 100),
              height: 96 * coffeeLevel / 100,
            }}
            transition={sensoryMode ? { duration: 0 } : { 
              duration: 1.2, 
              ease: [0.4, 0, 0.2, 1],
            }}
          />
          
          {/* Coffee surface shine */}
          {coffeeLevel > 5 && (
            <ellipse
              cx="50"
              cy={24 + (96 * (100 - coffeeLevel) / 100)}
              rx="30"
              ry="4"
              fill="rgba(255,255,255,0.15)"
            />
          )}
        </g>
        
        {/* Cup handle */}
        <path
          d="M85 35 Q105 35 105 60 Q105 85 85 85"
          fill="none"
          stroke={cupColor}
          strokeWidth="8"
        />
        <path
          d="M85 35 Q105 35 105 60 Q105 85 85 85"
          fill="none"
          stroke="#D4C4A8"
          strokeWidth="2"
        />
        
        {/* Cup rim highlight */}
        <ellipse
          cx="50"
          cy="20"
          rx="35"
          ry="6"
          fill="none"
          stroke="#D4C4A8"
          strokeWidth="2"
        />
        
        {/* Saucer */}
        <ellipse
          cx="50"
          cy="128"
          rx="45"
          ry="8"
          fill={cupColor}
          stroke="#D4C4A8"
          strokeWidth="2"
        />
      </svg>

      {/* Progress percentage */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn(
          "font-bold text-foreground bg-background/80 px-2 py-1 rounded",
          size === 'sm' && 'text-sm',
          size === 'md' && 'text-lg',
          size === 'lg' && 'text-2xl'
        )}>
          {Math.round(coffeeLevel)}%
        </span>
      </div>
    </div>
  );
}

// Simple cycle indicator
interface CycleIndicatorProps {
  currentCycle: number;
  totalCycles: number;
  isBreak: boolean;
}

export function CycleIndicator({ currentCycle, totalCycles, isBreak }: CycleIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalCycles }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-3 h-3 rounded-full transition-all",
            i < currentCycle 
              ? "bg-primary" 
              : i === currentCycle && !isBreak
                ? "bg-primary animate-pulse"
                : "bg-muted"
          )}
        />
      ))}
      <span className="text-sm text-muted-foreground ml-2">
        Cycle {currentCycle + 1}/{totalCycles}
      </span>
    </div>
  );
}