export function buildLocalSrcSet(basePath: string, widths = [400, 800, 1200, 1600]) {
    const mk = (w: number, ext='webp') => `${basePath}_${w}.${ext}`;
    return {
      src: mk(widths[1] ?? widths[0]),
      srcSetWebp: widths.map(w => `${mk(w)} ${w}w`).join(', '),
      jpgFallback: widths.map(w => `${mk(w,'jpg')} ${w}w`).join(', ')
    };
  }
  