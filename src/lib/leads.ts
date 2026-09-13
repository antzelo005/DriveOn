import type { LicenceId } from "../data/content";
import { business } from "../data/business";

export const leadEndpoint = business.demo
  ? undefined
  : import.meta.env.VITE_LEAD_ENDPOINT;

export type ContactMethod = "phone" | "whatsapp" | "viber" | "email";
export interface Lead {
  name: string;
  phone: string;
  email: string;
  licence: LicenceId | "";
  method: ContactMethod;
  message: string;
  consent: boolean;
}
export type LeadErrors = Partial<Record<keyof Lead, string>>;
export const initialLead: Lead = {
  name: "",
  phone: "",
  email: "",
  licence: "",
  method: "phone",
  message: "",
  consent: false,
};

export function validateLead(lead: Lead): LeadErrors {
  const errors: LeadErrors = {};
  if (lead.name.trim().length < 2)
    errors.name = "Γράψε το όνομά σου (τουλάχιστον 2 χαρακτήρες).";
  const phone = lead.phone.replace(/[\s().-]/g, "");
  if (!/^(?:(?:\+30|0030)?[26]\d{9})$/.test(phone))
    errors.phone = "Γράψε ένα έγκυρο ελληνικό τηλέφωνο, π.χ. 691 234 5678.";
  if (lead.method === "email" && !lead.email.trim())
    errors.email = "Χρειαζόμαστε το email σου για να σου απαντήσουμε.";
  else if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email.trim()))
    errors.email = "Έλεγξε τη διεύθυνση email, π.χ. name@example.com.";
  if (!lead.licence) errors.licence = "Επίλεξε το δίπλωμα που σε ενδιαφέρει.";
  if (!lead.consent)
    errors.consent = "Χρειαζόμαστε τη συγκατάθεσή σου για την επικοινωνία.";
  return errors;
}

/** The only delivery boundary. The demo never stores or transmits personal data. */
export async function submitLead(lead: Lead): Promise<{ demo: boolean }> {
  const endpoint = leadEndpoint;
  if (!endpoint) {
    await new Promise((resolve) => setTimeout(resolve, 850));
    return { demo: true };
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        ...lead,
        name: lead.name.trim(),
        email: lead.email.trim(),
      }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error("Lead delivery failed");
    return { demo: false };
  } finally {
    clearTimeout(timeout);
  }
}
