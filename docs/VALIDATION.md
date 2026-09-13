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

The fictional demo deliberately disallows search indexing and uses a reserved `.example` canonical origin until a deployment origin is configured. No aggregate rating is included in structured data.

Generated reports and screenshots live in the ignored `artifacts/` directory. Browser reports and failure traces are also ignored. The repository contains no secrets, generated build output or installed packages in its tracked source set. The website is prepared for static deployment but no public hosting or domain was provisioned.
