import lighthouse from "lighthouse";
import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { pagesConfig } from "./pages-config.ts";

await mkdir("artifacts", { recursive: true });
const chrome = await chromium.launch({
  args: ["--remote-debugging-port=9222"],
});
try {
  for (let attempt = 0; attempt < 30; attempt++) {
    try {
      await fetch("http://127.0.0.1:9222/json/version");
      break;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }
  const report = await lighthouse(
    `http://127.0.0.1:4173${pagesConfig().base}`,
    {
      port: 9222,
      output: "html",
      logLevel: "error",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    },
  );
  if (!report) throw new Error("No Lighthouse report");
  await writeFile("artifacts/lighthouse.html", report.report);
  const summary = {
    scores: Object.fromEntries(
      Object.entries(report.lhr.categories).map(([key, value]) => [
        key,
        Math.round(value.score * 100),
      ]),
    ),
    metrics: Object.fromEntries(
      [
        "first-contentful-paint",
        "largest-contentful-paint",
        "cumulative-layout-shift",
        "total-blocking-time",
      ].map((key) => [key, report.lhr.audits[key].displayValue]),
    ),
  };
  await writeFile(
    "artifacts/lighthouse-summary.json",
    JSON.stringify(summary, null, 2),
  );
  console.log(JSON.stringify(summary));
} finally {
  await chrome.close();
}
