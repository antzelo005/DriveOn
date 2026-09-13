import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import business from "./src/data/business.json" with { type: "json" };
import { pagesConfig } from "./scripts/pages-config.ts";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const pages = pagesConfig(env.GITHUB_REPOSITORY);
  const siteUrl = pages.siteUrl;
  const socialImage = new URL("images/social.jpg", siteUrl).href;
  const title = `Σχολή Οδηγών ${business.city} | ${business.shortName}`;
  const description = `Σχολή οδηγών στο ${business.city} για δίπλωμα αυτοκινήτου και μηχανής. Σύγχρονα οχήματα, έμπειροι εκπαιδευτές και ευέλικτα μαθήματα.`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    description: business.demo
      ? `Fictional demonstration website. ${description}`
      : description,
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
            ...[
              ["description", description],
              ["robots", business.demo ? "noindex, nofollow" : "index, follow"],
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
              ["og:image:alt", "Εκπαιδευτικό αυτοκίνητο DRIVEON στην Αθήνα"],
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
            source: business.demo
              ? "User-agent: *\nDisallow: /\n"
              : `User-agent: *\nAllow: /\nSitemap: ${siteUrl}sitemap.xml\n`,
          });
          this.emitFile({
            type: "asset",
            fileName: "sitemap.xml",
            source: `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${siteUrl}</loc></url></urlset>`,
          });
        },
      },
    ],
    build: { target: ["chrome111", "edge111", "firefox114", "safari16.4"] },
  };
});
