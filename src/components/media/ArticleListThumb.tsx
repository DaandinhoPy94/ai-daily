// src/components/media/ArticleListThumb.tsx
import { mediaBase } from '@/lib/imagesBase';

export function ArticleListThumb({
  id, title, targetWidth = 200, fill = false
}: { id: string; title: string; targetWidth?: number; fill?: boolean }) {
  const base = `${mediaBase(id)}/list`;
  const targetHeight = Math.round(targetWidth * 9 / 16);

  return (
    <picture>
      <source
        type="image/webp"
        srcSet={`${base}_320.webp 320w, ${base}_480.webp 480w, ${base}_640.webp 640w`}
        sizes={fill ? '100vw' : `${targetWidth}px`}
      />
      <img
        src={`${base}_480.webp`}
        alt={title}
        width={targetWidth}
        height={targetHeight}
        loading="lazy"
        style={{
          borderRadius: 8,
          objectFit: 'cover',
          aspectRatio: '16 / 9',
          display: 'block',
          width: fill ? '100%' : undefined,
          height: fill ? '100%' : undefined
        }}
      />
    </picture>
  );
}
