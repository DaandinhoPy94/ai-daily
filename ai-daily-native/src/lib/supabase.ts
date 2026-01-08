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

// Helper functions aligned with web app views
export const getMostRead = async (limit = 10) => {
  const { data, error } = await supabase
    .from('v_most_read_24h')
    .select('*')
    .limit(limit);

  if (error) throw error as any;

  // Map fields to match app expectations
  return (data || []).map((item: any) => ({
    ...item,
    media_asset_url: item.image_path,
    media_asset_alt: item.image_alt,
    readTimeMinutes: item.read_time_minutes,
  }));
};

export const getLatest = async (limit = 20) => {
  const { data, error } = await supabase
    .from('v_latest_published')
    .select('*')
    .limit(limit);

  if (error) throw error as any;

  return (data || []).map((item: any) => ({
    ...item,
    media_asset_url: item.image_path,
    media_asset_alt: item.image_alt,
    readTimeMinutes: item.read_time_minutes,
  }));
};

export const getTopicSections = async () => {
  const { data, error } = await supabase
    .from('v_topic_sections_cards')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) throw error as any;
  return data || [];
};

// Main topics (type='main')
export const getMainTopics = async () => {
  try {
    console.log('[getMainTopics] Starting fetch...');
    console.log('[getMainTopics] Supabase URL:', supabaseUrl ? 'Set' : 'Not set');
    
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .eq('type', 'main')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    
    console.log('[getMainTopics] Data:', data);
    console.log('[getMainTopics] Error:', error);
    
    if (error) {
      console.error('[getMainTopics] Supabase error:', error);
      throw error;
    }
    
    console.log('[getMainTopics] Returning', data?.length || 0, 'topics');
    return data || [];
  } catch (error) {
    console.error('[getMainTopics] Exception:', error);
    return [];
  }
};

// Search articles by title
export const searchArticles = async (query: string, limit = 20) => {
  const { data, error } = await supabase
    .from('v_latest_published')
    .select('*')
    .ilike('title', `%${query}%`)
    .limit(limit);

  if (error) throw error as any;

  return (data || []).map((item: any) => ({
    ...item,
    media_asset_url: item.image_path,
    media_asset_alt: item.image_alt,
    readTimeMinutes: item.read_time_minutes,
  }));
};
