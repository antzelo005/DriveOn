import {
  ContactActionLink,
  ContactProvider,
} from "./components/ContactActions";
import { useContactCategory } from "./lib/contact-context";
import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  MessageCircle,
  Navigation,
  Phone,
} from "lucide-react";
import { business } from "./data/business";
import type { LicenceId } from "./data/content";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Services } from "./components/Services";
import { School } from "./components/School";
import { ReviewsFAQ } from "./components/ReviewsFAQ";
import { Location, Footer } from "./components/LocationFooter";
import { ContactForm } from "./components/ContactForm";
import { LegalDialog } from "./components/Shared";
import "./App.css";

function Site() {
  const { setCategory } = useContactCategory();
  const [selection, setSelection] = useState<{
    id: LicenceId | "";
    key: number;
    message?: string;
  }>({ id: "", key: 0 });
  const [legal, setLegal] = useState<"privacy" | "cookies" | null>(null);
  const selectLicence = (id: LicenceId, message?: string) => {
    setCategory(id);
    setSelection((previous) => ({ id, message, key: previous.key + 1 }));
    requestAnimationFrame(() =>
      document.getElementById("name")?.focus({ preventScroll: true }),
    );
  };
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Services select={selectLicence} />
        <School select={selectLicence} />
        <ReviewsFAQ />
        <section className="contact-section section" id="epikoinonia">
          <div className="container contact-layout">
            <div className="contact-copy">
              <p className="eyebrow">
                <span />Η ΕΠΟΜΕΝΗ ΚΙΝΗΣΗ ΕΙΝΑΙ ΔΙΚΗ ΣΟΥ
              </p>
              <h2>
                Έτοιμος για
                <br />
                την πρώτη σου
                <br />
                <span>διαδρομή;</span>
              </h2>
              <p>
                Πες μας ποιο δίπλωμα σε ενδιαφέρει.
                <br />
                Θα σου εξηγήσουμε τα επόμενα βήματα,
                <br />
                θα λύσουμε τις απορίες σου και θα βρούμε
                <br className="desktop-break" /> το πρόγραμμα που σου ταιριάζει.
              </p>
              <div className="contact-promise">
                <Check size={17} /> Χωρίς δέσμευση. Με όλες τις απαντήσεις.
              </div>
              <div className="direct-contact">
                <span>Προτιμάς να μιλήσουμε κατευθείαν;</span>
                <ContactActionLink className="large-phone" action="phone">
                  <Phone size={23} />
                  {business.phone}
                  <ArrowUpRight size={22} />
                </ContactActionLink>
                <div className="messenger-links">
                  <ContactActionLink
                    action="whatsapp"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle size={18} />
                    WhatsApp
                    <ArrowUpRight size={13} />
                  </ContactActionLink>
                  <ContactActionLink action="viber">
                    <Phone size={17} />
                    Viber
                    <ArrowUpRight size={13} />
                  </ContactActionLink>
                </div>
              </div>
              <div className="contact-route" aria-hidden="true">
                <span />
                <i />
                <span />
                <i />
                <span>
                  <Navigation size={20} />
                </span>
              </div>
            </div>
            <ContactForm
              selection={selection}
              onPrivacy={() => setLegal("privacy")}
            />
          </div>
        </section>
        <Location />
      </main>
      <Footer openLegal={setLegal} />
      <LegalDialog kind={legal} close={() => setLegal(null)} />
    </>
  );
}
export default function App() {
  return (
    <ContactProvider>
      <Site />
    </ContactProvider>
  );
}
