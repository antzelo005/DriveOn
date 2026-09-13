import { ContactActionLink } from "../components/ContactActions";
import { useState } from "react";
import {
  ArrowUpRight,
  GraduationCap,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  TrainFront,
} from "lucide-react";
import { business } from "../data/business";
import { Logo, SectionHeading } from "./Shared";

export function Location() {
  const [showMap, setShowMap] = useState(false);
  return (
    <section className="location-section section" id="topothesia">
      <div className="container location-layout">
        <div>
          <SectionHeading
            label="ΣΤΗ ΓΕΙΤΟΝΙΑ ΣΟΥ"
            title={
              business.demo
                ? "Μια διαδρομή στη Δυτική Αθήνα."
                : `Τα λέμε στο ${business.city}.`
            }
          >
            {business.demo
              ? "Το concept τοποθετείται στο Περιστέρι και τις γύρω γειτονιές. Δεν αντιστοιχεί σε πραγματικό κατάστημα."
              : `Πέρασε να γνωριστούμε από κοντά. ${business.location.nearestTransport ? `Πρόσβαση από ${business.location.nearestTransport}.` : ""}`}
          </SectionHeading>
          <div className="address-line">
            <MapPin size={21} />
            <div>
              <strong>{business.name}</strong>
              <p>
                {business.demo ? business.location.areaLabel : business.address}
                <br />
                {!business.demo && `${business.city} ${business.postalCode}`}
              </p>
            </div>
          </div>
          <dl className="opening-hours">
            {business.openingHours.map((item) => (
              <div key={item.days}>
                <dt>{item.days}</dt>
                <dd>{item.hours}</dd>
              </div>
            ))}
          </dl>
          <div className="location-buttons">
            <ContactActionLink
              className="button button-dark"
              action="maps"
              target="_blank"
              rel="noreferrer"
            >
              Οδηγίες μέσω Google Maps
              <ArrowUpRight size={17} />
            </ContactActionLink>
            <ContactActionLink
              className="icon-button"
              action="phone"
              aria-label="Κάλεσέ μας"
            >
              <Phone size={20} />
            </ContactActionLink>
          </div>
          {business.demo && (
            <p className="location-demo">
              Ενδεικτική περιοχή και ωράριο · Δεν υπάρχει φυσική σχολή.
            </p>
          )}
          {!business.demo && business.location.embedUrl && (
            <div className="map-embed-option">
              <p>
                Ο διαδραστικός χάρτης φορτώνει από την Google μόνο αν το
                επιλέξεις, με τη δική της πολιτική απορρήτου.
              </p>
              <button
                type="button"
                className="text-link"
                onClick={() => setShowMap(!showMap)}
                aria-expanded={showMap}
              >
                {showMap ? "Κλείσιμο χάρτη" : "Φόρτωση Google Maps"}
              </button>
            </div>
          )}
        </div>
        {showMap && !business.demo ? (
          <iframe
            className="map-panel map-embed"
            title={`Χάρτης — ${business.name}`}
            src={business.location.embedUrl}
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div
            className="map-panel"
            role="img"
            aria-label={`Σχηματική απεικόνιση περιοχής ${business.city}, όχι χάρτης πλοήγησης`}
          >
            <div className="map-block block-one" />
            <div className="map-block block-two" />
            <div className="map-block block-three" />
            <div className="map-park" />
            <div className="map-road road-one" />
            <div className="map-road road-two" />
            <div className="map-road road-three" />
            <span className="map-street">{business.region.toUpperCase()}</span>
            <span className="map-area">{business.city.toUpperCase()}</span>
            <span className="map-metro">
              <TrainFront size={17} /> {business.location.nearestTransport}
            </span>
            <div className="map-marker">
              <Navigation size={25} />
              <strong>
                {business.demo ? business.city : business.shortName}
              </strong>
              <span>
                {business.demo ? "Περιοχή του concept" : "Η γειτονιά μας"}
              </span>
            </div>
            <div className="map-caption">
              <MapPin size={15} />
              {business.location.areaLabel}
              <span>Σχηματικός χάρτης</span>
            </div>
          </div>
        )}
      </div>
      <div className="container areas">
        <span>ΚΟΝΤΑ ΣΟΥ · {business.location.areaLabel.toUpperCase()}</span>
        <div>
          {business.areasServed.map((area) => (
            <span key={area}>{area}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
export function Footer({
  openLegal,
}: {
  openLegal: (kind: "privacy" | "cookies") => void;
}) {
  return (
    <>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <Logo light />
            <p>
              Κάθε μεγάλη διαδρομή ξεκινά
              <br />
              με ένα μικρό βήμα.
              <br />
              Κάνε το δικό σου μαζί μας.
            </p>
            <span className="footer-tagline">{business.brand.tagline}</span>
          </div>
          <div>
            <h3>Η διαδρομή σου</h3>
            <a href="#diplomata">Διπλώματα & υπηρεσίες</a>
            <a href="#diadikasia">Πώς ξεκινάς</a>
            <a href="#ekpaideftes">Οι εκπαιδευτές</a>
            <a href="#oximata">Τα οχήματά μας</a>
            <a href="#faq">Συχνές ερωτήσεις</a>
          </div>
          <div>
            <h3>Μιλάμε;</h3>
            <ContactActionLink action="phone">
              <Phone size={15} />
              {business.phone}
            </ContactActionLink>
            <ContactActionLink action="mobile">
              {business.mobile}
            </ContactActionLink>
            <ContactActionLink action="email">
              <Mail size={15} />
              {business.email}
            </ContactActionLink>
            <ContactActionLink action="maps" target="_blank" rel="noreferrer">
              {business.demo ? business.location.areaLabel : business.address}
              <br />
              {!business.demo && `${business.city}, ${business.postalCode}`}
            </ContactActionLink>
          </div>
          <div>
            <h3>Ώρες λειτουργίας</h3>
            {business.openingHours.map((item) => (
              <p className="footer-hours" key={item.days}>
                {item.days}
                <br />
                <strong>{item.hours}</strong>
              </p>
            ))}
            {!business.demo && business.socialLinks.length > 0 && (
              <div className="social-links">
                {(business.socialLinks as { label: string; url: string }[]).map(
                  (social) => (
                    <a
                      key={social.url}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                    >
                      {social.label}
                      <ArrowUpRight size={16} />
                    </a>
                  ),
                )}
              </div>
            )}
          </div>
        </div>
        <div className="container footer-bottom">
          <span>
            © {new Date().getFullYear()} {business.shortName}. Όλα τα δικαιώματα
            διατηρούνται.
          </span>
          <div>
            <button
              onClick={(e) => {
                e.currentTarget.focus();
                openLegal("privacy");
              }}
            >
              Πολιτική απορρήτου
            </button>
            <button
              onClick={(e) => {
                e.currentTarget.focus();
                openLegal("cookies");
              }}
            >
              Cookies
            </button>
            <a href="#home">Πίσω στην αρχή ↑</a>
          </div>
        </div>
        {business.demo && (
          <div className="container demo-disclaimer" id="demo-info">
            <GraduationCap size={18} />
            <p>
              Ιστότοπος επίδειξης για μια φανταστική σχολή οδηγών. Στοιχεία
              επικοινωνίας, ομάδα, στόλος και αξιολογήσεις είναι ενδεικτικά. Οι
              φωτογραφίες δημιουργήθηκαν με AI. Δεν παρέχονται πραγματικά
              μαθήματα μέσω αυτού του ιστοτόπου.
            </p>
          </div>
        )}
      </footer>
      <nav className="mobile-action-bar" aria-label="Γρήγορη επικοινωνία">
        <ContactActionLink action="phone">
          <Phone size={19} />
          <span>Κλήση</span>
        </ContactActionLink>
        <ContactActionLink action="whatsapp" target="_blank" rel="noreferrer">
          <MessageCircle size={20} />
          <span>WhatsApp</span>
        </ContactActionLink>
        <a href="#epikoinonia">
          <ArrowUpRight size={20} />
          <span>Ξεκίνα τώρα</span>
        </a>
      </nav>
    </>
  );
}
