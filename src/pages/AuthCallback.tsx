import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ensureUserProfile } from '@/lib/ensureProfile';
import { createAuthDebug, redactAuthContext, insertAuthDebugEvent } from '@/lib/authDebug';

export default function AuthCallback() {
  const navigate = useNavigate();
  const dbg = createAuthDebug('callback');

  useEffect(() => {
    (async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        const state = url.searchParams.get('state');
        const error = url.searchParams.get('error');
        const errorDescription = url.searchParams.get('error_description');
        
        dbg.log('url', redactAuthContext({ urlParams: { code, state } }));
        await insertAuthDebugEvent({ context: 'callback', event: 'start', payload: { has_code: !!code, has_state: !!state } });
        
        // Check for OAuth errors first
        if (error) {
          const err = new Error(`OAuth error: ${error} - ${errorDescription || 'No description'}`);
          await insertAuthDebugEvent({ context: 'callback', event: 'oauth_error', payload: { error, errorDescription } });
          throw err;
        }

        let session = null;
        
        if (code) {
          // Exchange OAuth code for session
          const { data, error: exchangeError } = await dbg.time('exchangeCodeForSession', async () => {
            return await supabase.auth.exchangeCodeForSession(code);
          });
          
          if (exchangeError) {
            dbg.error('Exchange code failed', exchangeError);
            await insertAuthDebugEvent({ context: 'callback', event: 'exchange_error', payload: exchangeError });
            throw exchangeError;
          }
          
          session = data?.session;
          dbg.log('session:exchanged', { hasSession: !!session, userId: session?.user?.id });
          await insertAuthDebugEvent({ context: 'callback', event: 'exchange_success', payload: { has_session: !!session, user_id: session?.user?.id } });
        } else {
          // Try to get existing session (for magic link or refresh)
          const { data } = await dbg.time('getSession(no-code)', async () => {
            return await supabase.auth.getSession();
          });
          session = data?.session;
          dbg.log('session:existing', { hasSession: !!session, userId: session?.user?.id });
          await insertAuthDebugEvent({ context: 'callback', event: 'get_session_result', payload: { has_session: !!session, user_id: session?.user?.id } });
        }
        
        // Only ensure profile if we have a valid session
        if (session?.user) {
          const profile = await dbg.time('ensureUserProfile', async () => {
            return await ensureUserProfile();
          });
          
          if (!profile) {
            dbg.error('Profile creation failed', { userId: session.user.id });
            // Don't throw - profile might exist but RLS blocked the read
            console.warn('Could not verify profile creation - this may be normal due to RLS');
            await insertAuthDebugEvent({ context: 'callback', event: 'ensure_profile_missing', payload: { user_id: session.user.id } });
          } else {
            dbg.log('profile:ensured', { userId: profile.user_id });
            await insertAuthDebugEvent({ context: 'callback', event: 'ensure_profile_ok', payload: { user_id: profile.user_id } });
          }
          
          toast({ 
            title: 'Succesvol ingelogd', 
            description: 'Welkom bij AI Dagelijks!' 
          });
        } else {
          await insertAuthDebugEvent({ context: 'callback', event: 'no_session', payload: {} });
          throw new Error('No session established after authentication');
        }
      } catch (err: any) {
        dbg.error('Auth callback error', err);
        await insertAuthDebugEvent({ context: 'callback', event: 'error', payload: err });
        
        // More detailed error messages
        let errorMessage = 'Er ging iets mis tijdens het inloggen';
        if (err?.message?.includes('OAuth')) {
          errorMessage = 'OAuth authenticatie mislukt. Controleer je instellingen.';
        } else if (err?.message?.includes('session')) {
          errorMessage = 'Kon geen sessie aanmaken. Probeer opnieuw.';
        } else if (err?.message) {
          errorMessage = err.message;
        }
        
        toast({ 
          title: 'Authenticatie mislukt', 
          description: errorMessage, 
          variant: 'destructive' 
        });
      } finally {
        await insertAuthDebugEvent({ context: 'callback', event: 'finish' });
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