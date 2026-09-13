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
import { business, contactLinks } from "../data/business";
import { Logo, SectionHeading } from "./Shared";

export function Location() {
  return (
    <section className="location-section section" id="topothesia">
      <div className="container location-layout">
        <div>
          <SectionHeading
            label="ΣΤΗ ΓΕΙΤΟΝΙΑ ΣΟΥ"
            title="Τα λέμε στο Περιστέρι."
          >
            Πέρασε να γνωριστούμε από κοντά. Με εύκολη πρόσβαση από το Μετρό
            Περιστέρι και τις γύρω γειτονιές.
          </SectionHeading>
          <div className="address-line">
            <MapPin size={21} />
            <div>
              <strong>{business.name}</strong>
              <p>
                {business.address}
                <br />
                {business.city} {business.postalCode}, Αθήνα
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
            <a
              className="button button-dark"
              href={contactLinks.maps}
              target="_blank"
              rel="noreferrer"
            >
              Οδηγίες μέσω Google Maps
              <ArrowUpRight size={17} />
            </a>
            <a
              className="icon-button"
              href={contactLinks.phone}
              aria-label="Κάλεσέ μας"
            >
              <Phone size={20} />
            </a>
          </div>
          <p className="location-demo">
            Ενδεικτική διεύθυνση demo. Οι οδηγίες οδηγούν στο κέντρο
            Περιστερίου.
          </p>
        </div>
        <div
          className="map-panel"
          role="img"
          aria-label="Σχηματική απεικόνιση περιοχής Περιστερίου, όχι χάρτης πλοήγησης"
        >
          <div className="map-block block-one" />
          <div className="map-block block-two" />
          <div className="map-block block-three" />
          <div className="map-park" />
          <div className="map-road road-one" />
          <div className="map-road road-two" />
          <div className="map-road road-three" />
          <span className="map-street">ΠΑΝΑΓΗ ΤΣΑΛΔΑΡΗ</span>
          <span className="map-area">ΠΕΡΙΣΤΕΡΙ</span>
          <span className="map-metro">
            <TrainFront size={17} /> Μετρό Περιστέρι
          </span>
          <div className="map-marker">
            <Navigation size={25} />
            <strong>{business.shortName}</strong>
            <span>Το επόμενο βήμα σου, εδώ.</span>
          </div>
          <div className="map-caption">
            <MapPin size={15} />
            Περιστέρι, Δυτική Αθήνα<span>Σχηματικός χάρτης</span>
          </div>
        </div>
      </div>
      <div className="container areas">
        <span>ΚΟΝΤΑ ΣΟΥ, ΣΤΗ ΔΥΤΙΚΗ ΑΘΗΝΑ</span>
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
            <span className="footer-tagline">YOUR NEXT CHAPTER. IN DRIVE.</span>
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
            <a href={contactLinks.phone}>
              <Phone size={15} />
              {business.phone}
            </a>
            <a href={contactLinks.mobile}>{business.mobile}</a>
            <a href={contactLinks.email}>
              <Mail size={15} />
              {business.email}
            </a>
            <a href={contactLinks.maps} target="_blank" rel="noreferrer">
              {business.address}
              <br />
              {business.city}, {business.postalCode}
            </a>
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
            {business.socialLinks.length > 0 && (
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
        <a href={contactLinks.phone}>
          <Phone size={19} />
          <span>Κλήση</span>
        </a>
        <a href={contactLinks.whatsapp} target="_blank" rel="noreferrer">
          <MessageCircle size={20} />
          <span>WhatsApp</span>
        </a>
        <a href="#epikoinonia">
          <ArrowUpRight size={20} />
          <span>Ξεκίνα τώρα</span>
        </a>
      </nav>
    </>
  );
}
