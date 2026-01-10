import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmbedRequest {
  article_id: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!OPENAI_API_KEY) {
      console.warn('OPENAI_API_KEY not configured, skipping embedding generation');
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'OpenAI API key not configured' 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase credentials not found');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { article_id }: EmbedRequest = await req.json();

    if (!article_id) {
      throw new Error('Missing article_id');
    }

    console.log(`Processing embedding for article: ${article_id}`);

    // Update job status to processing
    await supabase
      .from('embedding_jobs')
      .update({ 
        status: 'processing', 
        processed_at: new Date().toISOString() 
      })
      .eq('article_id', article_id)
      .eq('status', 'pending');

    // Fetch article content
    const { data: article, error: articleError } = await supabase
      .from('articles')
      .select('id, title, summary, body')
      .eq('id', article_id)
      .single();

    if (articleError || !article) {
      throw new Error(`Failed to fetch article: ${articleError?.message}`);
    }

    // Prepare text for embedding
    const textToEmbed = [
      article.title || '',
      article.summary || '',
      // Strip HTML tags and truncate body to avoid token limits
      (article.body || '').replace(/<[^>]*>/g, '').substring(0, 6000)
    ].filter(Boolean).join('\n\n');

    if (!textToEmbed.trim()) {
      throw new Error('No content to embed');
    }

    console.log(`Generating embedding for ${textToEmbed.length} characters`);

    // Generate embedding using OpenAI
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small', // 1536 dimensions, cost-effective
        input: textToEmbed,
        encoding_format: 'float'
      }),
    });

    if (!embeddingResponse.ok) {
      const errorText = await embeddingResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${embeddingResponse.status} ${errorText}`);
    }

    const embeddingData = await embeddingResponse.json();
    const embedding = embeddingData.data[0].embedding;

    if (!embedding || !Array.isArray(embedding)) {
      throw new Error('Invalid embedding response from OpenAI');
    }

    console.log(`Generated embedding with ${embedding.length} dimensions`);

    // Store embedding in database
    const { error: upsertError } = await supabase
      .from('article_embeddings')
      .upsert({
        article_id: article_id,
        embedding: embedding,
        updated_at: new Date().toISOString()
      });

    if (upsertError) {
      throw new Error(`Failed to store embedding: ${upsertError.message}`);
    }

    // Mark job as completed
    await supabase
      .from('embedding_jobs')
      .update({ status: 'completed' })
      .eq('article_id', article_id)
      .eq('status', 'processing');

    console.log(`Successfully embedded article: ${article_id}`);

    return new Response(JSON.stringify({
      success: true,
      article_id: article_id,
      embedding_dimensions: embedding.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in embed-article function:', error);

    // Try to mark job as failed if we have the article_id
    try {
      const body = await req.clone().json();
      if (body.article_id) {
        const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
        const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        
        if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
          const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
          await supabase
            .from('embedding_jobs')
            .update({ 
              status: 'failed',
              error_message: error.message,
              processed_at: new Date().toISOString()
            })
            .eq('article_id', body.article_id)
            .eq('status', 'processing');
        }
      }
    } catch (e) {
      console.error('Failed to update job status:', e);
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