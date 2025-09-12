import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          toast({
            title: "Authenticatie mislukt",
            description: error.message,
            variant: "destructive",
          });
          navigate('/', { replace: true });
          return;
        }

        if (data.session) {
          toast({
            title: "Succesvol ingelogd",
            description: "Welkom bij AI Dagelijks!",
          });
        }

        // Redirect to the original page or home
        const redirectTo = sessionStorage.getItem('auth_redirect_to') || '/';
        sessionStorage.removeItem('auth_redirect_to');
        navigate(redirectTo, { replace: true });
        
      } catch (error) {
        console.error('Unexpected auth callback error:', error);
        navigate('/', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Authenticatie wordt verwerkt...</p>
      </div>
    </div>
  );
}