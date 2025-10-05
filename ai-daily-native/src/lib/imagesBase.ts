// Native image helpers
export const SUPABASE_PUBLIC =
  'https://ykfiubiogxetbgdkavep.supabase.co/storage/v1/object/public';

export const mediaBase = (id: string) =>
  `${SUPABASE_PUBLIC}/media/articles/${id}`;

// Get hero image URL (for large cards)
export const getHeroImage = (id: string, width: 800 | 1200 | 1600 = 1200) =>
  `${mediaBase(id)}/hero_${width}.webp`;

// Get list thumbnail URL (for article rows)
export const getListThumb = (id: string, width: 320 | 480 | 640 = 480) =>
  `${mediaBase(id)}/list_${width}.webp`;

// Get standard image (for mini cards)
export const getStandardImage = (id: string, width: 400 | 800 = 400) =>
  `${mediaBase(id)}/standard_${width}.webp`;
