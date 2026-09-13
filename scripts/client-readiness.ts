import defaults from "../src/data/business.json" with { type: "json" };

/** Switching modes alone must never publish the sample identity as a real school. */
export function validateClientConfig(
  business: typeof defaults,
  endpoint: string,
) {
  if (!["demo", "client"].includes(business.mode))
    throw new Error("mode must be demo or client");
  if (business.mode === "demo") return;
  const missing: string[] = [];
  for (const [key, value] of Object.entries(business.publication))
    if (!value) missing.push(`publication.${key}`);
  for (const [key, value] of Object.entries({
    legalName: business.legalName,
    phone: business.phoneHref,
    email: business.email,
    address: business.address,
    privacyText: business.legal.privacyText,
    cookiesText: business.legal.cookiesText,
    endpoint,
  }))
    if (!value.trim()) missing.push(key);
  if (
    business.email.endsWith(".example") ||
    business.phoneHref === "+302101234567" ||
    business.address === "Λεωφ. Παναγή Τσαλδάρη 100"
  )
    missing.push("replace sample contact/address");
  if (endpoint && !/^https:\/\//.test(endpoint))
    missing.push("HTTPS form endpoint");
  if (
    !business.enabledLicences.length ||
    business.enabledLicences.some((id) => !["B", "A1", "A2", "A"].includes(id))
  )
    missing.push("valid enabledLicences");
  if (!business.form.methods.includes("phone"))
    missing.push("phone contact method");
  if (business.form.methods.includes("whatsapp") && !business.whatsappNumber)
    missing.push("whatsappNumber");
  if (business.form.methods.includes("viber") && !business.viberNumber)
    missing.push("viberNumber");
  if (business.features.theoryTests && !business.theoryResource.enabled)
    missing.push("enabled theory resource");
  if (business.features.pricePackages && !business.prices.length)
    missing.push("verified price packages");
  if (
    business.theoryResource.enabled &&
    (!business.theoryResource.title ||
      !/^https:\/\//.test(business.theoryResource.url))
  )
    missing.push("theory resource title and HTTPS URL");
  if (
    business.promotion.enabled &&
    (!business.promotion.title || !business.promotion.description)
  )
    missing.push("promotion content");
  if (
    business.location.embedUrl &&
    !/^https:\/\/www\.google\.com\/maps\/embed(?:\?|\/)/.test(
      business.location.embedUrl,
    )
  )
    missing.push("Google Maps embed URL");
  for (const color of [business.brand.navy, business.brand.accent])
    if (!/^#[\da-f]{6}$/i.test(color))
      missing.push("six-digit brand hex colours");
  if (missing.length)
    throw new Error(
      `Client publication blocked until configured and reviewed: ${missing.join(", ")}`,
    );
}
