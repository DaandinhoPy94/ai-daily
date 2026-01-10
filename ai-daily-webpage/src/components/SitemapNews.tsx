import { useEffect, useState } from 'react';
import { generateNewsSitemap } from '@/lib/sitemaps';

export default function SitemapNews() {
  const [sitemapXml, setSitemapXml] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSitemap = async () => {
      try {
        const xml = await generateNewsSitemap();
        setSitemapXml(xml);

        // Set content type to XML
        document.querySelector('meta[http-equiv="Content-Type"]')?.remove();
        const meta = document.createElement('meta');
        meta.setAttribute('http-equiv', 'Content-Type');
        meta.setAttribute('content', 'application/xml; charset=utf-8');
        document.head.appendChild(meta);
      } finally {
        setLoading(false);
      }
    };

    loadSitemap();
  }, []);

  if (loading) return null;

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


