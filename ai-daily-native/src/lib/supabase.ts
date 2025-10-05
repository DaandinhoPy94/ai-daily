import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Helper functions - same as your web app
export const getMostRead = async (limit = 10) => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('view_count', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};

export const getLatest = async (limit = 20) => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};
