import {
  ArrowDown,
  ArrowUpRight,
  Check,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { business } from "../data/business";
import { assets } from "../data/content";
import { Photo } from "./Shared";

export function Hero() {
  return (
    <section className="hero" id="home">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">
            <span />
            ΣΧΟΛΗ ΟΔΗΓΩΝ ΣΤΟ ΠΕΡΙΣΤΕΡΙ
          </p>
          <h1>
            Το δίπλωμά σου.
            <br />Η ελευθερία σου.
            <br />
            <span>Ξεκινάει εδώ.</span>
          </h1>
          <p className="hero-description">
            Αυτοκίνητο ή μηχανή; Όποια διαδρομή κι αν διαλέξεις, μαθαίνεις να
            οδηγείς με σιγουριά. Κι εμείς είμαστε δίπλα σου, από το πρώτο
            μάθημα.
          </p>
          <div className="hero-buttons">
            <a className="button button-yellow" href="#epikoinonia">
              Πάμε να ξεκινήσουμε <ArrowUpRight size={20} />
            </a>
            <a className="button button-outline" href="#diplomata">
              Δες τα διπλώματα <ArrowDown size={17} />
            </a>
          </div>
          <div className="hero-reassurance">
            <span>
              <Check size={15} /> Χωρίς άγχος
            </span>
            <span>
              <Check size={15} /> Στον ρυθμό σου
            </span>
            <span>
              <Check size={15} /> Με ξεκάθαρο πλάνο
            </span>
          </div>
          <div className="hero-rating">
            <div className="avatar-stack">
              <span>ΕΚ</span>
              <span>ΜΠ</span>
              <span>ΑΜ</span>
              <span>+</span>
            </div>
            <div>
              <div className="rating-line">
                <span className="stars" aria-label="5 αστέρια">
                  ★★★★★
                </span>
                <strong>
                  4.9<span>/5</span>
                </strong>
              </div>
              <small>
                180+ αξιολογήσεις{" "}
                <span className="demo-label">· Ενδεικτικά στοιχεία demo</span>
              </small>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <Photo
            eager
            src={assets.hero}
            srcSet={`${assets.heroSmall} 768w, ${assets.hero} 1536w`}
            alt="Λευκό εκπαιδευτικό αυτοκίνητο DRIVEON σε αθηναϊκή γειτονιά — εικόνα demo"
          />
          <div className="image-top-label">
            <span className="live-dot" /> Η επόμενη στάση σου: ανεξαρτησία.
          </div>
          <div className="hero-image-bottom">
            <span className="location-tag">
              <MapPin size={16} /> Περιστέρι, Αθήνα
            </span>
            <span className="image-counter">01 — DRIVE YOUR WAY</span>
          </div>
          <div className="lesson-note">
            <span className="lesson-icon">
              <ShieldCheck size={25} />
            </span>
            <div>
              <strong>Το πρώτο βήμα, μαζί.</strong>
              <small>Εσύ φέρνεις τη διάθεση. Εμείς το πλάνο.</small>
            </div>
            <ArrowUpRight size={19} />
          </div>
        </div>
      </div>
      <div className="container trust-stats">
        {business.stats.map((stat) => (
          <div key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
