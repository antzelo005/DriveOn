import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import assert from "node:assert/strict";
import { chromium, expect } from "@playwright/test";
import { pagesConfig } from "./pages-config.ts";

const pages = pagesConfig();
const output = resolve("dist");
const liveUrl = process.argv
  .find((argument) => argument.startsWith("--url="))
  ?.slice(6);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".txt": "text/plain",
};

// Serve only the deployed directory. No SPA fallback or Vite root redirects can
// hide accidental root-relative asset URLs or unsupported application routes.
const server = createServer(async (request, response) => {
  try {
    const path = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    if (!path.startsWith(pages.base)) {
      response.writeHead(404).end();
      return;
    }
    const file = resolve(output, path.slice(pages.base.length) || "index.html");
    if (!file.startsWith(`${output}${sep}`)) {
      response.writeHead(403).end();
      return;
    }
    const body = await readFile(file);
    response
      .writeHead(200, {
        "Content-Type": mime[extname(file)] || "application/octet-stream",
      })
      .end(body);
  } catch {
    response.writeHead(404).end();
  }
});

let browser;
try {
  if (!liveUrl)
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const url =
    liveUrl || `http://127.0.0.1:${server.address().port}${pages.base}`;
  const site = new URL(url);
  assert.equal(
    site.pathname,
    pages.base,
    "The tested URL must include the exact repository prefix.",
  );
  const response = await fetch(url);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.ok(
    html.includes("Το δίπλωμά σου."),
    "Pre-rendered content must be present.",
  );
  assert.ok(
    !/(?:src|href|srcSet|imagesrcset)="\/(?:assets|images|favicon)/i.test(html),
    "No root-relative production assets.",
  );
  assert.ok(
    html.includes(`href="${pages.siteUrl}"`),
    "Canonical must include the repository name.",
  );
  assert.ok(
    (await (await fetch(new URL("sitemap.xml", url))).text()).includes(
      `<loc>${pages.siteUrl}</loc>`,
    ),
  );
  if (!liveUrl && pages.base !== "/") {
    assert.equal(
      (await fetch(new URL("/images/driveon-car.webp", site))).status,
      404,
    );
    assert.equal((await fetch(new URL("unknown-route", url))).status, 404);
  }

  browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];
  const resources = new Set();
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("response", (response) => {
    if (response.status() >= 400)
      errors.push(`${response.status()}: ${response.url()}`);
  });
  page.on("request", (request) => {
    const resource = new URL(request.url());
    if (resource.origin === site.origin) {
      resources.add(resource.pathname);
      if (!resource.pathname.startsWith(pages.base))
        errors.push(`Resource escaped repository path: ${resource.pathname}`);
    }
  });

  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(url);
    await expect(page.locator("h1")).toContainText("Ξεκινάει εδώ.");
    await page.locator("img").evaluateAll(async (images) => {
      await Promise.all(
        images.map((image) => {
          image.loading = "eager";
          return image.decode();
        }),
      );
      if (images.some((image) => !image.naturalWidth))
        throw new Error("Broken image");
    });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(
      await page.evaluate(() =>
        document.fonts.check('16px "Inter Variable"', "Ελληνικά DRIVEON"),
      ),
      true,
    );
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      true,
      `Horizontal overflow at ${width}px`,
    );
    await page.getByRole("button", { name: "Μηχανές", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Honda CB500F" }),
    ).toBeVisible();
    await page.locator(".fleet-photo img").evaluate((image) => image.decode());
    await page
      .getByRole("link", {
        name: "Με ενδιαφέρει: Μηχανή έως 35 kW",
        exact: true,
      })
      .click();
    await expect(page).toHaveURL(`${url}#epikoinonia`);
    await expect(page.locator("#licence")).toHaveValue("A2");
    await page.reload();
    await expect(page.locator("h1")).toContainText("Ξεκινάει εδώ.");
    assert.equal(new URL(page.url()).pathname, pages.base);
    await page.goto(`${url}#faq`);
    await page.locator("summary").first().click();
    await expect(page.locator("details").first()).toHaveAttribute("open", "");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      pages.siteUrl,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      `${pages.siteUrl}images/social.jpg`,
    );
    const schema = JSON.parse(
      await page.locator('script[type="application/ld+json"]').textContent(),
    );
    assert.equal(schema.url, pages.siteUrl);
    const favicon = await page.locator('link[rel="icon"]').getAttribute("href");
    assert.equal((await fetch(new URL(favicon, url))).status, 200);
  }
  assert.deepEqual(
    errors,
    [],
    "No asset, hydration, console or network errors.",
  );
  assert.ok(
    [...resources].some((path) => path.endsWith(".woff2")),
    "Local fonts must load.",
  );
  assert.ok(
    [...resources].some((path) => path.endsWith(".css")),
    "Production stylesheet must load.",
  );
  console.log(
    `GitHub Pages verification passed: ${url}\nThree viewport sizes; images, srcset, CSS, fonts, favicon, hydration, filters, category selection, anchor reloads and SEO URLs. ${resources.size} resources stayed under ${pages.base}.`,
  );
} finally {
  await browser?.close();
  if (server.listening)
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
}
