import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ensureUserProfile, Profile } from '@/lib/ensureProfile';

/**
 * React hook that ensures the current user has a profile.
 * Automatically handles profile creation if missing.
 * 
 * @returns Object with profile status and utility functions
 */
export function useProfileEnsurance() {
  const { user, session, profile, loading: authLoading } = useAuth();
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    // Only run if we have an authenticated user but no profile yet
    if (user && session && !profile && !authLoading && !profileLoading) {
      setProfileLoading(true);
      setProfileError(null);
      
      ensureUserProfile()
        .then((ensuredProfile) => {
          if (!ensuredProfile) {
            setProfileError('Failed to create or retrieve profile');
          }
          // Profile will be updated via AuthContext state management
        })
        .catch((error) => {
          console.error('Profile ensurance failed:', error);
          setProfileError(error.message || 'Unknown error occurred');
        })
        .finally(() => {
          setProfileLoading(false);
        });
    }
  }, [user, session, profile, authLoading, profileLoading]);

  return {
    profile,
    profileLoading: authLoading || profileLoading,
    profileError,
    hasProfile: !!profile,
    isReady: !authLoading && !profileLoading && !!profile
  };
}