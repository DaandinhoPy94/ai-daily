import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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

    const { data, error } = await supabase
      .from('profiles')
      .upsert(upsertPayload, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) {
      console.error('ensureProfile upsert error:', error);
      const { data: existing } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      return (existing as Profile) || null;
    }

    console.log('ensureProfile ensured row for user:', user.id);
    return data as Profile;
  } catch (error) {
    console.error('Unexpected error in ensureProfile:', error);
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