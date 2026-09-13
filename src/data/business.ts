import config from "./business.json";

export const business = { ...config, demo: config.mode === "demo" };
export type ContactAction =
  "phone" | "mobile" | "email" | "whatsapp" | "viber" | "maps";
/** Never return contact destinations in demo, including for middle-click or copied links. */
export function getContactUrl(
  action: ContactAction,
  category = "",
): string | undefined {
  if (business.demo) return undefined;
  const message =
    category && category !== "other"
      ? `Γεια σας! Θα ήθελα πληροφορίες για δίπλωμα ${category}.`
      : "Γεια σας! Θα ήθελα πληροφορίες για μαθήματα οδήγησης.";
  const urls = {
    phone: business.phoneHref && `tel:${business.phoneHref}`,
    mobile: business.mobileHref && `tel:${business.mobileHref}`,
    email: business.email && `mailto:${business.email}`,
    whatsapp:
      business.whatsappNumber &&
      `https://wa.me/${business.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`,
    viber:
      business.viberNumber &&
      `viber://chat?number=${encodeURIComponent(business.viberNumber)}`,
    maps: business.location.mapsUrl,
  };
  return urls[action] || undefined;
}
