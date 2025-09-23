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
import RSSFeeds from "./pages/RSSFeeds";
import Meer from "./pages/Meer";
import Search from "./pages/Search";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";
import SitemapXml from "./components/SitemapXml";
import SitemapIndex from "./components/SitemapIndex";
import SitemapStatic from "./components/SitemapStatic";
import SitemapArticles from "./components/SitemapArticles";
import SitemapTopics from "./components/SitemapTopics";
import SitemapPapers from "./components/SitemapPapers";

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
              
              
              <Route path="/:slug" element={<Topic />} />
              <Route path="/rss-feeds" element={<RSSFeeds />} />
              <Route path="/search" element={<Search />} />
              <Route path="/meer" element={<Meer />} />
            <Route path="/sitemap_index.xml" element={<SitemapIndex />} />
            <Route path="/sitemap.xml" element={<SitemapXml />} />
            <Route path="/sitemap-static.xml" element={<SitemapStatic />} />
            <Route path="/sitemap-articles.xml" element={<SitemapArticles />} />
            <Route path="/sitemap-topics.xml" element={<SitemapTopics />} />
            <Route path="/sitemap-papers.xml" element={<SitemapPapers />} />
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
