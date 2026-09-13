import { createLeadTransport } from "./lead-transport";
import type { LicenceId } from "../data/content";
import { business } from "../data/business";

export const leadEndpoint = business.demo
  ? undefined
  : import.meta.env.VITE_LEAD_ENDPOINT || business.form.endpoint;

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

/** The only delivery boundary. Endpoint must validate, rate-limit and reject spam server-side. */
const transport = createLeadTransport({
  demo: business.demo,
  endpoint: leadEndpoint,
  timeoutMs: business.form.timeoutMs,
});
export async function submitLead(
  lead: Lead,
  honeypot = "",
): Promise<{ demo: boolean }> {
  return transport(
    { ...lead, name: lead.name.trim(), email: lead.email.trim() },
    honeypot,
  );
}
