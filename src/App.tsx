import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import HerbalDatabase from "./pages/HerbalDatabase";
import HerbalQuest from "./pages/HerbalQuest";
import EarthScan from "./pages/EarthScan";
import SymptomChecker from "./pages/SymptomChecker";
import HealthProfile from "./pages/HealthProfile";
import VoiceAssistant from "./pages/VoiceAssistant";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import MyScans from "./pages/MyScans";
import Community from "./pages/Community";
import SeasonalCalendar from "./pages/SeasonalCalendar";
import HerbalRecipes from "./pages/HerbalRecipes";
import DosageCalculator from "./pages/DosageCalculator";
import WellnessTips from "./pages/WellnessTips";
import OfflineMode from "./pages/OfflineMode";
import NotFound from "./pages/NotFound";
import HerbalChatBubble from "./components/HerbalChatBubble";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/herbal-database" element={<HerbalDatabase />} />
            <Route path="/herbal-quest" element={<HerbalQuest />} />
            <Route path="/earth-scan" element={<EarthScan />} />
            <Route path="/symptom-checker" element={<SymptomChecker />} />
            <Route path="/health-profile" element={<HealthProfile />} />
            <Route path="/voice-assistant" element={<VoiceAssistant />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-scans" element={<MyScans />} />
            <Route path="/community" element={<Community />} />
            <Route path="/seasonal-calendar" element={<SeasonalCalendar />} />
            <Route path="/herbal-recipes" element={<HerbalRecipes />} />
            <Route path="/dosage-calculator" element={<DosageCalculator />} />
            <Route path="/wellness-tips" element={<WellnessTips />} />
            <Route path="/offline-mode" element={<OfflineMode />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <HerbalChatBubble />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
