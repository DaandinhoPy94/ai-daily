-- Fix homepage slot codes to match frontend expectations
UPDATE public.homepage_slots 
SET code = CASE 
  WHEN code IN ('hero-left', 'hero-middle') THEN 'hero'
  WHEN code = 'row-2' THEN 'row2'
  WHEN code = 'row-3' THEN 'row3'
  ELSE code
END
WHERE code IN ('hero-left', 'hero-middle', 'row-2', 'row-3');