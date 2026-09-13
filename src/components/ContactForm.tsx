import { business } from "../data/business";
import { useContactCategory } from "../lib/contact-context";
import { track } from "../lib/analytics";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowUpRight,
  Check,
  CircleCheck,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";
import { licences } from "../data/content";
import type { LicenceId } from "../data/content";
import {
  initialLead,
  leadEndpoint,
  submitLead,
  validateLead,
} from "../lib/leads";
import type { Lead, LeadErrors } from "../lib/leads";

export function ContactForm({
  selection,
  onPrivacy,
}: {
  selection: { id: LicenceId | ""; key: number; message?: string };
  onPrivacy: () => void;
}) {
  const { setCategory } = useContactCategory();
  const submitting = useRef(false);
  const started = useRef(false);
  const honeypot = useRef<HTMLInputElement>(null);
  const [lead, setLead] = useState<Lead>(initialLead);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [demo, setDemo] = useState(true);
  const form = useRef<HTMLFormElement>(null);
  const result = useRef<HTMLDivElement>(null);
  const [selectionKey, setSelectionKey] = useState(selection.key);
  if (selection.key !== selectionKey) {
    setSelectionKey(selection.key);
    setLead((current) => ({
      ...current,
      licence: selection.id,
      message: selection.message || current.message,
    }));
    setStatus("idle");
    setErrors((current) => ({ ...current, licence: undefined }));
  }
  useEffect(() => {
    if (status === "success" || status === "error") result.current?.focus();
  }, [status]);
  function update<K extends keyof Lead>(key: K, value: Lead[K]) {
    setLead((current) => ({ ...current, [key]: value }));
    if (key === "licence") setCategory(value as LicenceId | "");
    if (!started.current) {
      started.current = true;
      track("form_start", { source: "form" });
    }
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  }
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const nextErrors = validateLead(lead);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      form.current
        ?.querySelector<HTMLElement>(`[name="${Object.keys(nextErrors)[0]}"]`)
        ?.focus();
      return;
    }
    submitting.current = true;
    setStatus("loading");
    try {
      const response = await submitLead(lead, honeypot.current?.value);
      track("form_success", { category: lead.licence, source: "form" });
      setDemo(response.demo);
      setStatus("success");
      setLead(initialLead);
      setCategory("");
    } catch {
      track("form_error", { category: lead.licence, source: "form" });
      setStatus("error");
    } finally {
      submitting.current = false;
    }
  }
  const error = (key: keyof Lead) =>
    errors[key] ? (
      <span className="field-error" id={`${key}-error`}>
        {errors[key]}
      </span>
    ) : null;
  const a11y = (key: keyof Lead) => ({
    "aria-invalid": !!errors[key],
    "aria-describedby": errors[key] ? `${key}-error` : undefined,
  });
  if (status === "success")
    return (
      <div className="form-success" ref={result} tabIndex={-1} role="status">
        <span className="success-icon">
          <CircleCheck size={38} />
        </span>
        <p className="eyebrow">ΤΟ ΠΡΩΤΟ ΒΗΜΑ ΕΓΙΝΕ</p>
        <h3>
          {demo ? "Η δοκιμή ολοκληρώθηκε!" : "Ευχαριστούμε για το μήνυμά σου!"}
        </h3>
        <p>
          {demo
            ? "Έτσι θα μοιάζει η επιβεβαίωση στη δική σου σχολή. Αυτή είναι δοκιμαστική φόρμα: τα στοιχεία σου δεν αποθηκεύτηκαν και δεν στάλθηκε μήνυμα."
            : "Λάβαμε το αίτημά σου. Θα επικοινωνήσουμε μαζί σου το συντομότερο δυνατό, με τον τρόπο που επέλεξες."}
        </p>
        <button
          className="button button-dark"
          onClick={() => {
            setStatus("idle");
            requestAnimationFrame(() =>
              form.current?.querySelector<HTMLInputElement>("#name")?.focus(),
            );
          }}
        >
          Νέο αίτημα <ArrowUpRight size={18} />
        </button>
      </div>
    );
  return (
    <form
      ref={form}
      onSubmit={handleSubmit}
      noValidate
      className="contact-form"
      aria-label="Φόρμα ενδιαφέροντος"
      aria-busy={status === "loading"}
    >
      <div className="form-heading">
        <h3>Ας κάνουμε την αρχή.</h3>
        <p>Λίγα στοιχεία. Ένα βήμα πιο κοντά στο δίπλωμά σου.</p>
      </div>
      {lead.licence && (
        <p className="selection-note">
          Σε ενδιαφέρει:{" "}
          <strong>
            {lead.licence === "other"
              ? "Επιπλέον υπηρεσία / καθοδήγηση"
              : `Κατηγορία ${lead.licence}`}
          </strong>
          . Μπορείς να αλλάξεις την επιλογή σου.
        </p>
      )}
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="company">
          Company
          <input
            ref={honeypot}
            id="company"
            name="company"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>
      <fieldset disabled={status === "loading"} className="form-fields">
        <div className="form-grid">
          <label htmlFor="name">
            Το όνομά σου <span>*</span>
            <input
              id="name"
              name="name"
              autoComplete="name"
              placeholder="π.χ. Ελένη Παπαδοπούλου"
              maxLength={100}
              required
              value={lead.name}
              onChange={(e) => update("name", e.target.value)}
              {...a11y("name")}
            />
            {error("name")}
          </label>
          <label htmlFor="phone">
            Τηλέφωνο <span>*</span>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="π.χ. 691 234 5678"
              maxLength={24}
              required
              value={lead.phone}
              onChange={(e) => update("phone", e.target.value)}
              {...a11y("phone")}
            />
            {error("phone")}
          </label>
          <label htmlFor="licence">
            Ποιο δίπλωμα σε ενδιαφέρει; <span>*</span>
            <select
              id="licence"
              name="licence"
              required
              value={lead.licence}
              onChange={(e) =>
                update("licence", e.target.value as Lead["licence"])
              }
              {...a11y("licence")}
            >
              <option value="">Επίλεξε κατηγορία</option>
              {licences.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.id} — {l.title}
                </option>
              ))}
              <option value="other">Επέκταση / Ανανέωση / Άλλο</option>
            </select>
            {error("licence")}
          </label>
          <label htmlFor="email">
            Email{" "}
            <span className="optional">
              {lead.method === "email" ? "*" : "(προαιρετικό)"}
            </span>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              maxLength={150}
              required={lead.method === "email"}
              value={lead.email}
              onChange={(e) => update("email", e.target.value)}
              {...a11y("email")}
            />
            {error("email")}
          </label>
        </div>
        <fieldset className="contact-methods">
          <legend>
            Πώς προτιμάς να μιλήσουμε; <span>*</span>
          </legend>
          <div>
            {(
              [
                ["phone", "Τηλέφωνο"],
                ["whatsapp", "WhatsApp"],
                ["viber", "Viber"],
                ["email", "Email"],
              ] as const
            )
              .filter(([value]) => business.form.methods.includes(value))
              .map(([value, label]) => (
                <label
                  key={value}
                  className={lead.method === value ? "selected" : ""}
                >
                  <input
                    type="radio"
                    name="method"
                    value={value}
                    checked={lead.method === value}
                    onChange={() => update("method", value)}
                  />
                  {label}
                  {lead.method === value && <Check size={13} />}
                </label>
              ))}
          </div>
        </fieldset>
        <label htmlFor="message">
          Κάτι που θέλεις να ξέρουμε;{" "}
          <span className="optional">(προαιρετικό)</span>
          <textarea
            id="message"
            name="message"
            rows={3}
            maxLength={2000}
            placeholder="Π.χ. έχω ήδη δίπλωμα και θέλω εξάσκηση…"
            value={lead.message}
            onChange={(e) => update("message", e.target.value)}
          />
        </label>
        <div>
          <label className="consent" htmlFor="consent">
            <input
              id="consent"
              name="consent"
              type="checkbox"
              required
              checked={lead.consent}
              onChange={(e) => update("consent", e.target.checked)}
              {...a11y("consent")}
            />
            <span>
              Συμφωνώ να χρησιμοποιηθούν τα στοιχεία μου αποκλειστικά για την
              επικοινωνία σχετικά με το αίτημά μου.
            </span>
          </label>
          {error("consent")}
          <button
            className="privacy-link"
            type="button"
            onClick={(e) => {
              e.currentTarget.focus();
              onPrivacy();
            }}
          >
            Πολιτική απορρήτου
          </button>
        </div>
        <button className="button button-yellow submit-button" type="submit">
          {status === "loading" ? (
            <>
              <LoaderCircle className="spin" size={20} /> Μια στιγμή…
            </>
          ) : (
            <>
              Ζήτησε πληροφορίες <ArrowUpRight size={20} />
            </>
          )}
        </button>
      </fieldset>
      {status === "error" && (
        <div className="form-error" ref={result} tabIndex={-1} role="alert">
          Το μήνυμα δεν στάλθηκε. Τα στοιχεία σου παραμένουν εδώ· δοκίμασε ξανά
          ή επικοινώνησε τηλεφωνικά.
        </div>
      )}
      <p className="form-note">
        <ShieldCheck size={16} />{" "}
        {leadEndpoint
          ? "Τα στοιχεία σου χρησιμοποιούνται μόνο για το αίτημά σου."
          : "Δοκιμαστική φόρμα · Δεν αποστέλλονται ή αποθηκεύονται στοιχεία."}
      </p>
    </form>
  );
}
