
export function ArticleHero({ id, title, priority = false }: { id: string; title: string; priority?: boolean }) {
  const base = `${mediaBase(id)}/hero`; // -> .../media/articles/<id>/hero

  return (
    <picture>
      <source
        type="image/webp"
        srcSet={`${base}_800.webp 800w, ${base}_1200.webp 1200w, ${base}_1600.webp 1600w`}
        sizes="(max-width: 640px) 100vw, (max-width: 1200px) 90vw, 1200px"
      />
      <img
        src={`${base}_1200.webp`}
        alt={title}
        width={1200}
        height={675}
        loading={priority ? 'eager' : 'lazy'}
        {...(priority ? { fetchpriority: 'high' as any } : {})}
        style={{ aspectRatio: '16 / 9', objectFit: 'cover', borderRadius: 16 }}
      />
    </picture>
  );
}
