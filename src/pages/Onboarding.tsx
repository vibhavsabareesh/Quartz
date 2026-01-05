import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMode, SupportMode } from '@/contexts/ModeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ModeCard } from '@/components/ui/mode-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { SUPPORT_MODE_INFO, BOARDS, GRADES, DEFAULT_SUBJECTS, TIMER_PRESETS } from '@/lib/demo-data';
import { ArrowLeft, ArrowRight, Check, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const STEPS = ['support', 'academics', 'preferences'] as const;

export default function Onboarding() {
  const [searchParams] = useSearchParams();
  const isGuest = searchParams.get('guest') === 'true';
  
  const [step, setStep] = useState(0);
  const [selectedModes, setSelectedModes] = useState<SupportMode[]>([]);
  const [board, setBoard] = useState<string>('CBSE');
  const [grade, setGrade] = useState<number>(8);
  const [subjects, setSubjects] = useState<string[]>(['Mathematics', 'English', 'Science']);
  const [timerPreset, setTimerPreset] = useState<10 | 25 | 45>(25);
  const [readingSettings, setReadingSettings] = useState({
    largeFont: false,
    increasedSpacing: false,
    oneSectionAtATime: false,
    highlightCurrent: false,
  });
  const [sensorySettings, setSensorySettings] = useState({
    reduceMotion: false,
    soundOff: true,
  });
  const [motorSettings, setMotorSettings] = useState({
    largeButtons: false,
  });

  const { setPreferences, setIsGuestMode } = useMode();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isGuest) {
      setIsGuestMode(true);
    }
  }, [isGuest, setIsGuestMode]);

  const toggleMode = (mode: SupportMode) => {
    setSelectedModes(prev =>
      prev.includes(mode)
        ? prev.filter(m => m !== mode)
        : [...prev, mode]
    );
  };

  const toggleSubject = (subject: string) => {
    setSubjects(prev =>
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const handleComplete = async () => {
    // Update mode context
    setPreferences({
      selectedModes,
      timerPreset,
      readingLargeFont: readingSettings.largeFont,
      readingIncreasedSpacing: readingSettings.increasedSpacing,
      readingOneSectionAtATime: readingSettings.oneSectionAtATime,
      readingHighlightCurrent: readingSettings.highlightCurrent,
      sensoryReduceMotion: sensorySettings.reduceMotion,
      sensorySoundOff: sensorySettings.soundOff,
      motorLargeButtons: motorSettings.largeButtons,
    });

    // Save to database if logged in
    if (user && !isGuest) {
      try {
        await supabase.from('profiles').update({
          board: board as 'CBSE' | 'IGCSE',
          grade,
          selected_modes: selectedModes,
          timer_preset: timerPreset,
          reading_large_font: readingSettings.largeFont,
          reading_increased_spacing: readingSettings.increasedSpacing,
          reading_one_section_at_a_time: readingSettings.oneSectionAtATime,
          reading_highlight_current: readingSettings.highlightCurrent,
          sensory_reduce_motion: sensorySettings.reduceMotion,
          sensory_sound_off: sensorySettings.soundOff,
          motor_large_buttons: motorSettings.largeButtons,
          onboarding_completed: true,
        }).eq('user_id', user.id);

        // Save subjects
        await supabase.from('user_subjects').delete().eq('user_id', user.id);
        if (subjects.length > 0) {
          await supabase.from('user_subjects').insert(
            subjects.map(s => ({ user_id: user.id, subject_name: s }))
          );
        }
      } catch (error) {
        console.error('Error saving preferences:', error);
      }
    }

    toast({
      title: 'Welcome to NeuroStudy!',
      description: 'Your personalized learning environment is ready.',
    });
    navigate('/home');
  };

  const canProceed = () => {
    if (step === 0) return true; // Modes are optional
    if (step === 1) return board && grade && subjects.length > 0;
    return true;
  };

  return (
    <div className="min-h-screen gradient-calm py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary flex items-center justify-center">
            <Target className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Let's personalize your experience</h1>
          
          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    i < step
                      ? 'bg-primary text-primary-foreground'
                      : i === step
                      ? 'bg-primary/20 text-primary border-2 border-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-12 h-1 rounded ${i < step ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>How should the app support you?</CardTitle>
                  <CardDescription>
                    Select all that apply. These will customize your experience.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(Object.entries(SUPPORT_MODE_INFO) as [SupportMode, typeof SUPPORT_MODE_INFO[SupportMode]][]).map(
                      ([mode, info]) => (
                        <ModeCard
                          key={mode}
                          icon={info.icon}
                          label={info.label}
                          description={info.description}
                          selected={selectedModes.includes(mode)}
                          onToggle={() => toggleMode(mode)}
                        />
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Your academics</CardTitle>
                  <CardDescription>
                    Tell us about what you're studying
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Board</Label>
                      <Select value={board} onValueChange={setBoard}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select board" />
                        </SelectTrigger>
                        <SelectContent>
                          {BOARDS.map(b => (
                            <SelectItem key={b} value={b}>{b}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Grade</Label>
                      <Select value={String(grade)} onValueChange={v => setGrade(Number(v))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {GRADES.map(g => (
                            <SelectItem key={g} value={String(g)}>Grade {g}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Subjects</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {DEFAULT_SUBJECTS.map(sub => (
                        <div
                          key={sub.name}
                          className="flex items-center space-x-3"
                        >
                          <Checkbox
                            id={sub.name}
                            checked={subjects.includes(sub.name)}
                            onCheckedChange={() => toggleSubject(sub.name)}
                          />
                          <Label htmlFor={sub.name} className="flex items-center gap-2 cursor-pointer">
                            <span>{sub.icon}</span>
                            {sub.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Your preferences</CardTitle>
                  <CardDescription>
                    Preview and adjust your settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Timer Preset */}
                  <div className="space-y-3">
                    <Label>Default focus timer</Label>
                    <div className="flex gap-3">
                      {TIMER_PRESETS.map(preset => (
                        <button
                          key={preset.value}
                          onClick={() => setTimerPreset(preset.value)}
                          className={`flex-1 p-4 rounded-lg border-2 text-center transition-all ${
                            timerPreset === preset.value
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="text-lg font-bold">{preset.label}</div>
                          <div className="text-xs text-muted-foreground">{preset.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reading Support Preview */}
                  {selectedModes.includes('reading_support') && (
                    <div className="space-y-3 p-4 rounded-lg bg-muted/50">
                      <Label className="text-base font-semibold">Reading Display</Label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="large-font">Larger text</Label>
                          <Switch
                            id="large-font"
                            checked={readingSettings.largeFont}
                            onCheckedChange={v => setReadingSettings(p => ({ ...p, largeFont: v }))}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="spacing">Increased spacing</Label>
                          <Switch
                            id="spacing"
                            checked={readingSettings.increasedSpacing}
                            onCheckedChange={v => setReadingSettings(p => ({ ...p, increasedSpacing: v }))}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="one-section">One section at a time</Label>
                          <Switch
                            id="one-section"
                            checked={readingSettings.oneSectionAtATime}
                            onCheckedChange={v => setReadingSettings(p => ({ ...p, oneSectionAtATime: v }))}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="highlight">Highlight current section</Label>
                          <Switch
                            id="highlight"
                            checked={readingSettings.highlightCurrent}
                            onCheckedChange={v => setReadingSettings(p => ({ ...p, highlightCurrent: v }))}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sensory Safe Preview */}
                  {selectedModes.includes('sensory_safe') && (
                    <div className="space-y-3 p-4 rounded-lg bg-muted/50">
                      <Label className="text-base font-semibold">Sensory Settings</Label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="reduce-motion">Reduce motion</Label>
                          <Switch
                            id="reduce-motion"
                            checked={sensorySettings.reduceMotion}
                            onCheckedChange={v => setSensorySettings(p => ({ ...p, reduceMotion: v }))}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="sound-off">Sound off</Label>
                          <Switch
                            id="sound-off"
                            checked={sensorySettings.soundOff}
                            onCheckedChange={v => setSensorySettings(p => ({ ...p, soundOff: v }))}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Motor Friendly Preview */}
                  {selectedModes.includes('motor_friendly') && (
                    <div className="space-y-3 p-4 rounded-lg bg-muted/50">
                      <Label className="text-base font-semibold">Motor Settings</Label>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="large-buttons">Large buttons</Label>
                        <Switch
                          id="large-buttons"
                          checked={motorSettings.largeButtons}
                          onCheckedChange={v => setMotorSettings(p => ({ ...p, largeButtons: v }))}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {step < STEPS.length - 1 ? (
            <Button
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleComplete}>
              <Check className="w-4 h-4 mr-2" />
              Complete Setup
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
