import * as ImgBase from '@/lib/imagesBase';
import { useEffect } from 'react';

useEffect(() => {
  console.log('imagesBase module:', ImgBase);
}, []);

export function ArticleListThumb({ id, title }: { id: string; title: string }) {
  const base = `${mediaBase(id)}/list`; // -> .../media/articles/<id>/list

  return (
    <picture>
      <source
        type="image/webp"
        srcSet={`${base}_320.webp 320w, ${base}_480.webp 480w, ${base}_640.webp 640w`}
        sizes="(max-width: 480px) 120px, (max-width: 1024px) 160px, 200px"
      />
      <img
        src={`${base}_480.webp`}
        alt={title}
        width={200}
        height={Math.round(200 * 9 / 16)}
        loading="lazy"
        style={{ borderRadius: 12, objectFit: 'cover', aspectRatio: '16 / 9' }}
      />
    </picture>
  );
}
