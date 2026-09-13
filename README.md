# DRIVEON — a driving school website for Peristeri

A complete, Greek-first commercial demo built for local driving-school outreach. Custom navy and amber design, original AI photography, responsive layouts, accessible interactions and a working simulated enquiry flow. This is a fictional business, clearly identified on the page; no real student reviews are implied.

## Stack

React 19, TypeScript 6, Vite 8, Tailwind CSS 4, Lucide icons and locally hosted Inter Variable (Greek and Latin subsets). Custom components and CSS provide the design; there is no UI framework, router, database, account system or paid API. The lockfile pins the tested dependency versions. Node 22.12+ or Node 24 LTS is recommended; built here with Node 24.

## Run locally

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. To build and serve the actual production output:

```sh
npm run build
npm run preview
```

The production preview is at `http://localhost:4173/DriveOn/` (the development server still uses `/`).

The build type-checks the application, bundles assets and pre-renders the entire Greek page into `dist/index.html`. React hydrates the existing HTML. Core content, links, headings, FAQs and metadata are available without waiting for JavaScript. Interactive filters and the enquiry form require JavaScript.

## Validation

```sh
npm run typecheck
npm run lint
npx playwright install chromium webkit
npx playwright install msedge  # only if Microsoft Edge is not installed
npm run build
npm test
```

The default suite covers Chromium, installed Edge, WebKit and an emulated 390px phone. It checks the complete enquiry flow, category selection, validation and focus, no network submission in demo mode, vehicle filters, review pagination, keyboard FAQ, privacy dialog, mobile navigation, image loading, duplicate IDs, anchor destinations, pre-rendered metadata, WCAG AA axe checks and widths from 320 to 1920px.

Firefox is an additional explicit suite:

```sh
npx playwright install firefox
npm run test:firefox
```

On this Windows host, Playwright Firefox cannot launch because Windows reports a missing `mozglue` side-by-side assembly. Firefox compatibility has therefore **not** been verified here. WebKit coverage is a Safari-engine check, not testing on a physical iPhone or a macOS Safari installation. No experimental API is required by the application. The FAQ remains usable on browsers without exclusive `details` groups.

## Business customization

| Change                                                                                                | Location                    |
| ----------------------------------------------------------------------------------------------------- | --------------------------- |
| Name, phone, mobile, email, address, hours, service areas, demo flag, statistics, social profiles     | `src/data/business.json`    |
| Derived telephone, WhatsApp, Viber, email and map links                                               | `src/data/business.ts`      |
| Licence categories and age notes, six-step process, instructors, vehicles, reviews, FAQs, image paths | `src/data/content.ts`       |
| Primary colours, font faces and Tailwind tokens                                                       | `src/index.css`             |
| Section appearance and mobile layouts                                                                 | `src/App.css`               |
| Logo lockup, reusable heading, image fallback and legal dialogs                                       | `src/components/Shared.tsx` |
| SEO title, description, structured data, robots and sitemap                                           | `vite.config.ts`            |

To adapt the demo:

1. Replace the business data and all fictional content. The reserved `.example` email deliberately does not belong to a real business. Replace sample phone numbers before enabling real communication.
2. Replace the locally stored photographs and set the paths in `assets`. Keep subject framing similar; check the hero and team image at phone widths. The `Photo` component has a branded fallback for failed loads.
3. Adjust the logo subtitle and location-specific editorial copy when moving to another area. Colours are controlled through CSS tokens; secondary tonal colours can be adjusted in `App.css`.
4. Add actual social profiles to `socialLinks`, for example `{ "label": "Instagram", "url": "https://www.instagram.com/your-profile/" }`. Empty profiles are omitted instead of sending visitors to invented accounts.
5. Replace the fictional reviews, rating and illustrative statistics with substantiated business information. Review text and rating display are intentionally distinct from structured data; no rating markup is emitted.
6. Replace the demo privacy dialog with the business's actual privacy notice and confirm the requirements for any form service or analytics you add.
7. Set `demo` to `false` only for the real business. This removes the global demo notices, switches robots to indexing and directs Maps to the configured street address. Review/photo-specific demo labels should be updated alongside replacement content.
8. Check the GitHub Pages repository configuration, connect lead delivery and rebuild. Test every contact channel with the real details.

## Images

All production images are local in `public/images/`. There are no remote stock-photo dependencies or third-party font requests.

- `driveon-car.webp` and `driveon-car-small.webp`: original hero/fleet photo, responsive sources.
- `driveon-team.webp`: original photo of three fictional instructors.
- `driveon-motorcycle.webp`: illustrative motorcycle training photo.
- `social.jpg`: 1200 × 630 social preview.

Images were generated with the built-in image generation tool, then resized/compressed with Sharp. The source prompts and provenance are in `docs/ASSETS.md`. Photographs are illustrative and do not attest to actual vehicle equipment. The source generation folder is not needed to run or deploy the website.

## Enquiry delivery

`src/lib/leads.ts` is the sole delivery boundary. While `business.demo` is true, or with no `VITE_LEAD_ENDPOINT`, submission waits briefly and returns a clearly labelled demo confirmation. Nothing is sent over the network or stored in cookies, local storage or a database. The form clears after success and retains its values after a delivery error.

Validation accepts ordinary 10-digit Greek landline/mobile numbers, spaces, brackets, dashes, and optional `+30` or `0030`. Email is optional unless chosen as the contact method. Name, phone, category and consent are required. The first invalid field receives focus, loading prevents duplicate submissions, and confirmation/error panels receive focus.

