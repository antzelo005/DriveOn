import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { pagesConfig } from "./pages-config.ts";
await mkdir("artifacts/review", { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage();
for (const width of [320, 360, 375, 390, 430, 768, 1280, 1440, 1920]) {
  await page.setViewportSize({ width, height: width < 700 ? 844 : 1000 });
  await page.goto(`http://127.0.0.1:4173${pagesConfig().base}`);
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images].map((i) => {
        i.loading = "eager";
        return i.decode();
      }),
    );
  });
  await page.screenshot({ path: `artifacts/review/${width}-hero.png` });
  for (const id of [
    "diplomata",
    "finder",
    "diadikasia",
    "sxoli",
    "oximata",
    "ekpaideftes",
    "axiologiseis",
    "faq",
    "epikoinonia",
    "topothesia",
  ]) {
    await page
      .locator(`#${id}`)
      .evaluate((el) =>
        el.scrollIntoView({ block: "start", behavior: "instant" }),
      );
    await page.screenshot({ path: `artifacts/review/${width}-${id}.png` });
  }
  await page.screenshot({
    path: `artifacts/review/${width}-full.png`,
    fullPage: true,
  });
  await page
    .locator(".contact-form")
    .evaluate((el) =>
      el.scrollIntoView({ block: "start", behavior: "instant" }),
    );
  await page.screenshot({ path: `artifacts/review/${width}-form.png` });
  if (width <= 700) {
    await page.getByRole("button", { name: "Άνοιγμα μενού" }).click();
    await page.screenshot({ path: `artifacts/review/${width}-menu.png` });
    await page.keyboard.press("Escape");
  }
  await page.locator('.location-buttons [data-contact="maps"]').click();
  await page.screenshot({ path: `artifacts/review/${width}-toast.png` });
  await page.getByRole("button", { name: "Κλείσιμο ενημέρωσης demo" }).click();
}
await browser.close();
console.log(
  "Saved nine viewport reviews, all sections, form, menu and demo feedback.",
);
