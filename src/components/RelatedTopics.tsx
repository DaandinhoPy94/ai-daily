interface Tag {
  name: string;
  slug: string;
}

interface RelatedTopicsProps {
  tags: Tag[];
}

export function RelatedTopics({ tags }: RelatedTopicsProps) {
  return (
    <section className="mb-12">
      <div className="h-px bg-border mb-6"></div>
      
      <h2 className="text-xl font-bold font-serif mb-6">Gerelateerde onderwerpen</h2>
      
      <div className="flex flex-wrap gap-2">
        {tags.slice(0, 5).map((tag) => (
          <a
            key={tag.slug}
            href={`/tag/${tag.slug}`}
            className="inline-flex items-center px-3 py-1.5 text-sm bg-card border border-border rounded-full hover:bg-accent hover:bg-opacity-40 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-opacity-40 focus-visible:outline-none"
          >
            {tag.name}
          </a>
        ))}
      </div>
    </section>
  );
}