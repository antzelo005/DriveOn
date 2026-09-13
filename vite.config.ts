import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import business from "./src/data/business.json" with { type: "json" };
import { pagesConfig } from "./scripts/pages-config.ts";
import { validateClientConfig } from "./scripts/client-readiness.ts";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const demo = business.mode === "demo";
  validateClientConfig(
    business,
    env.VITE_LEAD_ENDPOINT || business.form.endpoint,
  );
  const pages = pagesConfig(env.GITHUB_REPOSITORY);
  const siteUrl = pages.siteUrl;
  const socialImage = new URL(business.seo.socialImage, siteUrl).href;
  const title =
    business.seo.title ||
    `Σχολή Οδηγών ${business.city} | ${business.shortName}${demo ? " · Concept demo" : ""}`;
  const description = demo
    ? `Concept ιστοτόπου για φανταστική σχολή οδηγών στο ${business.city}. Δοκίμασε τον οδηγό επιλογής διπλώματος και τη φόρμα χωρίς αποστολή στοιχείων.`
    : business.seo.description ||
      `Σχολή οδηγών στο ${business.city}. Πληροφορίες για διπλώματα, εκπαίδευση και επικοινωνία με τη ${business.shortName}.`;
  const schema = demo
    ? {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: `${business.shortName} — Concept demo`,
        description,
        url: siteUrl,
        inLanguage: "el",
      }
    : {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: business.name,
        description,
        legalName: business.legalName,
        url: siteUrl,
        image: socialImage,
        telephone: business.phoneHref,
        address: {
          "@type": "PostalAddress",
          streetAddress: business.address,
          addressLocality: business.city,
          postalCode: business.postalCode,
          addressRegion: business.region,
          addressCountry: business.country,
        },
        openingHours: business.openingHours.flatMap((item) =>
          item.schema ? [item.schema] : [],
        ),
        areaServed: business.areasServed,
        sameAs: [
          ...(business.socialLinks as { url: string }[]).map((s) => s.url),
          ...(business.location.googleBusinessUrl
            ? [business.location.googleBusinessUrl]
            : []),
        ],
        ...(business.seo.priceRange
          ? { priceRange: business.seo.priceRange }
          : {}),
        ...(business.location.latitude !== null &&
        business.location.longitude !== null
          ? {
              geo: {
                "@type": "GeoCoordinates",
                latitude: business.location.latitude,
                longitude: business.location.longitude,
              },
            }
          : {}),
      };
  return {
    base: mode === "production" ? pages.base : "/",
    plugins: [
      react(),
      tailwindcss(),
      {
        name: "business-seo",
        transformIndexHtml() {
          return [
            { tag: "title", children: title, injectTo: "head" },
            {
              tag: "style",
              children: `:root{--navy:${business.brand.navy};--yellow:${business.brand.accent};--color-navy:${business.brand.navy};--color-amber:${business.brand.accent}}`,
              injectTo: "head",
            },
            ...[
              ["description", description],
              ["robots", demo ? "noindex, nofollow" : "index, follow"],
              ["twitter:card", "summary_large_image"],
              ["twitter:title", title],
              ["twitter:description", description],
              ["twitter:image", socialImage],
            ].map(([name, content]) => ({
              tag: "meta",
              attrs: { name, content },
              injectTo: "head" as const,
            })),
            ...[
              ["og:type", "website"],
              ["og:locale", "el_GR"],
              ["og:site_name", business.name],
              ["og:title", title],
              ["og:description", description],
              ["og:url", siteUrl],
              ["og:image", socialImage],
              ["og:image:width", "1200"],
              ["og:image:height", "630"],
              ["og:image:alt", business.seo.imageAlt],
            ].map(([property, content]) => ({
              tag: "meta",
              attrs: { property, content },
              injectTo: "head" as const,
            })),
            {
              tag: "link",
              attrs: { rel: "canonical", href: siteUrl },
              injectTo: "head",
            },
            {
              tag: "script",
              attrs: { type: "application/ld+json" },
              children: JSON.stringify(schema).replace(/</g, "\\u003c"),
              injectTo: "head",
            },
          ];
        },
        generateBundle() {
          this.emitFile({
            type: "asset",
            fileName: "robots.txt",
            source: demo
              ? "User-agent: *\nDisallow: /\n"
              : `User-agent: *\nAllow: /\nSitemap: ${siteUrl}sitemap.xml\n`,
          });
          if (!demo)
            this.emitFile({
              type: "asset",
              fileName: "sitemap.xml",
              source: `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${siteUrl}</loc></url></urlset>`,
            });
          if (
            business.seo.siteUrl &&
            !new URL(siteUrl).hostname.endsWith(".github.io")
          )
            this.emitFile({
              type: "asset",
              fileName: "CNAME",
              source: new URL(siteUrl).hostname,
            });
        },
      },
    ],
    build: { target: ["chrome111", "edge111", "firefox114", "safari16.4"] },
  };
});
