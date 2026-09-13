import { business } from "../data/business";
import type { LicenceId } from "../data/content";

export type AnalyticsEvent =
  | "contact_click"
  | "licence_selected"
  | "finder_complete"
  | "form_start"
  | "form_success"
  | "form_error";
type EventData = {
  category?: LicenceId | "";
  source?:
    | "phone"
    | "mobile"
    | "email"
    | "whatsapp"
    | "viber"
    | "maps"
    | "finder"
    | "card"
    | "form";
};
type Adapter = (event: AnalyticsEvent, data: EventData) => void;
let adapter: Adapter | undefined;
let consent = false;
/** Register only a reviewed, consent-aware client integration. No script is loaded here. */
export function configureAnalytics(next: Adapter) {
  adapter = next;
}
export function setAnalyticsConsent(allowed: boolean) {
  consent = allowed;
}
export function track(event: AnalyticsEvent, data: EventData = {}) {
  if (
    business.demo ||
    !business.analytics.enabled ||
    (business.analytics.requiresConsent && !consent)
  )
    return;
  // Explicit allowlist prevents form values or finder answers entering an event.
  try {
    adapter?.(event, { category: data.category, source: data.source });
  } catch {
    /* Analytics cannot interrupt contact. */
  }
}
