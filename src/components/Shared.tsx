import { useRef, useEffect, useState } from "react";
import { ArrowUpRight, CarFront, MoveUpRight, X } from "lucide-react";
import type { ReactNode } from "react";
import { business } from "../data/business";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <a
      href="#home"
      className={`logo ${light ? "logo-light" : ""}`}
      aria-label={`${business.name} — Αρχική`}
    >
      <span className="logo-mark">
        <MoveUpRight size={25} strokeWidth={3} />
      </span>
      <span>
        <strong>
          {business.shortName.slice(0, -2)}
          <span>{business.shortName.slice(-2)}</span>
        </strong>
        <small>ΣΧΟΛΗ ΟΔΗΓΩΝ · ΠΕΡΙΣΤΕΡΙ</small>
      </span>
    </a>
  );
}
export function SectionHeading({
  label,
  title,
  children,
  light = false,
}: {
  label: string;
  title: ReactNode;
  children?: ReactNode;
  light?: boolean;
}) {
  return (
    <div className={`section-heading ${light ? "light" : ""}`}>
      <p className="eyebrow">
        <span />
        {label}
      </p>
      <h2>{title}</h2>
      {children && <p className="section-description">{children}</p>}
    </div>
  );
}
export function Photo({
  src,
  alt,
  className = "",
  eager = false,
  srcSet,
}: {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
  srcSet?: string;
}) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <div className={`photo-fallback ${className}`} role="img" aria-label={alt}>
      <CarFront size={52} />
      <span>{business.shortName}</span>
    </div>
  ) : (
    <img
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? "(max-width: 700px) 100vw, 55vw" : undefined}
      alt={alt}
      className={className}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      decoding="async"
      width="1536"
      height="1024"
      onError={() => setFailed(true)}
    />
  );
}
export function TextLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a className="text-link" href={href}>
      {children}
      <ArrowUpRight size={18} />
    </a>
  );
}
export function LegalDialog({
  kind,
  close,
}: {
  kind: "privacy" | "cookies" | null;
  close: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (kind && !dialog.current?.open) {
      returnFocus.current = document.activeElement as HTMLElement;
      dialog.current?.showModal();
    } else if (!kind && dialog.current?.open) {
      dialog.current.close();
      returnFocus.current?.focus({ preventScroll: true });
    }
  }, [kind]);
  return (
    <dialog
      ref={dialog}
      className="legal-dialog"
      onCancel={close}
      onClose={close}
      onClick={(e) => {
        if (e.target === dialog.current) close();
      }}
      aria-labelledby="legal-title"
    >
      <div className="legal-content">
        <button
          className="icon-button dialog-close"
          onClick={close}
          aria-label="Κλείσιμο"
        >
          <X />
        </button>
        <p className="eyebrow">{business.shortName} · DEMO</p>
        <h2 id="legal-title">
          {kind === "cookies"
            ? "Cookies & απόρρητο"
            : "Πολιτική απορρήτου demo"}
        </h2>
        {kind === "cookies" ? (
          <>
            <p>
              Αυτό το demo δεν χρησιμοποιεί cookies, εργαλεία ανάλυσης ή
              διαφημιστικούς ιχνηλάτες. Οι γραμματοσειρές και οι φωτογραφίες
              φιλοξενούνται μαζί με τον ιστότοπο.
            </p>
            <p>
              Οι σύνδεσμοι προς Google Maps, WhatsApp και άλλες εξωτερικές
              υπηρεσίες ανοίγουν τις αντίστοιχες εφαρμογές ή ιστοσελίδες, όπου
              ισχύουν οι δικές τους πολιτικές.
            </p>
          </>
        ) : (
          <>
            <p>
              Η {business.name} είναι φανταστική επιχείρηση. Τα πρόσωπα, οι
              φωτογραφίες, οι αξιολογήσεις και τα στοιχεία επικοινωνίας
              παρουσιάζονται αποκλειστικά ως παράδειγμα σχεδιασμού.
            </p>
            <p>
              Στη δοκιμαστική λειτουργία, η φόρμα ελέγχει τα πεδία μόνο στη
              συσκευή σου. Δεν στέλνει, δεν αποθηκεύει και δεν κοινοποιεί τα
              στοιχεία σου. Μη χρησιμοποιείς πραγματικά προσωπικά δεδομένα στο
              demo.
            </p>
            <p>
              Πριν χρησιμοποιηθεί από πραγματική σχολή, απαιτείται πολιτική που
              να περιγράφει τον υπεύθυνο επεξεργασίας, τον σκοπό και τη νομική
              βάση, τους αποδέκτες, τον χρόνο διατήρησης και τον τρόπο άσκησης
              των δικαιωμάτων σου.
            </p>
          </>
        )}
        <button className="button button-dark" onClick={close}>
          Κατάλαβα <ArrowUpRight size={18} />
        </button>
      </div>
    </dialog>
  );
}
