import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

await mkdir("artifacts", { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage();
for (const [name, width, height] of [
  ["desktop", 1440, 1000],
  ["mobile", 390, 844],
  ["small-mobile", 320, 740],
]) {
  await page.setViewportSize({ width, height });
  await page.goto("http://127.0.0.1:5173");
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `artifacts/${name}-hero.png` });
  for (const id of ["diplomata", "diadikasia", "ekpaideftes", "epikoinonia"]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await page.screenshot({ path: `artifacts/${name}-${id}.png` });
  }
  await page.locator("footer").scrollIntoViewIfNeeded();
  await page.locator("img").evaluateAll(async (images) => {
    await Promise.all(images.map((image) => image.decode()));
  });
  await page.screenshot({ path: `artifacts/${name}-full.png`, fullPage: true });
}
await browser.close();
