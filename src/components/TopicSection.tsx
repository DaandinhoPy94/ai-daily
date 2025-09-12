import { NewsCard } from './NewsCard';
import { TopicSection as TopicSectionType } from '../types';

interface TopicSectionProps {
  section: TopicSectionType;
}

export function TopicSection({ section }: TopicSectionProps) {
  return (
    <section className="space-y-6">
      {/* Section Divider */}
      <hr className="border-border" />
      
      {/* Section Heading */}
      <h2 className="text-lg font-bold font-serif uppercase tracking-wide text-foreground">
        {section.heading}
      </h2>

      {/* 4-Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {section.articles.map((article) => (
          <NewsCard
            key={article.id}
            article={article}
            variant="standard"
          />
        ))}
      </div>
    </section>
  );
}