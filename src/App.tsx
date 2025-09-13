import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
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
          <TooltipProvider>
            <Toaster />
            <Sonner />
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
            
            <Route path="/:slug" element={<Topic />} />
            <Route path="/rss-feeds" element={<RSSFeeds />} />
            <Route path="/search" element={<Search />} />
            <Route path="/meer" element={<Meer />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
