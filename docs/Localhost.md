heb ik een localhost locatie zodat ik de website kan openen?

I'll check your project's dev server configuration and scripts to confirm the local URL and how to start it.
Yes. Start the dev server and open http://localhost:8080 in your browser.

npm i
npm run dev

You can also use http://127.0.0.1:8080, and because the server binds to all interfaces, your LAN IP on port 8080 will work too.
  server: {
    host: "::",
    port: 8080,
  },

If you want to preview a production build:
npm run build
npm run preview  

Local dev URL: http://localhost:8080
Start commands: npm i && npm run dev
Production preview: npm run build && npm run preview (on http://localhost:4173)

Aaah i understand, the first is the devolper page, the second is the production webpage?

Short answer: almost.
http://localhost:8080 → development server (with hot reload, unoptimized).
http://localhost:4173 → local preview of the production build (serves files from dist/). It mimics production, but it’s still on your machine.
The actual production website is whatever domain you deploy the dist/ build to (e.g., your hosting provider’s URL).