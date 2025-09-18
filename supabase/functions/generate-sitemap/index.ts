import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/xml; charset=utf-8',
}

interface Article {
  slug: string
  updated_at: string
  published_at: string
}

interface Topic {
  slug: string
  updated_at: string
}

interface Paper {
  slug: string
  updated_at: string
  publication_date: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Fetch all published articles
    const { data: articles } = await supabaseClient
      .from('articles')
      .select('slug, updated_at, published_at')
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .lte('published_at', new Date().toISOString())
      .order('updated_at', { ascending: false })

    // Fetch all active topics
    const { data: topics } = await supabaseClient
      .from('topics')
      .select('slug, updated_at')
      .eq('is_active', true)
      .order('updated_at', { ascending: false })

    // Fetch all papers
    const { data: papers } = await supabaseClient
      .from('ai_papers')
      .select('slug, updated_at, publication_date')
      .order('updated_at', { ascending: false })

    const baseUrl = 'https://www.aidagelijks.nl'
    const now = new Date().toISOString().split('T')[0]
    
    // Static pages with their priorities and change frequencies
    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'daily', lastmod: now }, // Homepage
      { url: '/net-binnen', priority: '0.8', changefreq: 'daily', lastmod: now },
      { url: '/topic', priority: '0.8', changefreq: 'weekly', lastmod: now },
      { url: '/ai-jobs', priority: '0.8', changefreq: 'weekly', lastmod: now },
      { url: '/ai-cursussen', priority: '0.8', changefreq: 'weekly', lastmod: now },
      { url: '/lm-arena', priority: '0.8', changefreq: 'weekly', lastmod: now },
      { url: '/over-ons', priority: '0.5', changefreq: 'monthly', lastmod: now },
      { url: '/nieuwsbrief', priority: '0.5', changefreq: 'monthly', lastmod: now },
      { url: '/rss-feeds', priority: '0.5', changefreq: 'monthly', lastmod: now },
    ]

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`

    // Add static pages
    staticPages.forEach(page => {
      sitemap += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`
    })

    // Add articles
    if (articles) {
      (articles as Article[]).forEach(article => {
        const lastmod = new Date(article.updated_at).toISOString().split('T')[0]
        sitemap += `  <url>
    <loc>${baseUrl}/artikel/${article.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
`
      })
    }

    // Add topics
    if (topics) {
      (topics as Topic[]).forEach(topic => {
        const lastmod = new Date(topic.updated_at).toISOString().split('T')[0]
        sitemap += `  <url>
    <loc>${baseUrl}/topic/${topic.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`
      })
    }

    // Add papers
    if (papers) {
      (papers as Paper[]).forEach(paper => {
        const lastmod = new Date(paper.updated_at).toISOString().split('T')[0]
        sitemap += `  <url>
    <loc>${baseUrl}/papers/${paper.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`
      })
    }

    sitemap += `</urlset>`

    return new Response(sitemap, {
      headers: corsHeaders,
      status: 200,
    })

  } catch (error) {
    console.error('Error generating sitemap:', error)
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.aidagelijks.nl</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`,
      { headers: corsHeaders, status: 200 }
    )
  }
})