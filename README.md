# Quartz 💎

**Adaptive learning for every mind.**

Quartz is an AI-powered study platform that transforms the entire learning experience based on each student's unique cognitive needs. Whether a student has ADHD, dyslexia, autism, sensory sensitivities, or fluctuating energy levels, Quartz adapts the UI, content pacing, and AI tutor personality automatically.

## The Problem

15-20% of students have a learning difference, yet 70% lack proper accommodations in digital learning tools. Current EdTech treats all learners the same:

- **ADHD students** face apps with too many choices and no clear next action
- **Dyslexic learners** encounter walls of text with poor formatting
- **Autistic students** deal with unpredictable interfaces and sensory overload
- **Students with chronic fatigue** have no way to adjust workload based on energy

## Our Solution

Quartz offers **one app with infinite adaptations**. During onboarding, students select their support modes, and the entire experience transforms:

| Mode | What Changes |
|------|--------------|
| **ADHD** | Quick-start buttons, micro-steps for every task, Pomodoro timers, minimal clutter, XP & streaks for motivation |
| **Dyslexia** | OpenDyslexic font, wider spacing, shorter line widths, one section at a time, simplified AI explanations |
| **Autism** | Fixed layouts, reduced choices (max 3 tasks), no surprise popups, predictable transitions |
| **Sensory Sensitivity** | No animations, muted colors, no flashing, sound off, calm static interface |
| **Dyscalculia** | One math step at a time, visual grouping, no timed problems |
| **Motor Difficulties** | Extra-large buttons, no drag-and-drop, easy-reach positioning |
| **Chronic Fatigue** | Daily energy check-in, fewer tasks on low days, shorter default sessions |

Students can combine multiple modes, and preferences are fine-tuned further in settings.

## Key Features

### 🎯 Focus Sessions
Pomodoro-style focus timer with a visual coffee cup that empties as time passes. Includes work/break cycles, session tracking, and anti-distraction features.

### 📚 CBSE Curriculum Library
Pre-loaded content for Classes 6-12 across Mathematics, Science, English, Social Studies, and Computer Science. Chapters include summaries, key points, and flashcards.

### 🤖 AI Tutor
Context-aware AI assistant that adapts its communication style based on selected modes. Dyslexia mode gets short sentences and simple words. ADHD mode gets punchy responses with clear next actions.

### 📊 Progress Tracking
XP system, streaks, focused minutes, and session history. Badges for milestones like first session, 7-day streaks, and 5 hours of focus time.

### ⚡ Energy-Aware Scheduling
For students with chronic fatigue or variable energy, a daily check-in adjusts the number of tasks and session lengths automatically.

---

## Technical Overview

> 📖 **New to the codebase?** Read [ARCHITECTURE.md](ARCHITECTURE.md) for a guided walkthrough of files in order of importance.

### Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Animation**: Framer Motion (disabled in sensory-safe mode)
- **State Management**: React Context + TanStack Query
- **Backend**: Supabase (Auth, PostgreSQL, Edge Functions)
- **AI**: Google Gemini 2.5 Flash via Lovable AI Gateway

### Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── layout/          # App layout wrapper
│   ├── AITutor.tsx      # AI chat interface
│   ├── CoffeeCupTimer.tsx
│   ├── FlashcardDeck.tsx
│   └── ...
├── contexts/
│   ├── AuthContext.tsx  # Supabase auth
│   └── ModeContext.tsx  # Adaptive mode system (core logic)
├── pages/
│   ├── Home.tsx         # Daily task dashboard
│   ├── FocusSession.tsx # Pomodoro timer
│   ├── Onboarding.tsx   # Mode selection flow
│   ├── Library.tsx      # Subject/chapter browser
│   └── ...
├── lib/
│   ├── demo-data.ts     # Mode definitions, micro-step generation
│   └── cbse-content.ts  # Curriculum data
└── integrations/
    └── supabase/        # Client + types
```

### Core Architecture

**ModeContext** is the heart of the adaptive system. It:

1. Stores user preferences (selected modes, timer presets, reading settings)
2. Computes an `experienceProfile` based on active modes + energy level
3. Applies CSS classes to `document.body` for global styling changes
4. Exposes `hasMode()` helper for conditional rendering

```typescript
// Example: Check if user has ADHD mode enabled
const { hasMode, experienceProfile } = useMode();

if (hasMode('adhd')) {
  // Show quick-start button
}

// experienceProfile contains computed values like:
// - defaultTimerMinutes
// - maxTasksToday
// - showQuickStart
// - readingMode.dyslexiaFont
// - sensoryMode.reduceMotion
```

### Database Schema (Supabase)

Key tables:
- `profiles` - User settings, selected modes, board/grade
- `daily_tasks` - Today's study tasks with micro-steps
- `focus_sessions` - Session history with duration and completion status
- `user_progress` - XP, streaks, total focused minutes
- `chapters` - Curriculum content by board/grade/subject

### AI Tutor System

The AI tutor adapts its system prompt based on active modes:

```typescript
// From lib/demo-data.ts
if (modes.includes('dyslexia')) {
  prompt += `
    - Use SHORT sentences only (max 10-12 words)
    - Break explanations into bullet points
    - Use simple, common words
  `;
}

if (modes.includes('adhd')) {
  prompt += `
    - Start with the KEY POINT immediately
    - Keep responses SHORT and punchy
    - End with a clear NEXT ACTION
  `;
}
```

---

## Getting Started

### Prerequisites

- Node.js 18+ (install via [nvm](https://github.com/nvm-sh/nvm))
- A Supabase project (for auth and database)

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd Quartz

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Supabase URL and anon key to .env

# Start development server
npm run dev
```

### Environment Variables

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

### Demo Mode

You can explore the app without an account using Guest Mode. Select "Try as Guest" during onboarding to see the adaptive features with demo data.

---

## Roadmap

- [ ] Additional curriculum support (IGCSE, State Boards)
- [ ] Parent/teacher dashboard for progress monitoring
- [ ] Offline mode with service workers
- [ ] Voice input for motor difficulties mode
- [ ] Spaced repetition for flashcards
- [ ] Multi-language support

---

<p align="center">
  <strong>Quartz</strong> — Study your way.
</p>
