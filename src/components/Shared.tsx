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
          {business.brand.logoText}
          <span>{business.brand.logoAccent}</span>
        </strong>
        <small>{business.brand.subtitle}</small>
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
  avif,
  avifSrcSet,
}: {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
  srcSet?: string;
  avif?: string;
  avifSrcSet?: string;
}) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <div className={`photo-fallback ${className}`} role="img" aria-label={alt}>
      <CarFront size={52} />
      <span>{business.shortName}</span>
    </div>
  ) : (
    <picture className="photo-picture">
      {avif && (
        <source
          type="image/avif"
          srcSet={avifSrcSet || avif}
          sizes={srcSet ? "(max-width: 700px) 100vw, 55vw" : undefined}
        />
      )}
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
    </picture>
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
        <p className="eyebrow">
          {business.shortName}
          {business.demo ? " · DEMO" : ""}
        </p>
        <h2 id="legal-title">
          {kind === "cookies"
            ? "Cookies & απόρρητο"
            : business.demo
              ? "Πολιτική απορρήτου demo"
              : "Πολιτική απορρήτου"}
        </h2>
        {!business.demo ? (
          <p className="legal-client-text">
            {kind === "cookies"
              ? business.legal.cookiesText
              : business.legal.privacyText}
          </p>
        ) : kind === "cookies" ? (
          <>
            <p>
              Αυτό το demo δεν χρησιμοποιεί cookies, εργαλεία ανάλυσης ή
              διαφημιστικούς ιχνηλάτες. Οι γραμματοσειρές και οι φωτογραφίες
              φιλοξενούνται μαζί με τον ιστότοπο.
            </p>
            <p>
              Οι ενέργειες επικοινωνίας και οι οδηγίες χάρτη είναι ανενεργές. Ο
              σύνδεσμος επίσημης ενημέρωσης οδηγεί σε κρατικό ιστότοπο, όπου
              ισχύει η δική του πολιτική απορρήτου.
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
