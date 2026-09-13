import {
  cp,
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  writeFile,
  symlink,
} from "node:fs/promises";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { chromium, expect } from "@playwright/test";

// An isolated, never-published fixture. The actual demo configuration is untouched.
await mkdir("artifacts", { recursive: true });
const directory = await mkdtemp(resolve("artifacts/client-"));
for (const name of ["src", "public", "config", "scripts"])
  await cp(name, resolve(directory, name), { recursive: true });
for (const name of [
  "package.json",
  "index.html",
  "vite.config.ts",
  "tsconfig.json",
  "tsconfig.app.json",
  "tsconfig.node.json",
])
  await copyFile(name, resolve(directory, name));
await symlink(
  resolve("node_modules"),
  resolve(directory, "node_modules"),
  "junction",
);
const business = JSON.parse(await readFile("src/data/business.json", "utf8"));
Object.assign(business, {
  mode: "client",
  legalName: "Private test fixture",
  name: "Test driving school",
  address: "TEST ADDRESS",
  phoneHref: "+302100000000",
  email: "fixture@example.test",
  whatsappNumber: "+306900000000",
  viberNumber: "+306900000000",
  enabledLicences: ["B"],
});
for (const key of Object.keys(business.publication))
  business.publication[key] = true;
for (const key of Object.keys(business.features))
  business.features[key] = false;
business.legal = {
  privacyText: "Private fixture privacy policy.",
  cookiesText: "Private fixture cookie policy.",
};
business.form.endpoint = "https://leads.example.test/submit";
business.seo.siteUrl = "https://driving-school.example.test/";
business.location.mapsUrl =
  "https://www.google.com/maps/search/?api=1&query=Athens";
business.location.embedUrl = "https://www.google.com/maps/embed?pb=test";
await writeFile(
  resolve(directory, "src/data/business.json"),
  JSON.stringify(business),
);
for (const args of [
  [resolve("node_modules/vite/bin/vite.js"), "build"],
  ["scripts/prerender.mjs"],
]) {
  const result = spawnSync(process.execPath, args, {
    cwd: directory,
    encoding: "utf8",
  });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout);
}
const html = await readFile(resolve(directory, "dist/index.html"), "utf8");
expect(html).toContain("LocalBusiness");
expect(html).toContain("index, follow");
expect(html).not.toContain("CONCEPT DEMO");
expect(html).not.toContain("Φανταστική αξιολόγηση");
expect(await readFile(resolve(directory, "dist/CNAME"), "utf8")).toBe(
  "driving-school.example.test",
);
expect(
  await readFile(resolve(directory, "dist/sitemap.xml"), "utf8"),
).toContain("https://driving-school.example.test/");
// Serve the built fixture through Vite's static preview implementation.
const { preview } = await import("vite");
const server = await preview({
  root: directory,
  configFile: false,
  preview: { host: "127.0.0.1", port: 0 },
  base: "/",
});
const url = `http://127.0.0.1:${server.httpServer.address().port}/`;
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  let posts = 0;
  let maps = 0;
  await page.route("https://leads.example.test/**", async (route) => {
    posts++;
    const payload = route.request().postDataJSON();
    expect(payload.licence).toBe("B");
    expect(payload.consent).toBe(true);
    await route.fulfill({
      status: posts === 1 ? 500 : 200,
      contentType: "application/json",
      body: "{}",
    });
  });
  await page.route("https://www.google.com/maps/embed**", async (route) => {
    maps++;
    await route.fulfill({ status: 200, body: "Map fixture" });
  });
  await page.goto(url);
  await expect(page.locator(".demo-strip")).toHaveCount(0);
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(
    page.locator(".hero-rating,.reviews-section,.early-proof"),
  ).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Toyota Yaris Hybrid" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Μηχανές", exact: true }),
  ).toHaveCount(0);
  await expect(page.locator('a[data-contact="phone"]').first()).toHaveAttribute(
    "href",
    "tel:+302100000000",
  );
  await page
    .getByRole("link", { name: "Με ενδιαφέρει: Αυτοκίνητο", exact: true })
    .click();
  await expect(
    page.locator('a[data-contact="whatsapp"]').first(),
  ).toHaveAttribute("href", /text=.*%CE%92|text=.*B/);
  await page.locator("#name").fill("Private fixture");
  await page.locator("#phone").fill("6912345678");
  await page.locator("#consent").check();
  await page
    .getByRole("button", { name: "Ζήτησε πληροφορίες", exact: true })
    .click();
  await expect(page.locator(".form-error")).toBeVisible();
  await expect(page.locator("#name")).toHaveValue("Private fixture");
  await page
    .getByRole("button", { name: "Ζήτησε πληροφορίες", exact: true })
    .click();
  await expect(page.locator(".form-success")).toContainText(
    "Ευχαριστούμε για το μήνυμά σου",
  );
  expect(posts).toBe(2);
  expect(maps).toBe(0);
  await page.getByRole("button", { name: "Φόρτωση Google Maps" }).click();
  await expect.poll(() => maps).toBe(1);
  expect(errors).toEqual([]);
  console.log(
    "Isolated client fixture passed: root custom-domain base, schema/indexing/sitemap/CNAME, hidden unverified proof, feature flags, contact URLs, contextual WhatsApp, mocked failure/retry/success, click-to-load map. No real data sent.",
  );
} finally {
  await browser.close();
  await new Promise((resolve) => server.httpServer.close(resolve));
}
