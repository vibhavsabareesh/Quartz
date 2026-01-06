import { useState, createContext, useContext } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ModeProvider } from "@/contexts/ModeContext";

import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import FocusSession from "./pages/FocusSession";
import SessionEnd from "./pages/SessionEnd";
import Library from "./pages/Library";
import SubjectPage from "./pages/SubjectPage";
import ChapterPage from "./pages/ChapterPage";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";
import NotesGenerator from "./pages/NotesGenerator";
import QuartzRoad from "./pages/QuartzRoad";
import ChemistryInteractive from "./pages/ChemistryInteractive";
import NotFound from "./pages/NotFound";
import { OnboardingGuide } from "./components/OnboardingGuide";

const queryClient = new QueryClient();

// Onboarding context to manage the tour state globally
interface OnboardingContextType {
  isOnboarding: boolean;
  startOnboarding: () => void;
  endOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) throw new Error("useOnboarding must be used within OnboardingProvider");
  return context;
};

function AppContent() {
  const [isOnboarding, setIsOnboarding] = useState(false);
  const navigate = useNavigate();

  const startOnboarding = () => setIsOnboarding(true);
  const endOnboarding = () => {
    setIsOnboarding(false);
    navigate('/auth');
  };

  return (
    <OnboardingContext.Provider value={{ isOnboarding, startOnboarding, endOnboarding }}>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/home" element={<Home />} />
        <Route path="/focus/:taskId" element={<FocusSession />} />
        <Route path="/session-end" element={<SessionEnd />} />
        <Route path="/library" element={<Library />} />
        <Route path="/subject/:subjectName" element={<SubjectPage />} />
        <Route path="/chapter/:chapterId" element={<ChapterPage />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/notes" element={<NotesGenerator />} />
        <Route path="/quartz-road" element={<QuartzRoad />} />
        <Route path="/chemistry-interactive" element={<ChemistryInteractive />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {isOnboarding && <OnboardingGuide onComplete={endOnboarding} />}
    </OnboardingContext.Provider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ModeProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </ModeProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
