# Client onboarding and publication

The live DRIVEON site is a fictional demonstration. Keep `src/data/business.json` set to `"mode": "demo"` for outreach. All contact actions are buttons that explain the demo; no telephone, messaging or map destinations are exposed. Form values and finder answers stay in memory, with no delivery, storage or analytics. Demo output has `noindex, nofollow`, a disallowing robots file, honest `WebSite` schema and no sitemap.

## Collect from the school

- Trading and legal name; logo; approved colours; city and local wording.
- Landline, mobile, email, separate WhatsApp and Viber numbers, actual social profiles.
- Verified street address, postcode, service areas, opening hours, nearby transport, directions URL and Google Business/review links. Optional latitude/longitude and Google Maps embed URL.
- Categories actually taught; manual/automatic availability; evening/Saturday lessons; pickup arrangement; languages; secondary services; any actual free introduction, pricing or promotion and its terms.
- Instructor names, roles, qualifications/experience and approved biographies; actual vehicle models, categories and transmission.
- Consented customer reviews and their source; independently checked rating/count and statistics. Never mark fictional samples verified.
- Licensed real photographs, social image, and permission to publish identifiable people.
- Approved privacy and cookie notices: controller, purposes/legal basis, providers, retention, rights/contact and any consent requirements. No claim of automatic GDPR compliance.
- Delivery endpoint and provider ownership; origin/CORS, validation, rate limiting, spam protection and retention decisions. Never put secrets in browser configuration.

## Configuration map

| File / key                                                                           | Change                                                                                                                  |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `src/data/business.json` → `mode`                                                    | `demo` or `client`; the only mode switch                                                                                |
| `name`, `legalName`, `shortName`, `brand`                                            | Identity, logo text/accent, subtitle, tagline, navy and yellow hex tokens                                               |
| `phone*`, `mobile*`, `email`, `whatsappNumber`, `viberNumber`                        | Real contact channels; empty optional channels are omitted                                                              |
| `location`, `address`, `city`, `postalCode`, `region`, `areasServed`, `openingHours` | Actual local information; map embed stays unloaded until requested                                                      |
| `enabledLicences`, `features`, `services`, `languages`                               | Offered categories and optional services; check hours separately from lesson availability                               |
| `rating`, `stats`                                                                    | Only `verified: true` entries appear in client mode; no aggregate-rating schema is generated                            |
| `media`                                                                              | Relative public paths and meaningful alt text; clear AVIF fields if no corresponding files exist                        |
| `form`                                                                               | HTTPS JSON endpoint, accepted methods and timeout; `VITE_LEAD_ENDPOINT` may override endpoint                           |
| `legal`                                                                              | Reviewed plain-text privacy and cookie notices, with newlines                                                           |
| `seo`                                                                                | Optional absolute site URL, title, description, social image/alt and substantiated price range                          |
| `socialLinks`                                                                        | Actual `{label,url}` profiles only; no empty placeholder buttons                                                        |
| `theoryResource`, `promotion`, `prices`                                              | Optional real content; all are off/empty by default                                                                     |
| `src/data/content.ts`                                                                | Licence descriptions/facts, process, instructor biographies, fleet, reviews and FAQs                                    |
| `src/App.css`, `src/mobile.css`, `src/index.css`                                     | Desktop/shared styling, consolidated phone breakpoints and shared tokens; preserve contrast when changing brand colours |
| `config/github-pages.json`                                                           | Local fallback owner/repository; Actions derives it automatically                                                       |

The main identity is centralized, but Greek editorial copy still needs a human check when changing city or services. In particular, review the hero, school philosophy, category wording, FAQ transfer/retraining answer, team/fleet claims and every image caption. The `publication.contentReviewed` flag attests to this complete review; it is not automatic fact-checking.

## Photos

Use real photographs for client publication. Suggested source sizes: hero/fleet/team 1536×1024 or larger, responsive hero 768px wide, sharing card exactly 1200×630. Keep room above the car, complete wheels, and faces near the upper part of the team crop. Save AVIF and WebP versions with matching framing. The hero requests the smaller source on phones; lower images load lazily. AVIF fields are optional, WebP remains the fallback. Check all crops at 320, 390, 768 and 1440px. Update the logo/favicon and social card as well as photographs; the current social card explicitly says concept demo.

