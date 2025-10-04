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

function getLastmod(updated_at: string, published_at: string): string {
  const updatedDate = new Date(updated_at);
  const publishedDate = new Date(published_at);
  return (updatedDate > publishedDate ? updatedDate : publishedDate).toISOString().split('T')[0];
}

function getArticlePriority(publishedAt: string): string {
  const publishedDate = new Date(publishedAt);
  const now = new Date();
  const daysDiff = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff <= 30) return '0.9';  // Recent articles
  if (daysDiff <= 180) return '0.8'; // Evergreen content
  return '0.5'; // Older articles
}

function getArticleChangefreq(publishedAt: string): string {
  const publishedDate = new Date(publishedAt);
  const now = new Date();
  const daysDiff = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff <= 30) return 'daily';
  if (daysDiff <= 180) return 'weekly';
  return 'monthly';
}

export async function generateSitemapIndex(): Promise<string> {
  const baseUrl = import.meta.env.VITE_SITE_URL || 'https://www.aidagelijks.nl';
  const now = new Date().toISOString().split('T')[0];
  
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
</sitemapindex>`;
}

export async function generateStaticSitemap(): Promise<string> {
  const baseUrl = import.meta.env.VITE_SITE_URL || 'https://www.aidagelijks.nl';
  const now = new Date().toISOString().split('T')[0];
  
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
  ];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  staticPages.forEach(page => {
    sitemap += `  <url>\n    <loc>${baseUrl}${page.url}</loc>\n    <lastmod>${page.lastmod}</lastmod>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>\n`;
  });

  sitemap += `</urlset>`;
  return sitemap;
}

export async function generateArticlesSitemap(): Promise<string> {
  const baseUrl = import.meta.env.VITE_SITE_URL || 'https://www.aidagelijks.nl';
  
  const { data: articles } = await supabase
    .from('articles')
    .select('slug, updated_at, published_at')
    .eq('status', 'published')
    .not('published_at', 'is', null)
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false });

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  if (articles) {
    (articles as Article[]).forEach(article => {
      const lastmod = getLastmod(article.updated_at, article.published_at);
      const priority = getArticlePriority(article.published_at);
      const changefreq = getArticleChangefreq(article.published_at);
      
      sitemap += `  <url>\n    <loc>${baseUrl}/artikel/${article.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
    });
  }

  sitemap += `</urlset>`;
  return sitemap;
}

export async function generateTopicsSitemap(): Promise<string> {
  const baseUrl = import.meta.env.VITE_SITE_URL || 'https://www.aidagelijks.nl';
  
  const { data: topics } = await supabase
    .from('topics')
    .select('slug, updated_at')
    .eq('is_active', true)
    .order('updated_at', { ascending: false });

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  if (topics) {
    (topics as Topic[]).forEach(topic => {
      const lastmod = new Date(topic.updated_at).toISOString().split('T')[0];
      sitemap += `  <url>\n    <loc>${baseUrl}/topic/${topic.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    });
  }

  sitemap += `</urlset>`;
  return sitemap;
}

export async function generatePapersSitemap(): Promise<string> {
  const baseUrl = import.meta.env.VITE_SITE_URL || 'https://www.aidagelijks.nl';
  
  const { data: papers } = await supabase
    .from('ai_papers' as any)
    .select('slug, updated_at, publication_date')
    .order('publication_date', { ascending: false });

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  if (papers && Array.isArray(papers)) {
    papers.forEach((paper: any) => {
      if (paper.slug && paper.updated_at) {
        const lastmod = getLastmod(paper.updated_at, paper.publication_date);
        sitemap += `  <url>\n    <loc>${baseUrl}/papers/${paper.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
      }
    });
  }

  sitemap += `</urlset>`;
  return sitemap;
}

export async function generateNewsSitemap(): Promise<string> {
  const baseUrl = import.meta.env.VITE_SITE_URL || 'https://www.aidagelijks.nl';
  const since = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

  const { data: articles } = await supabase
    .from('articles')
    .select('slug, title, published_at, updated_at')
    .eq('status', 'published')
    .gte('published_at', since)
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false })
    .limit(1000);

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n`;

  (articles || []).forEach((a: any) => {
    const title = (a.title || '').replace(/&/g, '&amp;');
    sitemap += `  <url>\n` +
               `    <loc>${baseUrl}/artikel/${a.slug}</loc>\n` +
               `    <news:news>\n` +
               `      <news:publication>\n` +
               `        <news:name>AI Dagelijks</news:name>\n` +
               `        <news:language>nl</news:language>\n` +
               `      </news:publication>\n` +
               `      <news:publication_date>${new Date(a.published_at).toISOString()}</news:publication_date>\n` +
               `      <news:title>${title}</news:title>\n` +
               `    </news:news>\n` +
               `    <lastmod>${new Date(a.updated_at).toISOString().split('T')[0]}</lastmod>\n` +
               `  </url>\n`;
  });

  sitemap += `</urlset>`;
  return sitemap;
}