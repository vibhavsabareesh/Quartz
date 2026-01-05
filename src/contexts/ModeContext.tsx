import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

export type SupportMode = 
  | 'focus_support'
  | 'reading_support'
  | 'routine_low_overwhelm'
  | 'step_by_step_math'
  | 'sensory_safe'
  | 'motor_friendly'
  | 'energy_mode';

export type EnergyLevel = 'low' | 'normal' | 'high';

export interface UserPreferences {
  selectedModes: SupportMode[];
  timerPreset: 10 | 25 | 45;
  readingLargeFont: boolean;
  readingIncreasedSpacing: boolean;
  readingOneSectionAtATime: boolean;
  readingHighlightCurrent: boolean;
  sensoryReduceMotion: boolean;
  sensorySoundOff: boolean;
  motorLargeButtons: boolean;
}

export interface ExperienceProfile {
  // Computed from modes + energy
  defaultTimerMinutes: number;
  maxTasksToday: number;
  showQuickStart: boolean;
  microStepsGranularity: 'normal' | 'detailed';
  showEndingSoonBanner: boolean;
  untimed: boolean;
  mathStepMode: boolean;
  
  // CSS classes to apply
  bodyClasses: string[];
  
  // UI adjustments
  largeButtons: boolean;
  reducedChoices: boolean;
  consistentLayout: boolean;
  
  // Reading adjustments
  readingMode: {
    largeFont: boolean;
    increasedSpacing: boolean;
    oneSectionAtATime: boolean;
    highlightCurrent: boolean;
  };
  
  // Energy-based messaging
  energyMessage: string;
}

interface ModeContextType {
  preferences: UserPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences>>;
  energyLevel: EnergyLevel;
  setEnergyLevel: (level: EnergyLevel) => void;
  experienceProfile: ExperienceProfile;
  hasMode: (mode: SupportMode) => boolean;
  updateMode: (mode: SupportMode, enabled: boolean) => void;
  isGuestMode: boolean;
  setIsGuestMode: (value: boolean) => void;
}

const defaultPreferences: UserPreferences = {
  selectedModes: [],
  timerPreset: 25,
  readingLargeFont: false,
  readingIncreasedSpacing: false,
  readingOneSectionAtATime: false,
  readingHighlightCurrent: false,
  sensoryReduceMotion: false,
  sensorySoundOff: true,
  motorLargeButtons: false,
};

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('neuro-study-preferences');
    return saved ? { ...defaultPreferences, ...JSON.parse(saved) } : defaultPreferences;
  });
  
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>(() => {
    const saved = localStorage.getItem('neuro-study-energy-today');
    return (saved as EnergyLevel) || 'normal';
  });

  const [isGuestMode, setIsGuestMode] = useState(false);

  // Persist preferences
  useEffect(() => {
    localStorage.setItem('neuro-study-preferences', JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    localStorage.setItem('neuro-study-energy-today', energyLevel);
  }, [energyLevel]);

  const hasMode = (mode: SupportMode) => preferences.selectedModes.includes(mode);

  const updateMode = (mode: SupportMode, enabled: boolean) => {
    setPreferences(prev => ({
      ...prev,
      selectedModes: enabled
        ? [...prev.selectedModes, mode]
        : prev.selectedModes.filter(m => m !== mode),
    }));
  };

  // Compute experience profile based on modes and energy
  const experienceProfile = useMemo<ExperienceProfile>(() => {
    const modes = preferences.selectedModes;
    const hasFocus = modes.includes('focus_support');
    const hasReading = modes.includes('reading_support');
    const hasRoutine = modes.includes('routine_low_overwhelm');
    const hasMath = modes.includes('step_by_step_math');
    const hasSensory = modes.includes('sensory_safe');
    const hasMotor = modes.includes('motor_friendly');
    const hasEnergy = modes.includes('energy_mode');

    // Calculate default timer
    let defaultTimer: number = preferences.timerPreset;
    if (hasFocus && energyLevel !== 'low') {
      defaultTimer = 25;
    }
    if (energyLevel === 'low') {
      defaultTimer = Math.min(defaultTimer, 15);
    }
    if (energyLevel === 'high') {
      defaultTimer = Math.max(defaultTimer, 45);
    }

    // Calculate max tasks
    let maxTasks = 5;
    if (energyLevel === 'low') maxTasks = 2;
    if (energyLevel === 'high') maxTasks = 6;
    if (hasRoutine && maxTasks > 3) maxTasks = 3;

    // Build body classes
    const bodyClasses: string[] = [];
    if (hasSensory || preferences.sensoryReduceMotion) {
      bodyClasses.push('sensory-safe');
    }
    if (hasReading) {
      bodyClasses.push('reading-support');
    }
    if (hasMotor || preferences.motorLargeButtons) {
      bodyClasses.push('motor-friendly');
    }

    // Energy messages
    let energyMessage = "You've got this!";
    if (energyLevel === 'low') {
      energyMessage = "Minimum viable progress is enough today. Be gentle with yourself.";
    } else if (energyLevel === 'high') {
      energyMessage = "Feeling energetic! Let's make great progress.";
    }

    return {
      defaultTimerMinutes: defaultTimer,
      maxTasksToday: maxTasks,
      showQuickStart: hasFocus,
      microStepsGranularity: hasFocus ? 'detailed' : 'normal',
      showEndingSoonBanner: hasRoutine,
      untimed: hasMath,
      mathStepMode: hasMath,
      bodyClasses,
      largeButtons: hasMotor || preferences.motorLargeButtons,
      reducedChoices: hasRoutine,
      consistentLayout: hasRoutine,
      readingMode: {
        largeFont: hasReading || preferences.readingLargeFont,
        increasedSpacing: hasReading || preferences.readingIncreasedSpacing,
        oneSectionAtATime: hasReading || preferences.readingOneSectionAtATime,
        highlightCurrent: preferences.readingHighlightCurrent,
      },
      energyMessage,
    };
  }, [preferences, energyLevel]);

  // Apply body classes
  useEffect(() => {
    const body = document.body;
    // Remove all mode classes first
    body.classList.remove('sensory-safe', 'reading-support', 'motor-friendly');
    // Add new classes
    experienceProfile.bodyClasses.forEach(cls => body.classList.add(cls));
  }, [experienceProfile.bodyClasses]);

  return (
    <ModeContext.Provider
      value={{
        preferences,
        setPreferences,
        energyLevel,
        setEnergyLevel,
        experienceProfile,
        hasMode,
        updateMode,
        isGuestMode,
        setIsGuestMode,
      }}
    >
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
}
