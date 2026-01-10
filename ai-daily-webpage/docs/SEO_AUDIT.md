AI Dagelijks – SEO Audit & Implementation

Findings (Summary)
- Canonical domain unified to https://aidagelijks.nl
- News sitemap (last 48h) added and linked in robots.txt
- Index shell defaults fixed (lang=nl; OG/Twitter; manifest/theme-color)
- Per-route SEO via Helmet preserved; Organization + WebSite JSON-LD on home
- BreadcrumbList JSON-LD on article pages; pagination prev/next on listings
- LCP improved by eager/high priority for hero images (home heroes, article hero)
- Search canonical to /search; query results noindex
- Assets TODO: /public/og-default.jpg, /public/logo.png

Quick Wins
- Robots.txt corrections and News sitemap
- Canonical domain unification
- LCP boosts on hero images
- Breadcrumb + Organization JSON-LD

Medium/Long-term
- Consider SSR/SSG or prerender for article and listing routes
- Image CDN with responsive srcset and width/height metadata
- Consent Mode v2 for analytics (defer until consent)

Validation Checklist
- Titles/descriptions unique per route
- Structured Data passes Rich Results (NewsArticle, Organization, BreadcrumbList)
- Sitemap index + news sitemap valid and referenced
- Lighthouse SEO ≥ 95 mobile; CWV LCP/CLS/INP improved due to priority images
- lang="nl" consistent

How-to for new content
- Articles: set seo_title, seo_description, hero_image_id; JSON-LD auto via buildArticleJSONLD
- Topics: titles/descriptions via getTopicSEO; Breadcrumb JSON-LD via buildBreadcrumbJSONLD
- Default OG image at /public/og-default.jpg; publisher logo at /public/logo.png

Social Profiles
- X: https://x.com/AI_dagelijks
- LinkedIn: https://www.linkedin.com/company/ai-dagelijks/
- Instagram: https://www.instagram.com/ai.dagelijks/
- Facebook: https://www.facebook.com/aidagelijks


