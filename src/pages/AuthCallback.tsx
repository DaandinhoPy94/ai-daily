import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');

        if (code) {
          // Finalize PKCE and create a real session
          await supabase.auth.exchangeCodeForSession(code);
        } else {
          // Fallback for hash-based provider responses
          await supabase.auth.getSession();
        }

        // Optional: small delay so onAuthStateChange can run and ensureProfile fires
        await new Promise(r => setTimeout(r, 50));

        const { data } = await supabase.auth.getSession();
        if (data.session) {
          toast({ title: 'Succesvol ingelogd', description: 'Welkom bij AI Dagelijks!' });
        }
      } catch (err: any) {
        console.error('Auth callback error:', err);
        toast({ title: 'Authenticatie mislukt', description: String(err?.message ?? err), variant: 'destructive' });
      } finally {
        const redirectTo = sessionStorage.getItem('auth_redirect_to') || '/';
        sessionStorage.removeItem('auth_redirect_to');
        navigate(redirectTo, { replace: true });
      }
    })();
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