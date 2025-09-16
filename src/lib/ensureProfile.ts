import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface Profile {
  user_id: string;
  display_name: string;
  role: 'reader' | 'contributor' | 'editor' | 'admin';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Ensures a user has a profile in the profiles table.
 * If the profile doesn't exist, creates one with default values.
 * 
 * @param user - The authenticated user from Supabase auth
 * @returns Promise<Profile | null> - The existing or newly created profile
 */
export async function ensureProfile(user: User): Promise<Profile | null> {
  if (!user) {
    console.warn('ensureProfile: No user provided');
    return null;
  }

  try {
    // First, try to get the existing profile
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    // Handle fetch errors (but not "no rows found")
    if (fetchError) {
      console.error('Error fetching profile:', fetchError);
      return null;
    }

    // If profile exists, return it
    if (existingProfile) {
      console.log('Profile found for user:', user.id);
      return existingProfile as Profile;
    }

    // Profile doesn't exist, create one
    console.log('Creating new profile for user:', user.id);
    
    // Extract display name from various possible sources
    const displayName = 
      user.user_metadata?.full_name || 
      user.user_metadata?.name ||
      user.user_metadata?.display_name ||
      user.email?.split('@')[0] || 
      'Gebruiker';
    
    // Extract avatar URL from OAuth provider metadata
    const avatarUrl = 
      user.user_metadata?.avatar_url || 
      user.user_metadata?.picture ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`;
    
    const newProfileData = {
      user_id: user.id,
      display_name: displayName,
      role: 'reader' as const,
      avatar_url: avatarUrl
    };

    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert([newProfileData])
      .select()
      .single();
    
    if (insertError) {
      console.error('Error creating profile:', insertError);
      
      // Handle the case where the profile might have been created by another request
      // (race condition in concurrent requests)
      if (insertError.code === '23505') { // unique_violation
        console.log('Profile exists after race condition, fetching...');
        const { data: raceProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        return raceProfile as Profile | null;
      }
      
      return null;
    }
    
    console.log('Profile created successfully for user:', user.id);
    return newProfile as Profile;
    
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