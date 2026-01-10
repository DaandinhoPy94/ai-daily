-- Update the hero-middle item to have item_order=2 and move to hero-left slot
UPDATE public.homepage_slot_items 
SET slot_id = '850e8400-e29b-41d4-a716-446655440001', item_order = 2
WHERE slot_id = '850e8400-e29b-41d4-a716-446655440002';

-- Delete the hero-middle slot since we're merging into hero
DELETE FROM public.homepage_slots 
WHERE code = 'hero-middle';

-- Update remaining slot codes
UPDATE public.homepage_slots 
SET code = CASE 
  WHEN code = 'hero-left' THEN 'hero'
  WHEN code = 'row-2' THEN 'row2'
  WHEN code = 'row-3' THEN 'row3'
  ELSE code
END;

-- Update the hero slot to allow more items since we merged
UPDATE public.homepage_slots 
SET max_items = 2
WHERE code = 'hero';