import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SemanticSearchRequest {
  query: string;
  limit?: number;
  offset?: number;
  semantic_weight?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase credentials not found');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { 
      query, 
      limit = 20, 
      offset = 0, 
      semantic_weight = 0.5 
    }: SemanticSearchRequest = await req.json();

    if (!query?.trim()) {
      return new Response(JSON.stringify({ data: [], error: null }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Semantic search for: "${query}"`);

    // Check if we have embeddings and OpenAI key
    const { count: embeddingCount } = await supabase
      .from('article_embeddings')
      .select('*', { count: 'exact', head: true });

    const hasEmbeddings = embeddingCount && embeddingCount > 0;
    const hasOpenAI = !!OPENAI_API_KEY;

    console.log(`Embeddings available: ${hasEmbeddings}, OpenAI key: ${hasOpenAI}`);

    if (!hasEmbeddings || !hasOpenAI) {
      // Fall back to FTS only
      console.log('Falling back to FTS search');
      const { data, error } = await supabase.rpc('hybrid_search', {
        q: query.trim(),
        search_limit: limit,
        search_offset: offset,
        semantic_weight: 0.0 // Pure FTS
      });

      return new Response(JSON.stringify({ 
        data: data || [], 
        error,
        search_type: 'text'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate embedding for the query
    console.log('Generating query embedding');
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: query.trim(),
        encoding_format: 'float'
      }),
    });

    if (!embeddingResponse.ok) {
      console.error('Failed to generate query embedding, falling back to FTS');
      const { data, error } = await supabase.rpc('hybrid_search', {
        q: query.trim(),
        search_limit: limit,
        search_offset: offset,
        semantic_weight: 0.0
      });

      return new Response(JSON.stringify({ 
        data: data || [], 
        error,
        search_type: 'text'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const embeddingData = await embeddingResponse.json();
    const queryEmbedding = embeddingData.data[0].embedding;

    console.log(`Query embedding generated with ${queryEmbedding.length} dimensions`);

    // Perform hybrid search with actual query embedding
    const { data, error } = await supabase.rpc('semantic_search_with_embedding', {
      query_text: query.trim(),
      query_embedding: JSON.stringify(queryEmbedding),
      search_limit: limit,
      search_offset: offset,
      semantic_weight: semantic_weight
    });

    if (error) {
      console.error('Semantic search error:', error);
      // Fall back to FTS
      const { data: ftsData, error: ftsError } = await supabase.rpc('hybrid_search', {
        q: query.trim(),
        search_limit: limit,
        search_offset: offset,
        semantic_weight: 0.0
      });

      return new Response(JSON.stringify({ 
        data: ftsData || [], 
        error: ftsError,
        search_type: 'text'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      data: data || [], 
      error: null,
      search_type: 'semantic'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in semantic-search function:', error);

    // Fall back to FTS as last resort
    try {
      const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
      const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      
      if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        const body = await req.clone().json();
        
        const { data, error } = await supabase.rpc('hybrid_search', {
          q: body.query?.trim() || '',
          search_limit: body.limit || 20,
          search_offset: body.offset || 0,
          semantic_weight: 0.0
        });

        return new Response(JSON.stringify({ 
          data: data || [], 
          error,
          search_type: 'text'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } catch (fallbackError) {
      console.error('Fallback FTS also failed:', fallbackError);
    }

    return new Response(JSON.stringify({ 
      data: [],
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});