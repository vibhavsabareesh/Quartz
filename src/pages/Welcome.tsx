import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, Brain, Heart } from 'lucide-react';
import { useOnboarding } from '@/App';

export default function Welcome() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const { startOnboarding } = useOnboarding();

  useEffect(() => {
    const completed = localStorage.getItem('quartz-onboarding-complete');
    setHasCompletedOnboarding(completed === 'true');
  }, []);

  const handleStartAsGuest = () => {
    startOnboarding();
  };

  return (
    <div className="min-h-screen gradient-calm flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-card border shadow-lg flex items-center justify-center">
            <img src="/quartz-logo.png" alt="Quartz" className="w-14 h-14" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Quartz
          </h1>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            Study your way. An adaptive learning environment that works with how you learn best.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12"
        >
          <div className="p-6 rounded-xl bg-card border shadow-sm">
            <Sparkles className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Personalized</h3>
            <p className="text-sm text-muted-foreground">
              Adapts to your needs, pacing, and preferences
            </p>
          </div>
          <div className="p-6 rounded-xl bg-card border shadow-sm">
            <Brain className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Focus-Friendly</h3>
            <p className="text-sm text-muted-foreground">
              Clear next actions and micro-steps for every task
            </p>
          </div>
          <div className="p-6 rounded-xl bg-card border shadow-sm">
            <Heart className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Calm Design</h3>
            <p className="text-sm text-muted-foreground">
              No overwhelming interfaces or sensory overload
            </p>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button asChild size="lg" className="text-lg px-8">
            <Link to="/auth">Get Started</Link>
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="text-lg px-8"
            onClick={handleStartAsGuest}
          >
            {hasCompletedOnboarding ? 'Continue as Guest' : 'Try as Guest'}
          </Button>
        </motion.div>

        {/* Quick demo info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-sm text-muted-foreground"
        >
          CBSE Class 9 content pre-loaded • AI-guided onboarding for new users
        </motion.p>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground border-t bg-background/50">
        <p>
          Quartz is a study tool, not a medical device. It does not diagnose, treat, or cure any condition.
        </p>
      </footer>
    </div>
  );
}
