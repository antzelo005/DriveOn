# Validation record

Validated locally on Windows on 13 September 2026.

- Production build, strict TypeScript build and Oxlint: passed.
- 28 browser checks: passed across Chromium, installed Microsoft Edge, WebKit and an emulated mobile viewport.
- After the final demo-mode delivery guard, the four enquiry-flow tests were repeated and passed.
- Automated WCAG A/AA checks: no axe violations in the tested default desktop and mobile states.
- Viewport overflow checks: passed at 320, 375, 390, 768, 1024, 1440 and 1920px.
- Manual screenshot review: desktop, 390px and 320px hero, licence sections, process, team and form. Adjusted secondary text contrast, phone card layouts, hero overlays and team image crop.
- Dialog focus restoration fixed for WebKit and verified. Form errors focus the first invalid input; success receives focus. Native FAQ supports keyboard activation.
- Enquiry tests assert that demo submissions produce no POST requests. The demo flag also prevents configured endpoints from being used accidentally.
- Local mobile Lighthouse: Performance **97**, Accessibility **100**, Best Practices **100**, SEO **69**. FCP 1.8 seconds, LCP 2.3 seconds, total blocking time 110 milliseconds and CLS 0.001. Scores are a local simulated mobile run, not field measurements.
- Firefox was attempted but the Playwright browser executable could not start because Windows reported a missing `mozglue` side-by-side assembly. The explicit Firefox suite is retained for a working environment. No Firefox pass is claimed.
- WebKit testing does not replace a final physical-device Safari check.

The fictional demo deliberately disallows search indexing. Canonical and social metadata now use the full GitHub Pages URL, including `/DriveOn/`. No aggregate rating is included in structured data.

Generated reports and screenshots live in the ignored `artifacts/` directory. Browser reports and failure traces are also ignored. The repository contains no secrets, generated build output or installed packages in its tracked source set. The website is deployed through GitHub Actions to GitHub Pages at https://antzelo005.github.io/DriveOn/.

## GitHub Pages deployment verification

- Repository: https://github.com/antzelo005/DriveOn
- Live site: https://antzelo005.github.io/DriveOn/
- First successful Actions deployment: https://github.com/antzelo005/DriveOn/actions/runs/34773585617
- Production Vite base: `/DriveOn/`, derived from the actual repository name in Actions. Dynamic images, pre-rendered image sources, compiled CSS/JavaScript, fonts, favicon and metadata all retain the prefix.
- GitHub Pages source is configured as GitHub Actions; pushes to `main` deploy automatically.
- Production build and lint passed locally; GitHub's Linux runner passed `npm ci`, lint, build, pre-render, prefix verification and deployment.
- All 28 existing browser checks passed after adapting their navigation URLs to the production base.
- `npm run verify:pages` passed against a strict static subdirectory server, without a Vite or SPA fallback.
- `npm run verify:pages -- --url=https://antzelo005.github.io/DriveOn/` passed against the live site at 1440px, 390px and 320px. Verified nine resources under the repository prefix, image decoding, responsive sources, CSS, fonts, favicon, hydration, vehicle filters, category selection, FAQ, anchor reloads and metadata. No console or HTTP errors occurred.
- Vercel and Netlify configuration files were removed. Only GitHub Pages deployment is configured.
