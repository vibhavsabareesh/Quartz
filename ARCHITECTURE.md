# Architecture Guide

This guide walks you through the Quartz codebase in order of importance. If you're evaluating the project, demoing, or contributing, start here.

---

## Tier 1: Core System

These files are the heart of Quartz. They define what makes the app unique.

### `src/contexts/ModeContext.tsx`


This context manages:
- User preferences (selected modes, timer settings, reading options)
- The `experienceProfile` computation that determines how the entire UI behaves
- CSS class application to `document.body` for global styling
- The `hasMode()` helper used throughout the app

Key exports:
```typescript
const { hasMode, experienceProfile, energyLevel, setEnergyLevel } = useMode();
```

Read this first to understand how one selection cascades into dozens of UI changes.

---

### `src/lib/demo-data.ts`
**Mode definitions and AI adaptation logic.**

Contains:
- `SUPPORT_MODE_INFO` - All 7 support modes with labels, descriptions, and feature lists
- `generateMicroSteps()` - Creates task breakdowns (more granular for ADHD mode)
- `getAITutorSystemPrompt()` - Builds adaptive prompts based on active modes

This is where "Dyslexia mode means short sentences" gets defined.

---

### `src/pages/Onboarding.tsx`
**First-run experience and mode selection.**

The onboarding flow:
1. Select support modes (ADHD, Dyslexia, Autism, etc.)
2. Choose board and grade (CBSE/IGCSE, Class 6-12)
3. Fine-tune preferences (timer length, reading settings)

Modes are applied live during onboarding so users see changes immediately.

---

## Tier 2: Main Experience

Where users spend their time after onboarding.

### `src/pages/Home.tsx`
**Daily dashboard.**

Displays:
- Today's tasks with micro-steps preview
- Quick stats (XP, streak, focused minutes)
- Energy selector (for chronic fatigue mode)
- Quick Start button (for ADHD mode)

Adapts task count and UI density based on `experienceProfile`.

---

### `src/pages/FocusSession.tsx`
**Pomodoro-style study timer.**

Features:
- Coffee cup visual that drains as time passes
- Work/break cycles with long break after 4 cycles
- Micro-step progression during focus time
- Anti-escape detection (pauses if user leaves tab)
- Preset options: 10 min / 25 min / 45 min

Sensory-safe mode disables animations here.

---

### `src/components/AITutor.tsx`
**Adaptive AI chat interface.**

The AI tutor:
- Floats as a button in the corner, expands to chat panel
- Sends conversation + active modes to the backend
- Streams responses for real-time feel
- Adapts greeting and communication style per mode

Backend logic lives in `supabase/functions/ai-tutor/index.ts`.

---

## Tier 3: Content & Features

### `src/pages/Library.tsx`
Subject browser. Shows all available subjects with chapter counts.

### `src/pages/SubjectPage.tsx`
Chapter list for a subject. Displays progress per chapter.

### `src/pages/ChapterPage.tsx`
Individual chapter view with:
- Summary and key points
- Flashcard deck
- AI tutor context-aware of current chapter

### `src/components/FlashcardDeck.tsx`
Flashcard study component with flip animation, shuffle, and known/unknown tracking.

### `src/components/CoffeeCupTimer.tsx`
SVG-based coffee cup that visually shows time remaining. Steam animation disabled in sensory-safe mode.

### `src/pages/Progress.tsx`
Stats dashboard showing XP, streaks, session history, and badges.

### `src/pages/SessionEnd.tsx`
Post-session summary with XP earned and encouragement.

---

## Tier 4: Infrastructure

### `src/App.tsx`
Router setup and provider hierarchy (Auth → Mode → Query).

### `src/contexts/AuthContext.tsx`
Supabase authentication wrapper. Handles sign up, sign in, and session state.

### `src/integrations/supabase/client.ts`
Supabase client initialization.

### `src/integrations/supabase/types.ts`
TypeScript types generated from database schema.

### `src/lib/cbse-content.ts`
Static curriculum data for CBSE board.

### `src/pages/Settings.tsx`
User preferences editor. Can modify modes and settings post-onboarding.

### `src/pages/Auth.tsx`
Login/signup page.

### `src/pages/Welcome.tsx`
Landing page with value proposition and CTA.

---

## Tier 5: Supabase Edge Functions

### `supabase/functions/ai-tutor/index.ts`
Handles AI chat requests. Builds system prompt from modes, calls OpenAI, streams response.

### `supabase/functions/summarize-notes/index.ts`
Generates summaries from uploaded notes.

### `supabase/functions/seed-content/index.ts`
Seeds database with curriculum content.

---

## Tier 6: UI Components

### `src/components/ui/*`
Standard shadcn/ui components (Button, Card, Dialog, etc.). These are important but not unique to Quartz.

Notable custom additions:
- `energy-selector.tsx` - Low/Normal/High energy picker
- `mode-card.tsx` - Support mode selection card
- `progress-ring.tsx` - Circular progress indicator

---

## Database Schema

Located in `supabase/migrations/`. Key tables:

| Table | Purpose |
|-------|---------|
| `profiles` | User settings, selected modes, board/grade |
| `daily_tasks` | Today's tasks with micro-steps array |
| `focus_sessions` | Session history with duration and status |
| `user_progress` | XP, streaks, total focused minutes |
| `subjects` | Subject definitions per board |
| `chapters` | Chapter content with summaries and flashcards |
| `user_subjects` | Which subjects a user is studying |

---

<p align="center">
  <strong>Quartz</strong> — Study your way.
</p>
