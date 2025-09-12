import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Profile {
  user_id: string;
  display_name: string;
  role: 'reader' | 'contributor' | 'editor' | 'admin';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

interface UserPreferences {
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  locale: string;
  email_opt_in: boolean;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  preferences: UserPreferences | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signInWithProvider: (provider: 'google' | 'github' | 'apple') => Promise<{ error: any }>;
  sendMagicLink: (email: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<{ error: any }>;
  uploadAvatar: (file: File) => Promise<{ url?: string; error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchPreferences = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (!data) {
        // Create default preferences
        const { data: newPrefs, error: createError } = await supabase
          .from('user_preferences')
          .insert([{ user_id: userId }])
          .select()
          .single();
        
        if (!createError) {
          setPreferences(newPrefs as UserPreferences);
        }
      } else {
        setPreferences(data as UserPreferences);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile and preferences fetching
          setTimeout(() => {
            fetchProfile(session.user.id);
            fetchPreferences(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setPreferences(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
        fetchPreferences(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });
    
    if (error) {
      toast({
        title: "Inloggen mislukt",
        description: error.message,
        variant: "destructive",
      });
    }
    
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (error) {
      toast({
        title: "Registreren mislukt",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account aangemaakt",
        description: "Controleer je e-mail voor de bevestigingslink.",
      });
    }
    
    return { error };
  };

  const signInWithProvider = async (provider: 'google' | 'github' | 'apple') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (error) {
      toast({
        title: "Inloggen mislukt",
        description: error.message,
        variant: "destructive",
      });
    }
    
    return { error };
  };

  const sendMagicLink = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (error) {
      toast({
        title: "Magic link mislukt",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Magic link verzonden",
        description: "Controleer je e-mail voor de inloglink.",
      });
    }
    
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Uitloggen mislukt",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    });
    
    if (error) {
      toast({
        title: "Wachtwoord reset mislukt",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Reset link verzonden",
        description: "Controleer je e-mail voor de wachtwoord reset link.",
      });
    }
    
    return { error };
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('Not authenticated') };
    
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id);
    
    if (error) {
      toast({
        title: "Profiel bijwerken mislukt",
        description: error.message,
        variant: "destructive",
      });
    } else {
      await fetchProfile(user.id);
      toast({
        title: "Profiel bijgewerkt",
        description: "Je profiel is succesvol bijgewerkt.",
      });
    }
    
    return { error };
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!user) return { error: new Error('Not authenticated') };
    
    const { error } = await supabase
      .from('user_preferences')
      .upsert({ user_id: user.id, ...updates });
    
    if (error) {
      toast({
        title: "Voorkeuren bijwerken mislukt",
        description: error.message,
        variant: "destructive",
      });
    } else {
      await fetchPreferences(user.id);
      toast({
        title: "Voorkeuren bijgewerkt",
        description: "Je voorkeuren zijn succesvol bijgewerkt.",
      });
    }
    
    return { error };
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return { error: new Error('Not authenticated') };
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file);
    
    if (uploadError) {
      toast({
        title: "Upload mislukt",
        description: uploadError.message,
        variant: "destructive",
      });
      return { error: uploadError };
    }
    
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);
    
    return { url: data.publicUrl, error: null };
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    preferences,
    loading,
    signIn,
    signUp,
    signInWithProvider,
    sendMagicLink,
    signOut,
    resetPassword,
    updateProfile,
    updatePreferences,
    uploadAvatar,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}