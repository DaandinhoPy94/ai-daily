// src/lib/imagesBase.ts
export const SUPABASE_PUBLIC =
  'https://ykfiubiogxetbgdkavep.supabase.co/storage/v1/object/public';

export const mediaBase = (id: string) =>
  `${SUPABASE_PUBLIC}/media/articles/${id}`;
