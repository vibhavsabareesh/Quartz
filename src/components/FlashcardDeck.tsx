import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle, Check, X } from 'lucide-react';

interface Flashcard {
  id: string;
  front: string;
  back: string;
}

interface FlashcardDeckProps {
  flashcards: Flashcard[];
  onComplete?: () => void;
}

export function FlashcardDeck({ flashcards, onComplete }: FlashcardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set());
  const [unknownCards, setUnknownCards] = useState<Set<string>>(new Set());
  const [shuffledCards, setShuffledCards] = useState(flashcards);

  const currentCard = shuffledCards[currentIndex];
  const progress = ((currentIndex + 1) / shuffledCards.length) * 100;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const nextCard = () => {
    if (currentIndex < shuffledCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else if (onComplete) {
      onComplete();
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const markAsKnown = () => {
    setKnownCards(prev => new Set([...prev, currentCard.id]));
    setUnknownCards(prev => {
      const newSet = new Set(prev);
      newSet.delete(currentCard.id);
      return newSet;
    });
    nextCard();
  };

  const markAsUnknown = () => {
    setUnknownCards(prev => new Set([...prev, currentCard.id]));
    setKnownCards(prev => {
      const newSet = new Set(prev);
      newSet.delete(currentCard.id);
      return newSet;
    });
    nextCard();
  };

  const shuffleCards = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCards(new Set());
    setUnknownCards(new Set());
  };

  const resetDeck = () => {
    setShuffledCards(flashcards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCards(new Set());
    setUnknownCards(new Set());
  };

  if (flashcards.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-lg font-medium text-foreground">No flashcards available</p>
        <p className="text-muted-foreground mt-2">Flashcards will appear here once added.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Card {currentIndex + 1} of {shuffledCards.length}</span>
          <span>
            <span className="text-success">{knownCards.size} known</span>
            {' • '}
            <span className="text-destructive">{unknownCards.size} learning</span>
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div className="perspective-1000">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id + (isFlipped ? '-back' : '-front')}
            initial={{ rotateY: isFlipped ? -90 : 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: isFlipped ? 90 : -90, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={handleFlip}
            className="cursor-pointer"
          >
            <Card 
              className={cn(
                "min-h-[280px] p-8 flex flex-col items-center justify-center text-center transition-all",
                "hover:shadow-lg",
                isFlipped 
                  ? "bg-primary/5 border-primary/20" 
                  : "bg-card"
              )}
            >
              <div className="absolute top-4 right-4">
                <span className={cn(
                  "text-xs font-medium px-2 py-1 rounded-full",
                  isFlipped 
                    ? "bg-primary/10 text-primary" 
                    : "bg-muted text-muted-foreground"
                )}>
                  {isFlipped ? 'Answer' : 'Question'}
                </span>
              </div>
              
              <p className={cn(
                "text-xl font-medium leading-relaxed",
                isFlipped ? "text-primary" : "text-foreground"
              )}>
                {isFlipped ? currentCard.back : currentCard.front}
              </p>
              
              <p className="text-sm text-muted-foreground mt-6">
                {isFlipped ? 'Click to see question' : 'Click to reveal answer'}
              </p>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Know / Don't Know buttons */}
      {isFlipped && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center gap-4"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={markAsUnknown}
            className="gap-2 border-destructive/50 text-destructive hover:bg-destructive/10"
          >
            <X className="w-5 h-5" />
            Still Learning
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={markAsKnown}
            className="gap-2 border-success/50 text-success hover:bg-success/10"
          >
            <Check className="w-5 h-5" />
            Got It!
          </Button>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={prevCard}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={shuffleCards} className="gap-2">
            <Shuffle className="w-4 h-4" />
            Shuffle
          </Button>
          <Button variant="ghost" size="sm" onClick={resetDeck} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={nextCard}
          disabled={currentIndex === shuffledCards.length - 1}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Completion message */}
      {currentIndex === shuffledCards.length - 1 && isFlipped && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-4 bg-success/10 rounded-lg"
        >
          <p className="font-medium text-success">🎉 You've reviewed all cards!</p>
          <p className="text-sm text-muted-foreground mt-1">
            {knownCards.size} mastered • {unknownCards.size} need more practice
          </p>
        </motion.div>
      )}
    </div>
  );
}
