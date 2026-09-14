import { test, expect } from "@playwright/test";

test("phone hero, readable copy, targets and sticky actions", async ({
  page,
}) => {
  for (const width of [320, 360, 375, 390, 430]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("./");
    await expect(page.locator(".header-cta")).not.toBeVisible();
    await expect(page.locator(".hero-buttons .button-yellow")).toBeVisible();
    const measurements = await page.evaluate(() => {
      const primary = document
        .querySelector(".hero-buttons .button-yellow")!
        .getBoundingClientRect();
      const image = document
        .querySelector(".hero-visual")!
        .getBoundingClientRect();
      const proof = document
        .querySelector(".hero-proof")!
        .getBoundingClientRect();
      const tiny = [
        ...document.querySelectorAll<HTMLElement>("main *,footer *"),
      ]
        .filter(
          (el) =>
            el.getClientRects().length &&
            !el.closest("svg,.honeypot") &&
            [...el.childNodes].some(
              (n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim(),
            ) &&
            parseFloat(getComputedStyle(el).fontSize) < 11,
        )
        .map((el) => `${el.tagName}.${el.className}`);
      return {
        primaryWidth: primary.width,
        imageTop: image.top,
        proofTop: proof.top,
        tiny,
        targets: [
          ...document.querySelectorAll(
            ".mobile-action-bar > *, .menu-toggle,.segmented-control button,.licence-card-bottom a",
          ),
        ].map((el) => el.getBoundingClientRect().height),
      };
    });
    expect(measurements.primaryWidth).toBeGreaterThan(width * 0.8);
    expect(measurements.imageTop).toBeLessThan(650);
    expect(measurements.proofTop).toBeGreaterThan(measurements.imageTop);
    expect(measurements.tiny).toEqual([]);
    expect(measurements.targets.every((height) => height >= 44)).toBe(true);
    await page.locator("#name").focus();
    await expect(page.locator(".mobile-action-bar")).not.toBeVisible();
    expect(
      await page
        .locator("#name")
        .evaluate((el) => getComputedStyle(el).fontSize),
    ).toBe("16px");
    await page.locator("#name").evaluate((el) => el.blur());
    await expect(page.locator(".mobile-action-bar")).toBeVisible();
    await page.locator(".submit-button").focus();
    await page.keyboard.press("Tab");
    await expect(
      page.locator('.direct-contact [data-contact="phone"]'),
    ).toBeFocused();
  }
});

test("mobile reviews scroll horizontally and expose every review through controls", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  const rail = page.getByRole("region", { name: "Αξιολογήσεις μαθητών" });
  await expect(rail.locator(".review-card")).toHaveCount(6);
  expect(
    await rail.evaluate(
      (el) =>
        el.scrollWidth > el.clientWidth &&
        getComputedStyle(el).scrollSnapType === "x mandatory",
    ),
  ).toBe(true);
  await rail.focus();
  await page.keyboard.press("ArrowRight");
  await expect
    .poll(() => rail.evaluate((el) => el.scrollLeft))
    .toBeGreaterThan(0);
  await rail.evaluate((el) => el.scrollTo({ left: 0, behavior: "instant" }));
  await expect(page.locator(".review-controls > span")).toContainText("1");
  const next = page.getByRole("button", { name: "Επόμενες αξιολογήσεις" });
  for (let index = 2; index <= 6; index++) {
    await next.click();
    await expect(page.locator(".review-controls > span")).toHaveText(
      `${index} / 6`,
    );
  }
  await expect(next).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Προηγούμενες αξιολογήσεις" }),
  ).toBeEnabled();
  const dimensions = await page.evaluate(() => ({
    viewport: innerWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(rail.locator(".review-card")).toHaveCount(3);
  expect(await rail.evaluate((el) => getComputedStyle(el).display)).toBe(
    "grid",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".review-controls > span")).toHaveText("1 / 6");
  await expect(next).toBeEnabled();
});

test("menu suppresses sticky actions, traps focus and closes through backdrop", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  const toggle = page.getByRole("button", { name: "Άνοιγμα μενού" });
  await toggle.click();
  await expect(page.locator(".mobile-action-bar")).not.toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe(
    "hidden",
  );
  await expect(page.locator("#mobile-nav a").first()).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(page.locator(".menu-toggle")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.locator("#mobile-nav a").first()).toBeFocused();
  await page.locator(".menu-backdrop").click({ position: { x: 5, y: 750 } });
  await expect(toggle).toBeFocused();
  await expect(page.locator(".mobile-action-bar")).toBeVisible();
  await toggle.click();
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(page.locator("#mobile-nav")).not.toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe(
    "hidden",
  );
});
