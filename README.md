# AI Dagelijks

News site built with Vite + React + TypeScript + shadcn-ui + Tailwind.

## Local development

Use your preferred IDE, or run locally:

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

You can also edit files directly in GitHub and commit your changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Read State ("already read")

The app marks opened articles as read and subtly de-emphasizes their titles in lists.

- Implementation: `src/hooks/useReadArticles.ts` stores a persistent set in `localStorage`.
- Storage key: `ai-daily:read-articles:v1` (configurable via hook options).
- Integration: `ArticleListRow`, `MiniNewsCard`, `LargeNewsCard`, and `NewsCard` add `data-read` and apply `text-foreground/80` to titles when read.
- Styling: Uses Tailwind tokens; no hardcoded hex. Hover/focus states unchanged.
- Fallback: Minimal `:visited` rule in `src/index.css` lightens headings inside visited links.
- Accessibility: Links remain focusable/clickable; `NewsCard` adds `(gelezen)` in `aria-label` when read.
- SSR safety: All storage access guarded with `typeof window !== 'undefined'`.
- Routing: Marks read on click, mousedown, and Enter/Space to handle SPA transitions.

Reset/clear read state:

```js
localStorage.removeItem('ai-daily:read-articles:v1')
```

Tests: `src/lib/__tests__/readState.test.tsx`.

## Deployment

Build the production bundle and upload the `dist/` folder to your host or CDN.

```sh
npm run build
```

## Project notes

- Read-state behavior is implemented in `src/hooks/useReadArticles.ts` and covered by `src/lib/__tests__/readState.test.tsx`.
- Environment: set `VITE_SITE_URL` for correct canonical URLs and OG tags.
- Icons: place brand icons in `public/icons/` to match `index.html` and `site.webmanifest` references.
