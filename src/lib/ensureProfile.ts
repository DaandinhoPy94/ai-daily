import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { createAuthDebug, redactAuthContext, insertAuthDebugEvent } from '@/lib/authDebug';

export interface Profile {
  user_id: string;
  display_name: string;
  role: 'reader' | 'contributor' | 'editor' | 'admin';
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Ensures a user has a profile in the profiles table.
 * If the profile doesn't exist, creates or updates one with basic fields.
 * Idempotent and safe to call multiple times.
 * 
 * @param user - The authenticated user from Supabase auth
 * @returns Promise<Profile | null> - The existing or newly created/updated profile
 */
export async function ensureProfile(user: User): Promise<Profile | null> {
  if (!user) {
    console.warn('ensureProfile: No user provided');
    return null;
  }

  try {
    const dbg = createAuthDebug('ensure');
    const displayName =
      (user.user_metadata as any)?.full_name ||
      (user.user_metadata as any)?.name ||
      (user.user_metadata as any)?.display_name ||
      user.email?.split('@')[0] ||
      'Gebruiker';

    const avatarUrl =
      (user.user_metadata as any)?.avatar_url ||
      (user.user_metadata as any)?.picture ||
      null;

    const upsertPayload = {
      user_id: user.id,
      display_name: displayName,
      // do not include role to avoid overwriting elevated roles
      avatar_url: avatarUrl as string | null,
    };

    dbg.log('upsert:payload', redactAuthContext({ user: { id: user.id, email: user.email }, upsertPayload }));
    await insertAuthDebugEvent({ context: 'ensure', event: 'upsert_attempt', payload: { user_id: user.id, has_display_name: !!displayName, has_avatar: !!avatarUrl } });
    // Perform upsert without RETURNING to avoid RLS-blocked selects on returning rows
    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert(upsertPayload, { onConflict: 'user_id' });

    if (upsertError) {
      dbg.error('upsert:error', upsertError);
      await insertAuthDebugEvent({ context: 'ensure', event: 'upsert_error', payload: upsertError, userId: user.id });
      // Best-effort read to determine if the row actually exists
      const { data: existing, error: selectErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (selectErr) {
        dbg.error('fallback:select:error', selectErr);
        await insertAuthDebugEvent({ context: 'ensure', event: 'select_fallback_error', payload: selectErr, userId: user.id });
      } else {
        await insertAuthDebugEvent({ context: 'ensure', event: 'select_fallback_result', payload: { user_id: user.id, exists: !!existing } });
      }
      return (existing as Profile) || null;
    }

    dbg.log('upsert:success', { userId: user.id });
    await insertAuthDebugEvent({ context: 'ensure', event: 'upsert_success', payload: { user_id: user.id } });

    // Follow-up SELECT to fetch the canonical row under normal SELECT policies
    const { data: fetched, error: fetchErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    if (fetchErr) {
      // If SELECT is still blocked, return null but do not treat as failure
      dbg.error('post_upsert_select:error', fetchErr);
      await insertAuthDebugEvent({ context: 'ensure', event: 'post_upsert_select_error', payload: fetchErr, userId: user.id });
      return null;
    }
    return fetched as Profile;
  } catch (error) {
    const dbg = createAuthDebug('ensure');
    dbg.error('unexpected', error);
    await insertAuthDebugEvent({ context: 'ensure', event: 'unexpected_error', payload: error, userId: user?.id });
    return null;
  }
}

/**
 * React hook-friendly version that can be used in useEffect
 * Returns a promise that resolves when profile is ensured
 */
export async function ensureUserProfile(): Promise<Profile | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting current user:', error);
      return null;
    }
    
    if (!user) {
      console.warn('No authenticated user found');
      return null;
    }
    
    return await ensureProfile(user);
  } catch (error) {
    console.error('Error in ensureUserProfile:', error);
    return null;
  }
}