import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateArticleRequest {
  title: string;
  summary?: string;
  body?: string;
  subtitle?: string;
  topic_id?: string;
  author_id?: string;
  seo_title?: string;
  seo_description?: string;
  is_featured?: boolean;
  read_time_minutes?: number;
  status?: 'draft' | 'published' | 'scheduled';
  published_at?: string;
  scheduled_at?: string;
}

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Generate UUID v4
function generateUUID(): string {
  return crypto.randomUUID();
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Method not allowed' 
    }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // Get Supabase credentials
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing Supabase credentials');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Parse request body
    const requestData: CreateArticleRequest = await req.json();

    if (!requestData.title) {
      throw new Error('Title is required');
    }

    // Generate shared UUID
    const sharedId = generateUUID();
    
    // Generate slug from title
    let slug = generateSlug(requestData.title);
    
    // Ensure slug is unique
    let slugAttempt = 1;
    let finalSlug = slug;
    while (true) {
      const { data: existingArticle } = await supabase
        .from('articles')
        .select('id')
        .eq('slug', finalSlug)
        .single();
      
      if (!existingArticle) {
        break;
      }
      
      finalSlug = `${slug}-${slugAttempt}`;
      slugAttempt++;
    }

    console.log(`Creating article and media asset with shared UUID: ${sharedId}`);

    // First create the media_asset with the shared UUID
    const { data: mediaAsset, error: mediaError } = await supabase
      .from('media_assets')
      .insert({
        id: sharedId,
        type: 'image',
        path: '', // Empty path, to be filled later
        alt: '', // Empty alt, to be filled later
        title: requestData.title
      })
      .select()
      .single();

    if (mediaError) {
      throw new Error(`Failed to create media asset: ${mediaError.message}`);
    }

    console.log('Media asset created:', mediaAsset);

    // Then create the article with the same UUID and link to the media asset
    const { data: article, error: articleError } = await supabase
      .from('articles')
      .insert({
        id: sharedId,
        slug: finalSlug,
        title: requestData.title,
        subtitle: requestData.subtitle || null,
        summary: requestData.summary || null,
        body: requestData.body || null,
        topic_id: requestData.topic_id || null,
        author_id: requestData.author_id || null,
        seo_title: requestData.seo_title || null,
        seo_description: requestData.seo_description || null,
        hero_image_id: sharedId, // Link to the media asset
        is_featured: requestData.is_featured || false,
        read_time_minutes: requestData.read_time_minutes || 3,
        status: requestData.status || 'draft',
        published_at: requestData.published_at ? new Date(requestData.published_at).toISOString() : null,
        scheduled_at: requestData.scheduled_at ? new Date(requestData.scheduled_at).toISOString() : null
      })
      .select()
      .single();

    if (articleError) {
      // If article creation fails, clean up the media asset
      await supabase
        .from('media_assets')
        .delete()
        .eq('id', sharedId);
      
      throw new Error(`Failed to create article: ${articleError.message}`);
    }

    console.log('Article created:', article);

    return new Response(JSON.stringify({
      success: true,
      data: {
        article,
        media_asset: mediaAsset
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in create-article-with-media function:', error);

    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});