import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import { StockProvider } from "@/contexts/StockProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DevModeIndicator } from "@/components/DevModeIndicator";
import ResponsiveIndex from "./pages/ResponsiveIndex";
import ArticleDetail from "./pages/ArticleDetail";
import NetBinnen from "./pages/NetBinnen";
import Profile from "./pages/Profile";
import Preferences from "./pages/Preferences";
import MijnNieuws from "./pages/MijnNieuws";

import Topic from "./pages/Topic";
import RSSFeeds from "./pages/RSSFeeds";
import Meer from "./pages/Meer";
import Search from "./pages/Search";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";

// Topic pages
import TechnologieModellen from "./pages/topics/TechnologieModellen";
import TextToTextLlms from "./pages/topics/TextToTextLlms";
import TextToImage from "./pages/topics/TextToImage";
import TextToSpeechSpeechToText from "./pages/topics/TextToSpeechSpeechToText";
import Gezondheidszorg from "./pages/topics/Gezondheidszorg";
import CreatieveIndustrie from "./pages/topics/CreatieveIndustrie";
import BigTech from "./pages/topics/BigTech";
import StartupsScaleUps from "./pages/topics/StartupsScaleUps";
import AiSafetyAlignment from "./pages/topics/AiSafetyAlignment";
import EthiekBias from "./pages/topics/EthiekBias";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          <StockProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <DevModeIndicator />
            <BrowserRouter>
            <Routes>
              <Route path="/" element={<ResponsiveIndex />} />
              <Route path="/artikel/:slug" element={<ArticleDetail />} />
              <Route path="/net-binnen" element={<NetBinnen />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/preferences" element={
                <ProtectedRoute>
                  <Preferences />
                </ProtectedRoute>
              } />
              <Route path="/mijn-nieuws" element={
                <ProtectedRoute>
                  <MijnNieuws />
                </ProtectedRoute>
              } />
              
              {/* Topic pages */}
              <Route path="/topics/technologie-modellen" element={<TechnologieModellen />} />
              <Route path="/topics/text-to-text-llms" element={<TextToTextLlms />} />
              <Route path="/topics/text-to-image" element={<TextToImage />} />
              <Route path="/topics/text-to-speech-speech-to-text" element={<TextToSpeechSpeechToText />} />
              <Route path="/topics/gezondheidszorg" element={<Gezondheidszorg />} />
              <Route path="/topics/creatieve-industrie" element={<CreatieveIndustrie />} />
              <Route path="/topics/big-tech" element={<BigTech />} />
              <Route path="/topics/startups-scale-ups" element={<StartupsScaleUps />} />
              <Route path="/topics/ai-safety-alignment" element={<AiSafetyAlignment />} />
              <Route path="/topics/ethiek-bias" element={<EthiekBias />} />
              
              <Route path="/:slug" element={<Topic />} />
              <Route path="/rss-feeds" element={<RSSFeeds />} />
              <Route path="/search" element={<Search />} />
              <Route path="/meer" element={<Meer />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </StockProvider>
      </AuthProvider>
    </ThemeProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
