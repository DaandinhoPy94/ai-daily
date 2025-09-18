import { useEffect, useState } from 'react';
import { generateArticlesSitemap } from '@/lib/sitemaps';

export default function SitemapArticles() {
  const [sitemapXml, setSitemapXml] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSitemap = async () => {
      try {
        const xml = await generateArticlesSitemap();
        setSitemapXml(xml);
        
        // Set content type to XML
        document.querySelector('meta[http-equiv="Content-Type"]')?.remove();
        const meta = document.createElement('meta');
        meta.setAttribute('http-equiv', 'Content-Type');
        meta.setAttribute('content', 'application/xml; charset=utf-8');
        document.head.appendChild(meta);
        
      } catch (error) {
        console.error('Error generating articles sitemap:', error);
        setSitemapXml(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`);
      } finally {
        setLoading(false);
      }
    };

    loadSitemap();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        fontFamily: 'monospace', 
        whiteSpace: 'pre-wrap', 
        padding: '20px',
        backgroundColor: '#f5f5f5' 
      }}>
        Generating articles sitemap...
      </div>
    );
  }

  return (
    <pre style={{ 
      fontFamily: 'monospace', 
      whiteSpace: 'pre-wrap', 
      padding: '20px',
      backgroundColor: '#f5f5f5',
      margin: 0,
      fontSize: '12px',
      lineHeight: '1.4'
    }}>
      {sitemapXml}
    </pre>
  );
}