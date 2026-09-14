# DRIVEON

A premium Greek driving-school concept built with React 19, TypeScript 6, Vite 8, Tailwind 4, Lucide and locally hosted Inter. Fictional identity, people, fleet and reviews are clearly disclosed. No router, database, account system, paid API or external tracker.

Live: **https://antzelo005.github.io/DriveOn/**

Phone layouts use a clean header, full-width primary action, earlier hero image, compact timelines and a native scroll-snap review rail. The desktop composition is preserved. Phone styles are consolidated in `src/mobile.css` (700, 540 and 359px, plus targeted tablet typography); shared/desktop styling stays in `src/App.css`. The bottom action bar respects safe areas and is suppressed while the menu or a form field is active. No carousel or animation dependency was added.

## Run and verify

Use Node 24, matching GitHub Actions.

```sh
npm ci
npm run dev
npm run typecheck
npm run lint
npm run build
npm run preview
npm test
npm run verify:pages
node scripts/verify-client.mjs
node scripts/review-screenshots.mjs
node scripts/performance.mjs
```

Development uses `/`; production preview uses `http://localhost:4173/DriveOn/`. Install Playwright Chromium/WebKit and use installed Edge for the full suite. The build pre-renders the Greek page and hydrates it; core content does not wait for JavaScript. Contact forms, finder and filters are interactive enhancements.

`npm run test:firefox` is optional. Firefox cannot launch on the current Windows host (`spawn UNKNOWN`, previously diagnosed as a missing mozglue assembly). WebKit checks the engine, not a physical iPhone or macOS Safari. Screenshots, traces and Lighthouse reports are stored in ignored `artifacts`/test output folders. See [validation](docs/VALIDATION.md).

## Demo and client configuration

Start with [the client customization guide](docs/CLIENT_CUSTOMIZATION.md). Identity, branding, contact channels, location, optional features, media, forms, proof, legal notices and SEO are in `src/data/business.json`. Editorial categories, biographies, fleet and reviews live in `src/data/content.ts`.

The single `mode` setting defaults to `demo`. Contact buttons explain the demo without exposing phone, mail, messaging or map destinations. The form validates locally and simulates confirmation without sending or storing personal data. Finder answers remain in memory only. There is no analytics or cookie storage. Demo metadata uses `noindex, nofollow`, `WebSite` schema and no sitemap or fictional address.

Client mode requires reviewed identity/content/media/legal flags and a real HTTPS delivery endpoint. It omits unverified reviews, rating and statistics. Contact URLs become functional; WhatsApp carries only the selected category. The delivery adapter handles errors/timeouts/retry and a honeypot; the actual provider must enforce server-side validation, spam protection and retention. Public endpoint configuration is not a place for secrets.

`node scripts/verify-client.mjs` builds a private fixture under `artifacts` without changing the demo, verifies custom-domain SEO and feature flags, and intercepts all test form/map requests. It does not prove delivery through a real client's backend.

## Images and optional modules

Local AVIF photographs have WebP fallbacks and responsive hero sources. The social card is 1200×630. [Asset provenance](docs/ASSETS.md) records generated imagery; replace it with approved real photographs for a client. `scripts/prepare-images.mjs` accepts the original image folder to regenerate photographs.

Optional configuration supports automatic lessons, evening/Saturday availability, pickup, free introduction, languages, theory resources, price packages, promotion, real social/review links and click-to-load Maps. Unconfigured modules remain hidden. Analytics is an inactive consent-aware adapter hook; no tracking library or consent banner is installed.

## GitHub Pages only

`.github/workflows/deploy-pages.yml` builds and verifies every push to `main`, then deploys `dist` using official, pinned GitHub Pages actions. Pages settings use **GitHub Actions** as the source. `public/.nojekyll` is included. No Vercel, Netlify or `gh-pages` branch is used.

`scripts/pages-config.ts` derives the exact repository base from `GITHUB_REPOSITORY`, falling back to `config/github-pages.json`. All assets and metadata retain `/DriveOn/`. Navigation uses fragments such as `/DriveOn/#diplomata`, which work on direct loads and refreshes without SPA rewrites. Unknown routes remain genuine 404s.

The deployment check serves the production output under the repository prefix with no fallback, checking assets, fonts, image sources, hydration, responsive bounds, navigation and metadata. Run against the live site with:

```sh
node scripts/verify-pages.mjs --url=https://antzelo005.github.io/DriveOn/
```

A future owned `.gr` domain can stay on GitHub Pages: configure its DNS/Pages settings and set `seo.siteUrl` to the HTTPS URL with a trailing slash. The build updates base, CNAME, canonical, social URLs, schema and client sitemap together. The current demo retains its repository URL and remains unindexed.
