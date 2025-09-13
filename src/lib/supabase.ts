import { supabase } from "@/integrations/supabase/client";

// Labs bar (ticker data)
export async function getLabsBar() {
  try {
    const { data, error } = await (supabase as any)
      .from('v_ticker_latest')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching labs bar:', error);
    return [];
  }
}

// Hero & rows (homepage slots)
export async function getHomepageSlots() {
  try {
    const { data, error } = await (supabase as any)
      .from('v_homepage_slots')
      .select('*')
      .order('display_order', { ascending: true })
      .order('item_order', { ascending: true });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching homepage slots:', error);
    return [];
  }
}

// Net binnen (latest published)
export async function getLatest(limit = 20) {
  try {
    const { data, error } = await (supabase as any)
      .from('v_latest_published')
      .select('*')
      .limit(limit);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching latest:', error);
    return [];
  }
}

// Meest gelezen (most read in 24h)
export async function getMostRead(limit = 20) {
  try {
    const { data, error } = await (supabase as any)
      .from('v_most_read_24h')
      .select('*')
      .limit(limit);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching most read:', error);
    return [];
  }
}

// Topic sections
export async function getTopicSections() {
  try {
    const { data, error } = await (supabase as any)
      .from('v_topic_sections_cards')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching topic sections:', error);
    return [];
  }
}

// Header topics
export async function getTopics() {
  try {
    const { data, error } = await (supabase as any)
      .from('topics')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching topics:', error);
    return [];
  }
}

// Main topics (type='main')
export async function getMainTopics() {
  try {
    const { data, error } = await (supabase as any)
      .from('topics')
      .select('*')
      .eq('type', 'main')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching main topics:', error);
    return [];
  }
}

// Subtopics for a main topic
export async function getSubTopics(parentSlug: string) {
  try {
    const { data, error } = await (supabase as any)
      .from('topics')
      .select('*')
      .eq('parent_slug', parentSlug)
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching subtopics:', error);
    return [];
  }
}

// Resolve topic slug using backend function
export async function resolveTopicSlug(slug: string) {
  try {
    const { data, error } = await (supabase as any)
      .rpc('resolve_topic_slug', { p_slug: slug });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error resolving topic slug:', error);
    return slug; // Fallback to original slug
  }
}

// Get topic by resolved slug
export async function getTopicBySlug(slug: string) {
  try {
    // First resolve the slug
    const resolvedSlug = await resolveTopicSlug(slug);
    
    const { data, error } = await (supabase as any)
      .from('topics')
      .select('*')
      .eq('slug', resolvedSlug)
      .eq('is_active', true)
      .maybeSingle();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching topic by slug:', error);
    return null;
  }
}

// Article detail by slug
export async function getArticleBySlug(slug: string) {
  try {
    const { data, error } = await (supabase as any)
      .from('articles')
      .select('id, slug, title, summary, subtitle, body, read_time_minutes, published_at, topic_id, author_id, hero_image_id, status, image_large, image_standard, image_mobile, image_tablet, image_list')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

// Record article view (analytics)
export async function recordView(articleId: string, sessionId?: string) {
  try {
    await (supabase as any).rpc('record_article_view', {
      p_article_id: articleId,
      p_session_id: sessionId ?? null,
      p_referrer: typeof document !== 'undefined' ? document.referrer : null,
      p_user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    });
  } catch (error) {
    console.error('Error recording view:', error);
  }
}

// Search function
export async function searchArticles(query: string, options: { limit?: number; offset?: number } = {}) {
  const { limit = 20, offset = 0 } = options;
  
  if (!query?.trim()) {
    return { data: [], error: null };
  }

  try {
    const { data, error } = await (supabase as any).rpc('search_articles', {
      q: query.trim(),
      search_limit: limit,
      search_offset: offset
    });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Search error:', error);
    return { data: [], error };
  }
}

// Auth functions
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/`
    }
  });
  if (error) throw error;
  return data.user;
}

export async function signOut() {
  await supabase.auth.signOut();
}