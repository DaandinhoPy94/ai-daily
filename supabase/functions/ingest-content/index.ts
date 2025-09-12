import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-signature',
};

interface IngestRequest {
  action: 'upsert_article' | 'upsert_topic' | 'upsert_tag' | 'upload_media';
  payload: any;
  publish_now?: boolean;
  scheduled_at?: string;
  allow_create?: boolean;
}

interface ArticlePayload {
  slug?: string;
  title: string;
  summary: string;
  body: string;
  topic_slug: string;
  author_id?: string;
  author_name?: string;
  seo_title?: string;
  seo_description?: string;
  hero_image_path?: string;
  hero_image_url?: string; // For automatic media upload
  is_featured?: boolean;
  read_time_minutes?: number;
  tags?: string[]; // Array of tag slugs
}

interface TopicPayload {
  slug?: string;
  name: string;
  description?: string;
  display_order?: number;
}

interface TagPayload {
  slug?: string;
  name: string;
}

interface MediaPayload {
  url: string;
  alt?: string;
  title?: string;
  credit?: string;
}

// HMAC signature verification
async function verifyHMACSignature(body: string, signature: string, secret: string): Promise<boolean> {
  if (!signature || !signature.startsWith('sha256=')) {
    return false;
  }

  const expectedSignature = signature.slice(7); // Remove 'sha256=' prefix
  
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const actualSignature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
  const actualHex = Array.from(new Uint8Array(actualSignature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return actualHex === expectedSignature;
}

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Download and upload media to Supabase Storage
async function uploadMediaFromUrl(
  supabase: any, 
  url: string, 
  alt?: string, 
  title?: string, 
  credit?: string
): Promise<string> {
  console.log(`Downloading media from: ${url}`);

  // Download the file
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download media: ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type') || 'image/jpeg';
  const fileExtension = contentType.split('/')[1] || 'jpg';
  const fileName = `${crypto.randomUUID()}.${fileExtension}`;
  const filePath = `articles/${fileName}`;

  // Upload to Supabase Storage
  const fileBuffer = await response.arrayBuffer();
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('media')
    .upload(filePath, fileBuffer, {
      contentType,
      upsert: false
    });

  if (uploadError) {
    throw new Error(`Failed to upload media: ${uploadError.message}`);
  }

  // Create media asset record
  const { data: mediaData, error: mediaError } = await supabase
    .from('media_assets')
    .insert({
      path: filePath,
      type: 'image',
      alt: alt || title || '',
      title: title || '',
      credit: credit || null
    })
    .select('id, path')
    .single();

  if (mediaError) {
    throw new Error(`Failed to create media asset: ${mediaError.message}`);
  }

  console.log(`Media uploaded successfully: ${filePath}`);
  return filePath;
}

// Resolve or create topic
async function resolveOrCreateTopic(supabase: any, topicSlug: string, allowCreate = true): Promise<string> {
  // First try to find existing topic
  const { data: existingTopic } = await supabase
    .from('topics')
    .select('id')
    .eq('slug', topicSlug)
    .single();

  if (existingTopic) {
    return existingTopic.id;
  }

  if (!allowCreate) {
    throw new Error(`Topic not found: ${topicSlug}`);
  }

  // Create new topic
  const { data: newTopic, error } = await supabase
    .from('topics')
    .insert({
      slug: topicSlug,
      name: topicSlug.charAt(0).toUpperCase() + topicSlug.slice(1).replace(/-/g, ' '),
      is_active: true
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to create topic: ${error.message}`);
  }

  console.log(`Created new topic: ${topicSlug}`);
  return newTopic.id;
}

// Resolve or create tags
async function resolveOrCreateTags(supabase: any, tagSlugs: string[], allowCreate = true): Promise<string[]> {
  if (!tagSlugs || tagSlugs.length === 0) return [];

  const tagIds: string[] = [];

  for (const tagSlug of tagSlugs) {
    // Try to find existing tag
    const { data: existingTag } = await supabase
      .from('tags')
      .select('id')
      .eq('slug', tagSlug)
      .single();

    if (existingTag) {
      tagIds.push(existingTag.id);
      continue;
    }

    if (!allowCreate) {
      throw new Error(`Tag not found: ${tagSlug}`);
    }

    // Create new tag
    const { data: newTag, error } = await supabase
      .from('tags')
      .insert({
        slug: tagSlug,
        name: tagSlug.charAt(0).toUpperCase() + tagSlug.slice(1).replace(/-/g, ' ')
      })
      .select('id')
      .single();

    if (error) {
      throw new Error(`Failed to create tag: ${error.message}`);
    }

    console.log(`Created new tag: ${tagSlug}`);
    tagIds.push(newTag.id);
  }

  return tagIds;
}

// Resolve author by ID or name
async function resolveAuthor(supabase: any, authorId?: string, authorName?: string): Promise<string | null> {
  if (authorId) {
    const { data } = await supabase
      .from('authors')
      .select('id')
      .eq('id', authorId)
      .single();
    
    return data?.id || null;
  }

  if (authorName) {
    const { data } = await supabase
      .from('authors')
      .select('id')
      .eq('name', authorName)
      .single();
    
    return data?.id || null;
  }

  return null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  let jobId: number | null = null;

  try {
    const CONTENT_INGEST_SECRET = Deno.env.get('CONTENT_INGEST_SECRET');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!CONTENT_INGEST_SECRET) {
      throw new Error('CONTENT_INGEST_SECRET not configured');
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase credentials not found');
    }

    // Read and verify request
    const body = await req.text();
    const signature = req.headers.get('x-signature') || '';

    // Verify HMAC signature
    const isValidSignature = await verifyHMACSignature(body, signature, CONTENT_INGEST_SECRET);
    if (!isValidSignature) {
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const requestData: IngestRequest = JSON.parse(body);
    const { action, payload, publish_now = false, scheduled_at, allow_create = true } = requestData;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Log job start
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .insert({
        kind: 'ingest_content',
        payload: requestData,
        status: 'queued'
      })
      .select('id')
      .single();

    if (jobError) {
      console.error('Failed to create job log:', jobError);
    } else {
      jobId = job.id;
    }

    let result: any = {};

    switch (action) {
      case 'upload_media': {
        const mediaPayload = payload as MediaPayload;
        const filePath = await uploadMediaFromUrl(
          supabase, 
          mediaPayload.url, 
          mediaPayload.alt, 
          mediaPayload.title, 
          mediaPayload.credit
        );
        result = { file_path: filePath };
        break;
      }

      case 'upsert_topic': {
        const topicPayload = payload as TopicPayload;
        const slug = topicPayload.slug || generateSlug(topicPayload.name);

        const { data, error } = await supabase
          .from('topics')
          .upsert({
            slug,
            name: topicPayload.name,
            description: topicPayload.description,
            display_order: topicPayload.display_order || 100,
            is_active: true
          })
          .select('id, slug, name')
          .single();

        if (error) throw new Error(`Failed to upsert topic: ${error.message}`);
        result = data;
        break;
      }

      case 'upsert_tag': {
        const tagPayload = payload as TagPayload;
        const slug = tagPayload.slug || generateSlug(tagPayload.name);

        const { data, error } = await supabase
          .from('tags')
          .upsert({
            slug,
            name: tagPayload.name
          })
          .select('id, slug, name')
          .single();

        if (error) throw new Error(`Failed to upsert tag: ${error.message}`);
        result = data;
        break;
      }

      case 'upsert_article': {
        const articlePayload = payload as ArticlePayload;
        
        if (!articlePayload.title || !articlePayload.summary || !articlePayload.body || !articlePayload.topic_slug) {
          throw new Error('Missing required fields: title, summary, body, topic_slug');
        }

        const slug = articlePayload.slug || generateSlug(articlePayload.title);

        // Resolve topic
        const topicId = await resolveOrCreateTopic(supabase, articlePayload.topic_slug, allow_create);

        // Resolve author
        const authorId = await resolveAuthor(supabase, articlePayload.author_id, articlePayload.author_name);

        // Handle hero image upload if URL provided
        let heroImagePath = articlePayload.hero_image_path;
        if (articlePayload.hero_image_url && !heroImagePath) {
          heroImagePath = await uploadMediaFromUrl(supabase, articlePayload.hero_image_url);
        }

        // Determine status and publish date
        let status = 'draft';
        let publishedAt = null;
        let scheduledAt = null;

        if (publish_now) {
          status = 'published';
          publishedAt = new Date().toISOString();
        } else if (scheduled_at) {
          status = 'scheduled';
          scheduledAt = scheduled_at;
        }

        // Upsert article
        const { data: article, error: articleError } = await supabase
          .from('articles')
          .upsert({
            slug,
            title: articlePayload.title,
            summary: articlePayload.summary,
            body: articlePayload.body,
            topic_id: topicId,
            author_id: authorId,
            seo_title: articlePayload.seo_title,
            seo_description: articlePayload.seo_description,
            hero_image_id: heroImagePath ? null : null, // This would need media_assets lookup
            is_featured: articlePayload.is_featured || false,
            read_time_minutes: articlePayload.read_time_minutes,
            status,
            published_at: publishedAt,
            scheduled_at: scheduledAt
          })
          .select('id, slug, title, status, published_at, scheduled_at')
          .single();

        if (articleError) {
          throw new Error(`Failed to upsert article: ${articleError.message}`);
        }

        // Handle tags if provided
        if (articlePayload.tags && articlePayload.tags.length > 0) {
          const tagIds = await resolveOrCreateTags(supabase, articlePayload.tags, allow_create);
          
          // Remove existing tags
          await supabase
            .from('article_tags')
            .delete()
            .eq('article_id', article.id);

          // Add new tags
          if (tagIds.length > 0) {
            const { error: tagsError } = await supabase
              .from('article_tags')
              .insert(tagIds.map(tagId => ({
                article_id: article.id,
                tag_id: tagId
              })));

            if (tagsError) {
              console.error('Failed to create article tags:', tagsError);
            }
          }
        }

        result = {
          ...article,
          hero_image_path: heroImagePath,
          tags_count: articlePayload.tags?.length || 0
        };
        break;
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    // Update job status to completed
    if (jobId) {
      await supabase
        .from('jobs')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId);
    }

    console.log(`Content ingest completed: ${action}`, result);

    return new Response(JSON.stringify({
      success: true,
      action,
      result
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ingest-content function:', error);

    // Update job status to failed
    if (jobId) {
      try {
        const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
        const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        
        if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
          const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
          await supabase
            .from('jobs')
            .update({ 
              status: 'failed',
              updated_at: new Date().toISOString()
            })
            .eq('id', jobId);
        }
      } catch (e) {
        console.error('Failed to update job status:', e);
      }
    }

    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});