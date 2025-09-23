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

function getLastmod(updated_at: string, published_at: string): string {
  const updatedDate = new Date(updated_at)
  const publishedDate = new Date(published_at)
  return (updatedDate > publishedDate ? updatedDate : publishedDate).toISOString().split('T')[0]
}

function getArticlePriority(publishedAt: string): string {
  const publishedDate = new Date(publishedAt)
  const now = new Date()
  const daysDiff = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60 * 24))
  
  if (daysDiff <= 30) return '0.9'  // Recent articles
  if (daysDiff <= 180) return '0.8' // Evergreen content
  return '0.5' // Older articles
}

function getArticleChangefreq(publishedAt: string): string {
  const publishedDate = new Date(publishedAt)
  const now = new Date()
  const daysDiff = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60 * 24))
  
  if (daysDiff <= 30) return 'daily'
  if (daysDiff <= 180) return 'weekly'
  return 'monthly'
}

async function generateSitemapIndex(): Promise<string> {
  const baseUrl = 'https://aidagelijks.nl'
  const now = new Date().toISOString().split('T')[0]
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-static.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-articles.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-topics.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-papers.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
</sitemapindex>`
}

async function generateStaticSitemap(): Promise<string> {
  const baseUrl = 'https://aidagelijks.nl'
  const now = new Date().toISOString().split('T')[0]
  
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'daily', lastmod: now }, // Homepage
    { url: '/net-binnen', priority: '0.8', changefreq: 'daily', lastmod: now },
    { url: '/topic', priority: '0.8', changefreq: 'weekly', lastmod: now },
    { url: '/ai-jobs', priority: '0.8', changefreq: 'weekly', lastmod: now },
    { url: '/ai-cursussen', priority: '0.8', changefreq: 'weekly', lastmod: now },
    { url: '/lm-arena', priority: '0.8', changefreq: 'weekly', lastmod: now },
    { url: '/papers', priority: '0.8', changefreq: 'weekly', lastmod: now },
    { url: '/over-ons', priority: '0.5', changefreq: 'monthly', lastmod: now },
    { url: '/nieuwsbrief', priority: '0.5', changefreq: 'monthly', lastmod: now },
    { url: '/rss-feeds', priority: '0.5', changefreq: 'monthly', lastmod: now },
  ]

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`

  staticPages.forEach(page => {
    sitemap += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`
  })

  sitemap += `</urlset>`
  return sitemap
}

async function generateArticlesSitemap(supabaseClient: any): Promise<string> {
  const baseUrl = 'https://aidagelijks.nl'
  
  const { data: articles } = await supabaseClient
    .from('articles')
    .select('slug, updated_at, published_at')
    .eq('status', 'published')
    .not('published_at', 'is', null)
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false })

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`

  if (articles) {
    (articles as Article[]).forEach(article => {
      const lastmod = getLastmod(article.updated_at, article.published_at)
      const priority = getArticlePriority(article.published_at)
      const changefreq = getArticleChangefreq(article.published_at)
      
      sitemap += `  <url>
    <loc>${baseUrl}/artikel/${article.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>
`
    })
  }

  sitemap += `</urlset>`
  return sitemap
}

async function generateTopicsSitemap(supabaseClient: any): Promise<string> {
  const baseUrl = 'https://aidagelijks.nl'
  
  const { data: topics } = await supabaseClient
    .from('topics')
    .select('slug, updated_at')
    .eq('is_active', true)
    .order('updated_at', { ascending: false })

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`

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

  sitemap += `</urlset>`
  return sitemap
}

async function generatePapersSitemap(supabaseClient: any): Promise<string> {
  const baseUrl = 'https://aidagelijks.nl'
  
  const { data: papers } = await supabaseClient
    .from('ai_papers')
    .select('slug, updated_at, publication_date')
    .order('publication_date', { ascending: false })

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`

  if (papers) {
    (papers as Paper[]).forEach(paper => {
      const lastmod = getLastmod(paper.updated_at, paper.publication_date)
      sitemap += `  <url>
    <loc>${baseUrl}/papers/${paper.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`
    })
  }

  sitemap += `</urlset>`
  return sitemap
}

async function generateNewsSitemap(supabaseClient: any): Promise<string> {
  const baseUrl = 'https://aidagelijks.nl'
  const since = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()

  const { data: articles } = await supabaseClient
    .from('articles')
    .select('slug, title, published_at, updated_at')
    .eq('status', 'published')
    .gte('published_at', since)
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false })
    .limit(1000)

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
`
  ;(articles || []).forEach((a: any) => {
    const title = (a.title || '').replace(/&/g, '&amp;')
    xml += `  <url>
    <loc>${baseUrl}/artikel/${a.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>AI Dagelijks</news:name>
        <news:language>nl</news:language>
      </news:publication>
      <news:publication_date>${new Date(a.published_at).toISOString()}</news:publication_date>
      <news:title>${title}</news:title>
    </news:news>
    <lastmod>${new Date(a.updated_at).toISOString().split('T')[0]}</lastmod>
  </url>
`
  })
  xml += `</urlset>`
  return xml
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const pathname = url.pathname
    const sitemapType = url.searchParams.get('type')

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    let sitemapContent: string

    switch (sitemapType) {
      case 'index':
        sitemapContent = await generateSitemapIndex()
        break
      case 'static':
        sitemapContent = await generateStaticSitemap()
        break
      case 'articles':
        sitemapContent = await generateArticlesSitemap(supabaseClient)
        break
      case 'topics':
        sitemapContent = await generateTopicsSitemap(supabaseClient)
        break
      case 'papers':
        sitemapContent = await generatePapersSitemap(supabaseClient)
        break
      default:
        // Default to sitemap index
        sitemapContent = await generateSitemapIndex()
    }

    return new Response(sitemapContent, {
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