For a real service, replace the privacy notice, set `business.demo` to `false`, and configure a public JSON POST endpoint:

```dotenv
VITE_LEAD_ENDPOINT=https://your-public-form-endpoint
```

The payload contains
ame`, `phone`, `email`, `licence`, `method`, `message`and`consent`. The endpoint must accept JSON, permit this origin through CORS, perform its own validation and return a successful HTTP status only after accepting the lead. A timeout or non-2xx response displays a retryable error. Formspree can be connected through a compatible form endpoint. For EmailJS, Resend, a CRM or custom delivery, replace only `submitLead`with the provider adapter. Resend secret keys belong in a serverless function, never the browser. All`VITE_` values are public at build time.

Before live collection, add appropriate server-side validation, anti-spam/rate limiting, data-retention controls and a reviewed privacy notice. The demo consent wording is not a claim of full GDPR compliance.

## SEO and demo indexing

The build generates a Greek title and description, canonical link, Open Graph and Twitter cards, `LocalBusiness` JSON-LD, `robots.txt` and `sitemap.xml` from the central business configuration. Fictional ratings are excluded from JSON-LD. The site URL is `https://antzelo005.github.io/DriveOn/`. GitHub Actions supplies `GITHUB_REPOSITORY`; the build derives the owner, case-sensitive repository prefix and every public metadata URL from it. Local builds use `config/github-pages.json`. No domain environment variable is needed.

The fictional demo is deliberately
oindex, nofollow`, with robots disallowing crawling. Lighthouse's indexing audit will therefore reduce the SEO score. Production metadata is otherwise present, and changing `demo`to`false` enables indexing. Keep the demo unindexed when publishing it for outreach.

Age guidance was checked against the Greek National Registry of Administrative Procedures (Mitos):

- [Initial motorcycle licence](https://mitos.gov.gr/index.php/ΔΔ:Αρχική_χορήγηση_άδειας_οδήγησης_κατηγορίας_ΑΜ,_Α1,_Α2,_Α)
- [Licence extensions](https://mitos.gov.gr/index.php/ΔΔ:Επέκταση_ισχύουσας_άδειας_οδήγησης_εντός_των_κατηγοριών_ΑΜ,_Α1,_Α2,_Α,_Β,_ΒΕ)

The on-page notes explain the B under-18 accompaniment condition and the A2-to-A exception. Recheck current eligibility, power restrictions and paperwork before adapting for a real school.

## Deployment — GitHub Pages only

Target: **https://antzelo005.github.io/DriveOn/**

`.github/workflows/deploy-pages.yml` runs on every push to `main` and supports manual dispatch. The build job uses Node 24, `npm ci`, linting, the TypeScript/Vite/pre-render build, and Chromium deployment checks. It uploads only `dist`. The deploy job uses GitHub's official Pages actions, an OIDC token, a `github-pages` environment and narrowly scoped `pages: write` / `id-token: write` permissions. Action versions are pinned to commit hashes.

In the repository's **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source. No `gh-pages` branch, server, custom domain, access key or third-party hosting service is needed. Vercel and Netlify configuration files have been removed.

The repository base defaults to `/DriveOn/` for production and preview, while development stays at `/`. On Actions, the actual repository name from `GITHUB_REPOSITORY` takes precedence, so renaming the repository updates the build automatically. For local builds after a rename, update `config/github-pages.json`. A special `owner.github.io` repository uses `/`.

All dynamic public images use `import.meta.env.BASE_URL`, including responsive `srcset` and the static pre-render. Vite rewrites the entry script, stylesheet and favicon. Canonical, Open Graph, Twitter, JSON-LD and sitemap URLs retain the complete repository prefix. `public/.nojekyll` is included in the deployed artifact.

```sh
npm run build
npm run verify:pages
npm run preview
```

`verify:pages` serves `dist` from the repository subdirectory with **no SPA fallback** and checks 1440, 390 and 320px layouts, local images, responsive sources, CSS, font requests, favicon, React hydration, filters, category selection, FAQ links, anchor reloads and metadata. Requests that escape the prefix or return HTTP errors fail the check. The workflow runs this before deployment.

Navigation uses document fragments such as `/DriveOn/#diplomata`; direct links and refreshes work on static GitHub Pages without rewrite rules. The site has no React Router history routes, so copying `index.html` into `404.html` would mask broken URLs and is intentionally unnecessary.

To check a deployed build:

```sh
npm run verify:pages -- --url=https://antzelo005.github.io/DriveOn/
```

A project-level `robots.txt` is published for completeness, but crawlers only recognize robots directives at the origin root. The pre-rendered `noindex, nofollow` meta remains the authoritative indexing instruction for this fictional demo.

Official references: [Vite's GitHub Pages guide](https://vite.dev/guide/static-deploy.html#github-pages) and [GitHub's custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Accessibility and performance choices

Semantic landmarks, one main heading, visible focus rings, a skip link, labelled form fields, native details accordions, a modal dialog with focus return, keyboard mobile navigation, manual review pagination and reduced-motion support. The mobile contact bar includes safe-area padding, with corresponding footer space. No auto-playing carousels, trackers, popups, maps API, background video or animation framework.

Images have fixed dimensions, the hero loads eagerly with responsive sources, supporting photos load lazily, Greek/Latin fonts are served locally, and build output contains pre-rendered content. `scripts/performance.mjs` creates a mobile Lighthouse report against the production preview on port 4173; results are local estimates, not a promise of scores on every host.
