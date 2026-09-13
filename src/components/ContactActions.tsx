import { useContext, useEffect, useRef, useState } from "react";
import type { ComponentProps, ReactNode } from "react";
import { Info, X } from "lucide-react";
import { business, getContactUrl } from "../data/business";
import type { ContactAction } from "../data/business";
import type { LicenceId } from "../data/content";
import { track } from "../lib/analytics";

import { ContactContext } from "../lib/contact-context";
export function ContactProvider({ children }: { children: ReactNode }) {
  const [category, setCategory] = useState<LicenceId | "">("");
  const [visible, setVisible] = useState(false);
  const trigger = useRef<HTMLElement | null>(null);
  const toast = useRef<HTMLDivElement>(null);
  const dismiss = () => {
    if (toast.current?.contains(document.activeElement))
      trigger.current?.focus({ preventScroll: true });
    setVisible(false);
  };
  useEffect(() => {
    if (!visible) return;
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [visible]);
  return (
    <ContactContext.Provider
      value={{
        category,
        setCategory,
        explain: () => {
          trigger.current = document.activeElement as HTMLElement;
          setVisible(true);
        },
      }}
    >
      {children}
      {visible && (
        <div className="demo-toast" ref={toast}>
          <Info size={22} aria-hidden="true" />
          <div role="status" aria-live="polite">
            <strong>Μόνο μια δοκιμαστική διαδρομή.</strong>
            <p>
              Αυτό είναι demo φανταστικής σχολής. Κλήσεις, μηνύματα και οδηγίες
              είναι ανενεργά. Μπορείς να δοκιμάσεις τη φόρμα χωρίς αποστολή
              στοιχείων.
            </p>
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={dismiss}
            aria-label="Κλείσιμο ενημέρωσης demo"
          >
            <X size={20} />
          </button>
        </div>
      )}
    </ContactContext.Provider>
  );
}
export function ContactActionLink({
  action,
  children,
  onClick,
  ...props
}: Omit<ComponentProps<"a">, "href" | "onClick"> & {
  action: ContactAction;
  onClick?: () => void;
}) {
  const context = useContext(ContactContext);
  const { target, rel, ...shared } = props;
  if (!business.demo && !getContactUrl(action, context.category)) return null;
  const clicked = () => {
    onClick?.();
    track("contact_click", { source: action, category: context.category });
  };
  return business.demo ? (
    <button
      {...(shared as ComponentProps<"button">)}
      type="button"
      data-contact={action}
      onClick={(e) => {
        e.currentTarget.focus({ preventScroll: true });
        clicked();
        context.explain();
      }}
    >
      {children}
    </button>
  ) : (
    <a
      {...shared}
      href={getContactUrl(action, context.category)}
      target={target}
      rel={rel}
      data-contact={action}
      onClick={clicked}
    >
      {children}
    </a>
  );
}
