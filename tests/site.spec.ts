import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("page loads without errors, missing images, duplicate IDs or dead anchors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("./");
  await expect(page.locator("h1")).toContainText("Ξεκινάει εδώ.");
  await page.locator("footer").scrollIntoViewIfNeeded();
  await page.locator("img").evaluateAll(async (images) => {
    await Promise.all(
      images.map((image) => {
        (image as HTMLImageElement).loading = "eager";
        return (image as HTMLImageElement).decode();
      }),
    );
  });
  const issues = await page.evaluate(() => {
    const ids = [...document.querySelectorAll("[id]")].map((el) => el.id);
    const broken = [
      ...document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'),
    ]
      .filter((a) => !document.getElementById(a.hash.slice(1)))
      .map((a) => a.hash);
    return { duplicate: ids.filter((id, i) => ids.indexOf(id) !== i), broken };
  });
  expect(issues).toEqual({ duplicate: [], broken: [] });
  expect(errors).toEqual([]);
});

test("category preselection, validation, email preference and demo success", async ({
  page,
}) => {
  const posts: string[] = [];
  page.on("request", (request) => {
    if (request.method() === "POST") posts.push(request.url());
  });
  await page.goto("./");
  await page
    .getByRole("link", { name: "Με ενδιαφέρει: Μηχανή έως 35 kW", exact: true })
    .click();
  await expect(page.locator("#licence")).toHaveValue("A2");
  const submit = page.getByRole("button", {
    name: "Ζήτησε πληροφορίες",
    exact: true,
  });
  await submit.click();
  await expect(page.locator("#name")).toBeFocused();
  await expect(page.locator("#name-error")).toBeVisible();
  await page.locator("#name").fill("Δοκιμή Demo");
  await page.locator("#phone").fill("+30 691 234 5678");
  await page.getByRole("radio", { name: "Email", exact: true }).check();
  await page.locator("#consent").check();
  await submit.click();
  await expect(page.locator("#email")).toBeFocused();
  await expect(page.locator("#email-error")).toContainText("Χρειαζόμαστε");
  await page.locator("#email").fill("demo@example.com");
  await submit.click();
  await expect(
    page.getByRole("button", { name: "Μια στιγμή…" }),
  ).toBeDisabled();
  await expect(page.getByRole("status")).toContainText(
    "Η δοκιμή ολοκληρώθηκε!",
  );
  await expect(page.getByRole("status")).toBeFocused();
  expect(posts).toEqual([]);
  await page.getByRole("button", { name: "Νέο αίτημα" }).click();
  await expect(page.locator("#name")).toHaveValue("");
  await expect(page.locator("#name")).toBeFocused();
});

test("fleet filters, reviews, FAQ and privacy keyboard interaction", async ({
  page,
}) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Μηχανές", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Honda CB500F" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Peugeot 208" })).toHaveCount(
    0,
  );
  await page.getByRole("button", { name: "Επόμενες αξιολογήσεις" }).click();
  await expect(page.locator(".reviews-grid")).toContainText("Κώστας Δ.");
  const question = page.locator("summary").first();
  await question.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("details").first()).toHaveAttribute("open", "");
  await page
    .locator(".footer-bottom")
    .getByRole("button", { name: "Πολιτική απορρήτου" })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page
      .locator(".footer-bottom")
      .getByRole("button", { name: "Πολιτική απορρήτου" }),
  ).toBeFocused();
});

test("responsive widths remain inside viewport", async ({ page }) => {
  for (const width of [320, 360, 375, 390, 430, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("./");
    const dimensions = await page.evaluate(() => ({
      width: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(dimensions.content, `Overflow at ${width}px`).toBeLessThanOrEqual(
      dimensions.width,
    );
  }
});

test("mobile menu supports Escape and section navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  const toggle = page.getByRole("button", { name: "Άνοιγμα μενού" });
  await toggle.click();
  await expect(page.locator("#mobile-nav")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page
    .locator("#mobile-nav")
    .getByRole("link", { name: "Διπλώματα", exact: true })
    .click();
  await expect(page.locator("#mobile-nav")).not.toBeVisible();
  await expect(page).toHaveURL(/#diplomata$/);
});

test("WCAG AA automated accessibility audit", async ({ page }) => {
  await page.goto("./");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    results.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => ({
        target: n.target,
        reason: n.failureSummary,
      })),
    })),
  ).toEqual([]);
});

test("production HTML contains content and accurate demo metadata without JavaScript", async ({
  request,
}) => {
  const response = await request.get("./");
  const html = await response.text();
  expect(html).toContain('lang="el"');
  expect(html).toContain("Το δίπλωμά σου.");
  expect(html).toContain("application/ld+json");
  expect(html).toContain("noindex, nofollow");
  expect(html).not.toContain("aggregateRating");
});
