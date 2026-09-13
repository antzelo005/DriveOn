import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { recommendLicence } from "../src/lib/licence-finder";
import type { FinderAnswers } from "../src/lib/licence-finder";
import { createLeadTransport } from "../src/lib/lead-transport";
import { validateClientConfig } from "../scripts/client-readiness";
import config from "../src/data/business.json" with { type: "json" };

test("demo contact actions never navigate, open applications or send data", async ({
  page,
  context,
}) => {
  test.setTimeout(60000);
  const requests: string[] = [];
  await page.goto("./");
  page.on("request", (r) => requests.push(r.url()));
  await expect(
    page.locator(
      'a[href^="tel:"],a[href^="mailto:"],a[href^="viber:"],a[href*="wa.me"],iframe',
    ),
  ).toHaveCount(0);
  const original = page.url();
  for (const action of [
    "phone",
    "mobile",
    "email",
    "whatsapp",
    "viber",
    "maps",
  ]) {
    const button = page.locator(`[data-contact="${action}"]:visible`).first();
    await button.click();
    await expect(page.locator('.demo-toast [role="status"]')).toContainText(
      "Κλήσεις, μηνύματα και οδηγίες είναι ανενεργά",
    );
    await expect(page).toHaveURL(original);
    if (action === "phone") {
      const audit = await new AxeBuilder({ page })
        .include(".demo-toast")
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();
      expect(audit.violations).toEqual([]);
    }
    await page.keyboard.press("Escape");
    await expect(page.locator(".demo-toast")).toHaveCount(0);
    await button.click({ button: "middle" });
    await button.click({ modifiers: ["Control"] });
    await page.keyboard.press("Escape");
  }
  expect(context.pages()).toHaveLength(1);
  expect(
    requests.filter((url) => !url.startsWith(new URL(original).origin)),
  ).toEqual([]);
  expect(
    await page.evaluate(() => ({
      local: localStorage.length,
      session: sessionStorage.length,
      cookie: document.cookie,
    })),
  ).toEqual({ local: 0, session: 0, cookie: "" });
});

test("finder keyboard steps, back, restart and contextual contact selection", async ({
  page,
}) => {
  await page.goto("./");
  const finder = page.locator("#finder");
  await finder
    .getByRole("button", { name: "Μοτοσυκλέτα", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  await expect(finder.locator("h4")).toBeFocused();
  await finder.getByRole("button", { name: "22–23", exact: true }).click();
  await finder
    .getByRole("button", { name: "Α2 για τουλάχιστον 2 χρόνια", exact: true })
    .click();
  await finder
    .getByRole("button", { name: "Χωρίς όριο ισχύος", exact: true })
    .click();
  await expect(finder.locator("h4")).toHaveText("Δες την κατηγορία A");
  await expect(finder.locator("h4")).toBeFocused();
  expect(
    (
      await new AxeBuilder({ page })
        .include("#finder")
        .withTags(["wcag2a", "wcag2aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await finder.getByRole("button", { name: "Πίσω", exact: true }).click();
  await expect(finder.locator("h4")).toContainText("μοτοσυκλέτα");
  await finder.getByRole("button", { name: "Έως 35 kW", exact: true }).click();
  await finder.getByRole("link", { name: "Ζήτησε καθοδήγηση" }).click();
  await expect(page.locator("#licence")).toHaveValue("A2");
  await expect(page.locator("#message")).toHaveValue(/κατηγορία A2/);
  await expect(page.locator("#name")).toBeFocused();
  await finder.getByRole("button", { name: "Από την αρχή" }).click();
  await finder.getByRole("button", { name: "Αυτοκίνητο", exact: true }).click();
  await finder
    .getByRole("button", { name: "Κάτω από 17", exact: true })
    .click();
  await finder.getByRole("button", { name: "Όχι ακόμα", exact: true }).click();
  await expect(finder.locator("h4")).toHaveText("Ας το δούμε μαζί.");
  await expect(
    finder.getByRole("link", { name: "Δες το δίπλωμα" }),
  ).toHaveCount(0);
  await page.reload();
  await expect(finder.locator("h4")).toHaveText("Τι θέλεις να οδηγείς;");
});

test("finder minimum ages, A2 tenure and configured availability", () => {
  const base: FinderAnswers = {
    vehicle: "moto",
    age: "24+",
    existing: "none",
    preference: "unlimited",
  };
  const available = ["B", "A1", "A2", "A"];
  for (const [age, expected] of [
    ["under17", null],
    ["17", null],
    ["18-19", "A1"],
    ["20-21", "A2"],
    ["22-23", "A2"],
    ["24+", "A"],
  ] as const)
    expect(recommendLicence({ ...base, age }, available).category).toBe(
      expected,
    );
  expect(
    recommendLicence({ ...base, age: "22-23", existing: "a2two" }, available)
      .category,
  ).toBe("A");
  expect(
    recommendLicence({ ...base, age: "22-23", existing: "a2recent" }, available)
      .category,
  ).toBe("A2");
  expect(
    recommendLicence({ ...base, age: "20-21", existing: "a2two" }, available)
      .category,
  ).toBe("A2");
  expect(
    recommendLicence({ ...base, vehicle: "car", age: "17" }, available).note,
  ).toContain("συνοδευόμενης");
  expect(recommendLicence(base, ["B"]).category).toBeNull();
  expect(() => validateClientConfig({ ...config, mode: "client" }, "")).toThrow(
    "Client publication blocked",
  );
  expect(() => validateClientConfig(config, "")).not.toThrow();
});

test("lead adapter handles success, failure, retry, timeout and no-send modes", async () => {
  let calls = 0;
  let fail = true;
  const fetcher: typeof fetch = async (_url, init) => {
    calls++;
    expect(init?.method).toBe("POST");
    expect(init?.body).toBe(JSON.stringify({ name: "Demo" }));
    return new Response(null, { status: fail ? 500 : 204 });
  };
  const submit = createLeadTransport({
    demo: false,
    endpoint: "https://example.test/lead",
    fetcher,
  });
  await expect(submit({ name: "Demo" })).rejects.toThrow(
    "Lead delivery failed",
  );
  fail = false;
  await expect(submit({ name: "Demo" })).resolves.toEqual({ demo: false });
  expect(calls).toBe(2);
  await expect(
    createLeadTransport({
      demo: true,
      endpoint: "https://example.test/lead",
      fetcher,
    })({ name: "Demo" }),
  ).resolves.toEqual({ demo: true });
  await createLeadTransport({
    demo: false,
    endpoint: "https://example.test/lead",
    fetcher,
  })({ name: "Demo" }, "bot");
  expect(calls).toBe(2);
  await expect(createLeadTransport({ demo: false })({})).rejects.toThrow(
    "No secure delivery",
  );
  const hanging: typeof fetch = (_url, init) =>
    new Promise((_resolve, reject) =>
      init?.signal?.addEventListener("abort", () =>
        reject(new Error("Timed out")),
      ),
    );
  await expect(
    createLeadTransport({
      demo: false,
      endpoint: "https://example.test/lead",
      timeoutMs: 20,
      fetcher: hanging,
    })({}),
  ).rejects.toThrow("Timed out");
});
