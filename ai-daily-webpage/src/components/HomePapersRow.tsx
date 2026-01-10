import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { PaperCard } from './PaperCard';
import { getLatestPapers } from '../lib/supabase';

interface Paper {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  publication_date?: string;
  cover_icon?: { id: string; path: string; alt?: string; title?: string } | null;
  authors?: string[];
}

export function HomePapersRow() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPapers() {
      try {
        const data = await getLatestPapers(3);
        // Type assertion through unknown since we know the structure
        setPapers(data as unknown as Paper[]);
      } catch (error) {
        console.error('Error fetching papers:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPapers();
  }, []);

  return (
    <section className="space-y-6 mb-8">
      {/* Section Divider */}
      <hr className="border-border" />
      
      {/* Section Heading */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold font-serif uppercase tracking-wide text-foreground">
          AI Papers
        </h2>
        <Link 
          to="/papers" 
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <span>Alles weergeven</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* 3-Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="w-full h-48 bg-muted animate-pulse" />
              <div className="p-4 md:p-5 space-y-3">
                <div className="h-3 bg-muted rounded animate-pulse" />
                <div className="h-5 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
              </div>
            </div>
          ))
        ) : (
          papers.map((paper) => (
            <PaperCard
              key={paper.id}
              id={paper.id}
              title={paper.title}
              slug={paper.slug}
              summary={paper.summary}
              publication_date={paper.publication_date}
              cover_icon={paper.cover_icon}
              authors={paper.authors}
              variant="standard"
            />
          ))
        )}
      </div>
    </section>
  );
}