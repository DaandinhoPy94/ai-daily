import { supabase } from '@/integrations/supabase/client';

interface Article {
  slug: string;
  updated_at: string;
  published_at: string;
}

interface Topic {
  slug: string;
  updated_at: string;
}

interface Paper {
  slug: string;
  updated_at: string;
  publication_date: string;
}

export async function generateSitemap(): Promise<string> {
  const baseUrl = 'https://aidagelijks.nl';
  const now = new Date().toISOString().split('T')[0];
  
  // Fetch all published articles
  const { data: articles } = await supabase
    .from('articles')
    .select('slug, updated_at, published_at')
    .eq('status', 'published')
    .not('published_at', 'is', null)
    .lte('published_at', new Date().toISOString())
    .order('updated_at', { ascending: false });

  // Fetch all active topics
  const { data: topics } = await supabase
    .from('topics')
    .select('slug, updated_at')
    .eq('is_active', true)
    .order('updated_at', { ascending: false });

  // Fetch all papers - using any type since ai_papers might not be in generated types
  const { data: papers } = await supabase
    .from('ai_papers' as any)
    .select('slug, updated_at, publication_date')
    .order('updated_at', { ascending: false });

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
  ];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Add static pages
  staticPages.forEach(page => {
    sitemap += `  <url>\n    <loc>${baseUrl}${page.url}</loc>\n    <lastmod>${page.lastmod}</lastmod>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>\n`;
  });

  // Add articles
  if (articles) {
    (articles as Article[]).forEach(article => {
      const lastmod = new Date(article.updated_at).toISOString().split('T')[0];
      sitemap += `  <url>\n    <loc>${baseUrl}/artikel/${article.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    });
  }

  // Add topics
  if (topics) {
    (topics as Topic[]).forEach(topic => {
      const lastmod = new Date(topic.updated_at).toISOString().split('T')[0];
      sitemap += `  <url>\n    <loc>${baseUrl}/topic/${topic.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    });
  }

  // Add papers
  if (papers && Array.isArray(papers)) {
    papers.forEach((paper: any) => {
      if (paper.slug && paper.updated_at) {
        const lastmod = new Date(paper.updated_at).toISOString().split('T')[0];
        sitemap += `  <url>\n    <loc>${baseUrl}/papers/${paper.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
      }
    });
  }

  sitemap += `</urlset>`;
  return sitemap;
}