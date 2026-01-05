// Demo data for guest mode and initial seeding

export const SUPPORT_MODE_INFO = {
  focus_support: {
    label: 'Focus Support',
    description: 'For those who benefit from shorter sessions, clear next actions, and quick wins',
    icon: '🎯',
  },
  reading_support: {
    label: 'Reading Support',
    description: 'Larger text, increased spacing, and content chunked into digestible sections',
    icon: '📖',
  },
  routine_low_overwhelm: {
    label: 'Routine & Low Overwhelm',
    description: 'Consistent layouts, fewer choices, and predictable transitions',
    icon: '🧘',
  },
  step_by_step_math: {
    label: 'Step-by-step Math',
    description: 'Math problems broken into visual steps with no time pressure',
    icon: '🔢',
  },
  sensory_safe: {
    label: 'Sensory-Safe Mode',
    description: 'No flashing, minimal animations, calm and static interface',
    icon: '✨',
  },
  motor_friendly: {
    label: 'Motor-Friendly UI',
    description: 'Larger buttons, no drag-and-drop, easy-to-reach controls',
    icon: '👆',
  },
  energy_mode: {
    label: 'Energy Mode',
    description: 'Adapts task load and pacing based on your daily energy level',
    icon: '⚡',
  },
};

export const BOARDS = ['CBSE', 'IGCSE'] as const;

export const GRADES = [6, 7, 8, 9, 10, 11, 12] as const;

export const DEFAULT_SUBJECTS = [
  { name: 'Mathematics', icon: '📐' },
  { name: 'English', icon: '📚' },
  { name: 'Science', icon: '🔬' },
  { name: 'Computer Science', icon: '💻' },
  { name: 'Social Studies', icon: '🌍' },
];

export const TIMER_PRESETS = [
  { value: 10, label: '10 min', description: 'Quick focus burst' },
  { value: 25, label: '25 min', description: 'Pomodoro classic' },
  { value: 45, label: '45 min', description: 'Deep work session' },
] as const;

export const BADGES = [
  { id: 'first_session', name: 'First Step', description: 'Complete your first focus session', icon: '🌱' },
  { id: 'streak_3', name: '3 Day Streak', description: 'Study 3 days in a row', icon: '🔥' },
  { id: 'streak_7', name: 'Week Warrior', description: 'Study 7 days in a row', icon: '⭐' },
  { id: 'hours_5', name: 'Five Hours', description: 'Accumulate 5 hours of focus time', icon: '🏆' },
  { id: 'chapters_10', name: 'Bookworm', description: 'Complete 10 chapters', icon: '📚' },
];

export function generateMicroSteps(taskTitle: string, isDetailed: boolean): string[] {
  const baseSteps = [
    `Open ${taskTitle} materials`,
    'Read the summary',
    'Review key points',
    'Attempt practice questions',
    'Note any doubts',
  ];

  if (isDetailed) {
    return [
      `Find a quiet spot to study`,
      `Open ${taskTitle} materials`,
      'Take 3 deep breaths',
      'Read the first paragraph of the summary',
      'Pause and think about what you read',
      'Continue reading the rest of the summary',
      'Look at the first key point',
      'Try to explain it in your own words',
      'Continue with remaining key points',
      'Open the practice questions',
      'Read the first question carefully',
      'Try to answer without looking at options',
      'Check your answer',
      'Continue with remaining questions',
      'Write down any concepts you need to revisit',
      'Take a moment to celebrate your progress!',
    ];
  }

  return baseSteps;
}

export function generateDailyTasks(
  subjects: string[],
  maxTasks: number,
  chapters: any[]
): any[] {
  const tasks: any[] = [];
  const shuffledSubjects = [...subjects].sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < Math.min(maxTasks, shuffledSubjects.length); i++) {
    const subject = shuffledSubjects[i];
    const subjectChapters = chapters.filter(c => 
      c.subjects?.name === subject || c.subject_name === subject
    );
    
    if (subjectChapters.length > 0) {
      const chapter = subjectChapters[Math.floor(Math.random() * subjectChapters.length)];
      tasks.push({
        title: chapter.title,
        subject_name: subject,
        chapter_id: chapter.id,
        estimated_minutes: 25,
        micro_steps: generateMicroSteps(chapter.title, false),
      });
    }
  }
  
  return tasks;
}
