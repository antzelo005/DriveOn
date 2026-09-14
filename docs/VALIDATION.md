# Validation record

## Mobile-first refinement — 14 September 2026

- Phone styles are consolidated in `src/mobile.css`: targeted tablet typography, then 700/540/359px rules. Repeated overrides and unused extra-service styling were removed; shared and desktop styling remain in `src/App.css`.
- Mobile hero image starts around 472–489px from the page top at 320–430px widths, beneath one dominant CTA and a quieter secondary link. Reassurance/proof follows the image. Phone headers contain logo/menu; sticky actions provide persistent contact.
- Reviews use native horizontal scroll-snap, a visible next-card hint, keyboard-scrollable region and previous/next controls. All six are reachable, with no timer. Desktop retains its original three-card pagination. Resizing resets the mobile position/counter.
- Process is a vertical timeline, benefits are compact rows, body copy is larger, map height is reduced, and the form precedes direct contacts in both visual and keyboard order. Menu and focused form fields suppress the sticky bar; fields use 16px text.
- Meaningful phone text audit found no text below 11px at 320, 390 and 430px. Major controls have at least 44px touch height. Default page height fell from 14,501 to approximately 13,400px at 320, and from 13,463 to approximately 12,560px at 390, without removing sections.
- Screenshots captured at 320, 360, 375, 390, 430, 768, 1280, 1440 and 1920px, including all sections, form, menu and toast. Hero, categories, process, benefits, fleet, team, reviews, FAQ, contact and location were manually reviewed.
- Desktop before/after comparison at 1280, 1440 and 1920px retained the composition. Selected section screenshots changed by no more than 0.01% of pixels at a 10-level colour threshold (mostly rendering variation); hero screenshots were unchanged. This is a local visual comparison, not a brittle committed pixel assertion.
- Full 56-test suite passed across Chromium, installed Edge, WebKit and emulated mobile. Added coverage includes phone CTA/image order, readable typography, touch targets, keyboard form/contact order, sticky suppression, review scrolling/resize, menu focus/backdrop and 360px overflow. Automated axe checks remained clear.
- Strict TypeScript, lint, production build, strict Pages prefix verification and the isolated client fixture passed. Firefox remains unavailable on this Windows host; WebKit is not a claim of physical Safari or iPhone-keyboard validation.
- Final mobile Lighthouse: Performance **97**, Accessibility **100**, Best Practices **100**, SEO **66**. FCP **1.6s**, LCP **1.7s**, CLS **0.004**, TBT **160ms**. Earlier mobile runs ranged from 95–97 Performance. Demo indexing remains intentionally disabled; scores are simulated local measurements.

Client-readiness deployment succeeded in [GitHub Actions run 34788921179](https://github.com/antzelo005/DriveOn/actions/runs/34788921179); live repository-path verification passed afterward. The mobile update uses the same automatic Pages workflow and `/DriveOn/` base.

## Client-readiness refinement — 14 September 2026

- Strict TypeScript, production build, lint and strict repository-path verification passed.
- 44 checks passed across Chromium, Edge, WebKit and emulated mobile: existing flows plus demo contact isolation, finder age boundaries/back/restart/prefill, accessible feedback, and delivery adapter failure/retry/timeout/no-send behavior.
- An isolated client fixture passed real-mode contact URL, contextual WhatsApp, hidden unverified proof, feature flags, mocked form error/retry/success, click-to-load map, custom-domain base, CNAME, schema, indexing and sitemap checks. No real messages were sent.
- Screenshots captured at 320, 375, 390, 430, 1280, 1440 and 1920px for every major section and the demo toast. Reviewed desktop finder/team, mobile hero/contact/location and photo crops; fixed the footer/sticky button styles and reset focus after adding the honeypot.
- Lighthouse mobile: Performance **97**, Accessibility **100**, Best Practices **100**, SEO **66**; FCP **1.7s**, LCP **2.0s**, CLS **0.005**, TBT **120ms**. Local simulated measurements; demo intentionally remains unindexed.
- Firefox was retried: browser launch still fails with `spawn UNKNOWN`; no Firefox browser pass is claimed. WebKit is an engine proxy, not physical iOS/macOS testing.
- Demo publishes no fictional street address, actionable contact hrefs, LocalBusiness schema or sitemap. AI/sample disclosures remain visible. Optional tracking and real delivery remain off.

The record below documents the original deployment.

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
