import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';

const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (USE_MOCK_AUTH) {
      // Skip authentication checks in mock mode
      return;
    }
    
    if (!loading && !user) {
      // Store the current path for redirect after login
      sessionStorage.setItem('auth_redirect_to', window.location.pathname);
      setShowAuthModal(true);
    }
  }, [user, loading]);

  // In mock mode, always allow access
  if (USE_MOCK_AUTH) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <p>Je moet ingelogd zijn om deze pagina te bekijken.</p>
        </div>
        <AuthModal
          open={showAuthModal}
          onOpenChange={(open) => {
            setShowAuthModal(open);
            if (!open) {
              // If they close the modal without logging in, redirect to home
              window.location.href = '/';
            }
          }}
        />
      </>
    );
  }

  return <>{children}</>;
}