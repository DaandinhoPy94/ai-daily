import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase credentials not found');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    console.log('Processing pending embedding jobs...');

    // Get pending jobs (limit to avoid timeout)
    const { data: pendingJobs, error: jobsError } = await supabase
      .from('embedding_jobs')
      .select('id, article_id')
      .eq('status', 'pending')
      .limit(10);

    if (jobsError) {
      throw new Error(`Failed to fetch pending jobs: ${jobsError.message}`);
    }

    if (!pendingJobs || pendingJobs.length === 0) {
      console.log('No pending embedding jobs found');
      return new Response(JSON.stringify({
        success: true,
        processed: 0,
        message: 'No pending jobs'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Found ${pendingJobs.length} pending embedding jobs`);

    let processed = 0;
    let failed = 0;

    // Process each job
    for (const job of pendingJobs) {
      try {
        console.log(`Processing job ${job.id} for article ${job.article_id}`);

        // Call the embed-article function
        const embedResponse = await supabase.functions.invoke('embed-article', {
          body: { article_id: job.article_id }
        });

        if (embedResponse.error) {
          console.error(`Failed to embed article ${job.article_id}:`, embedResponse.error);
          failed++;
        } else {
          console.log(`Successfully processed article ${job.article_id}`);
          processed++;
        }
      } catch (error) {
        console.error(`Error processing job ${job.id}:`, error);
        failed++;
      }
    }

    console.log(`Embedding job processing complete: ${processed} successful, ${failed} failed`);

    return new Response(JSON.stringify({
      success: true,
      processed,
      failed,
      total: pendingJobs.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in process-embeddings function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});