## Optional modules

Automatic lessons, evening/Saturday availability, pickup, free introduction, additional languages, theory-resource link, price packages, promotion, real social profiles, Google reviews link and a click-to-load map are configurable. Do not enable features the school does not offer. `features.pricePackages` expects `prices: [{title,description,price}]`; include terms and what the price covers. `theoryResource` needs `{enabled,title,url}`. Promotion needs `{enabled,title,description}` and deliberately has no countdown or fake urgency.

Analytics is a small provider hook, with no installed tracker. `src/lib/analytics.ts` accepts only named events and category/source labels, never names, numbers, email, message text, age or finder answers. Demo mode ignores all adapters. In client mode analytics remains off until enabled and an adapter is registered. By default it also requires explicit `setAnalyticsConsent(true)` from a reviewed consent experience; no consent UI is shipped because no tracker is active. Revocation uses `setAnalyticsConsent(false)`. Review privacy/cookie wording whenever adding a provider. No automatic cookie banner is needed for the current untracked demo.

## Form integration

`src/lib/leads.ts` validates/normalizes form values and invokes the isolated `src/lib/lead-transport.ts` adapter. JSON payload: `name`, `phone`, `email`, `licence`, `method`, `message`, `consent`. A successful HTTP response must mean the backend accepted the lead. Errors/timeouts preserve entered values for retry; a synchronous lock prevents duplicate submissions. The hidden honeypot suppresses delivery locally; it is not a substitute for server-side validation, rate limiting and spam controls. Implement optional Turnstile in a provider adapter only when needed, with server verification. No CAPTCHA dependency or API keys are included.

Client publication fails when the endpoint is absent or insecure; it never silently simulates client success. The simulated success state exists only for demo/spam-trap interactions. WhatsApp includes the selected category only; personal form values and finder age/history never enter URLs.

## Publish safely

1. Replace all sample content, contact values and imagery; remove unverified proof or provide substantiated replacements.
2. Configure privacy/cookies and HTTPS delivery; test with the intended provider in a staging environment.
3. Review every statement and set the four `publication` review flags only after identity, content, media and legal checks are complete.
4. Set `mode` to `client`. Build validation rejects missing essentials and known sample contact/address values.
5. Run type checking, lint, production build, browser tests, `verify:pages` and a real staging delivery test. The default browser suite assumes demo mode; `node scripts/verify-client.mjs` tests an isolated client fixture with intercepted network responses and leaves the live config unchanged.
6. Verify real contact destinations manually without sending unsolicited messages. Review mobile keyboard behavior on a physical phone.
7. Push the approved configuration to `main`; GitHub Actions builds, verifies and deploys Pages.

## Real `.gr` domain on GitHub Pages

Keep hosting on GitHub Pages. For a domain you control, set `seo.siteUrl` to the final HTTPS origin with a trailing slash, for example `https://www.your-school.gr/`. Configure the same custom domain and its DNS/HTTPS in GitHub Pages settings. The build derives `/` from that URL, writes CNAME and updates canonical, social, schema, robots and sitemap URLs. No Vercel/Netlify config or router rewrite is needed. Do not set a custom domain until ownership, DNS and HTTPS are ready. Clear `seo.siteUrl` to return to repository hosting.

For future local SEO, add genuinely useful, unique pages for offered categories or locations only when the school can supply distinct information. Each actual page needs its own title, description, canonical and prerendered content, plus static output paths supported by Pages. Do not mass-generate near-duplicate neighbourhood pages or put imaginary branches in schema. The current single page deliberately uses refresh-safe fragment navigation.

Licence-finder guidance was checked against [Mitos initial motorcycle licences](https://mitos.gov.gr/index.php/ΔΔ:Αρχική_χορήγηση_άδειας_οδήγησης_κατηγορίας_ΑΜ,_Α1,_Α2,_Α) and [licence extensions](https://mitos.gov.gr/index.php/ΔΔ:Επέκταση_ισχύουσας_άδειας_οδήγησης_εντός_των_κατηγοριών_ΑΜ,_Α1,_Α2,_Α,_Β,_ΒΕ). It is indicative, does not collect a date of birth, and must be reviewed when rules change.
