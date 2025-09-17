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
import PaperPage from "./pages/PaperPage";
import NetBinnen from "./pages/NetBinnen";
import Profile from "./pages/Profile";
import Preferences from "./pages/Preferences";
import MijnNieuws from "./pages/MijnNieuws";
import OverOns from "./pages/OverOns";
import Nieuwsbrief from "./pages/Nieuwsbrief";
import AiCursussen from "./pages/AiCursussen";
import AiJobs from "./pages/AiJobs";
import LmArena from "./pages/LmArena";

import Topic from "./pages/Topic";
import TopicPage from "./pages/TopicPage";
import TopicsRedirect from "./pages/TopicsRedirect";
import RSSFeeds from "./pages/RSSFeeds";
import Meer from "./pages/Meer";
import Search from "./pages/Search";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";

// Topic pages
import TextToTextLlms from "./pages/topics/TextToTextLlms";
import TextToImage from "./pages/topics/TextToImage";
import TextToSpeechSpeechToText from "./pages/topics/TextToSpeechSpeechToText";
import TextToVideo3D from "./pages/topics/TextToVideo3D";
import RoboticsEmbodiedAi from "./pages/topics/RoboticsEmbodiedAi";
import Gezondheidszorg from "./pages/topics/Gezondheidszorg";
import CreatieveIndustrie from "./pages/topics/CreatieveIndustrie";
import OnderwijsTraining from "./pages/topics/OnderwijsTraining";
import FinancienBusiness from "./pages/topics/FinancienBusiness";
import OverheidPubliekeSector from "./pages/topics/OverheidPubliekeSector";
import AiOnderzoekslabs from "./pages/topics/AiOnderzoekslabs";
import AcademischePublicaties from "./pages/topics/AcademischePublicaties";
import Modeldoorbraken from "./pages/topics/Modeldoorbraken";
import BigTech from "./pages/topics/BigTech";
import StartupsScaleUps from "./pages/topics/StartupsScaleUps";
import ChipmakersInfrastructuur from "./pages/topics/ChipmakersInfrastructuur";
import VerenigdeStaten from "./pages/topics/VerenigdeStaten";
import Europa from "./pages/topics/Europa";
import Azie from "./pages/topics/Azie";
import AiSafetyAlignment from "./pages/topics/AiSafetyAlignment";
import EthiekBias from "./pages/topics/EthiekBias";
import MilitairCyber from "./pages/topics/MilitairCyber";
import ArbeidsmarktSkills from "./pages/topics/ArbeidsmarktSkills";
import ProductiviteitAutomatisering from "./pages/topics/ProductiviteitAutomatisering";
import PubliekDebatCultuur from "./pages/topics/PubliekDebatCultuur";
import TopicsOverview from "./pages/TopicsOverview";

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
              <Route path="/papers/:slug" element={<PaperPage />} />
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
              <Route path="/topics/text-to-text-llms" element={<TextToTextLlms />} />
              <Route path="/topics/text-to-image" element={<TextToImage />} />
              <Route path="/topics/text-to-speech-speech-to-text" element={<TextToSpeechSpeechToText />} />
              <Route path="/topics/text-to-video-3d" element={<TextToVideo3D />} />
              <Route path="/topics/robotics-embodied-ai" element={<RoboticsEmbodiedAi />} />
              <Route path="/topics/gezondheidszorg" element={<Gezondheidszorg />} />
              <Route path="/topics/financien-business" element={<FinancienBusiness />} />
              <Route path="/topics/creatieve-industrie" element={<CreatieveIndustrie />} />
              <Route path="/topics/onderwijs-training" element={<OnderwijsTraining />} />
              <Route path="/topics/overheid-publieke-sector" element={<OverheidPubliekeSector />} />
              <Route path="/topics/ai-onderzoekslabs" element={<AiOnderzoekslabs />} />
              <Route path="/topics/academische-publicaties" element={<AcademischePublicaties />} />
              <Route path="/topics/modeldoorbraken" element={<Modeldoorbraken />} />
              <Route path="/topics/big-tech" element={<BigTech />} />
              <Route path="/topics/startups-scale-ups" element={<StartupsScaleUps />} />
              <Route path="/topics/chipmakers-infrastructuur" element={<ChipmakersInfrastructuur />} />
              <Route path="/topics/verenigde-staten" element={<VerenigdeStaten />} />
              <Route path="/topics/europa" element={<Europa />} />
              <Route path="/topics/azie" element={<Azie />} />
              <Route path="/topics/ai-safety-alignment" element={<AiSafetyAlignment />} />
              <Route path="/topics/ethiek-bias" element={<EthiekBias />} />
              <Route path="/topics/militair-cyber" element={<MilitairCyber />} />
              <Route path="/topics/arbeidsmarkt-skills" element={<ArbeidsmarktSkills />} />
              <Route path="/topics/productiviteit-automatisering" element={<ProductiviteitAutomatisering />} />
              <Route path="/topics/publiek-debat-cultuur" element={<PubliekDebatCultuur />} />
              
              {/* Additional pages */}
              <Route path="/over-ons" element={<OverOns />} />
              <Route path="/nieuwsbrief" element={<Nieuwsbrief />} />
              <Route path="/ai-cursussen" element={<AiCursussen />} />
              <Route path="/ai-jobs" element={<AiJobs />} />
              <Route path="/lm-arena" element={<LmArena />} />
              
              {/* Topics Overview */}
              <Route path="/topic" element={<TopicsOverview />} />
              
              {/* New topic page route */}
              <Route path="/topic/:slug" element={<TopicPage />} />
              
              {/* Redirect old topics routes */}
              <Route path="/topics/:slug" element={<TopicsRedirect />} />
              <Route path="/topics" element={<TopicsRedirect />} />
              
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
