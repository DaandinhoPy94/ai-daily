-- Create new media asset for Nvidia image
INSERT INTO media_assets (
  id,
  path,
  type,
  alt,
  title,
  width,
  height,
  created_at
) VALUES (
  gen_random_uuid(),
  'src/assets/nvidia-ai-chip-cityscape.jpg',
  'image',
  'NVIDIA AI-chip boven futuristische stad met gouden munten regen en groene circuits',
  'Nvidia AI Chip Cityscape',
  1200,
  800,
  NOW()
);

-- Update the Nvidia article to use the new hero image
UPDATE articles 
SET hero_image_id = (SELECT id FROM media_assets WHERE path = 'src/assets/nvidia-ai-chip-cityscape.jpg')
WHERE title LIKE '%Nvidia%omzet%';