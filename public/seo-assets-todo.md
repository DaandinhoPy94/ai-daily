# SEO Assets TODO

Add these assets to the `/public` folder for complete SEO implementation:

## Required Files:

1. **og-default.jpg** (1200x630px) - Default Open Graph image for social sharing
2. **logo.png** (preferably square format) - Publisher logo for JSON-LD structured data
3. **favicon.ico** (already exists)

## Environment Variables:

Set in production environment:
- `VITE_SITE_URL` - Full site URL (e.g., https://ai-nieuws.nl)

## Database Fields to Add:

Consider adding these SEO fields to the `articles` table if not already present:
- `seo_title` (text, nullable) - Custom SEO title
- `seo_description` (text, nullable) - Custom meta description
- `hero_image_id` (uuid, nullable) - Reference to media_assets for hero image

## Lighthouse SEO Checklist:

✅ Title tags implemented
✅ Meta descriptions implemented  
✅ Canonical URLs implemented
✅ Open Graph tags implemented
✅ Twitter Cards implemented
✅ JSON-LD structured data implemented
✅ HTML lang attribute set
⏳ Default OG image (add to public folder)
⏳ Publisher logo (add to public folder)
⏳ Set VITE_SITE_URL environment variable