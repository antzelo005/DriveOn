import {
  ArrowRight,
  ArrowUpRight,
  Bike,
  CarFront,
  Check,
  Route,
} from "lucide-react";
import { business } from "../data/business";
import { LicenceFinder } from "./LicenceFinder";
import { OptionalServices } from "./OptionalServices";
import { licences, process, reviews } from "../data/content";
import type { LicenceId } from "../data/content";
import { SectionHeading } from "./Shared";

export function Services({
  select,
}: {
  select: (id: LicenceId, message?: string) => void;
}) {
  return (
    <>
      <section id="diplomata" className="section licences-section">
        <div className="container">
          <div className="section-top">
            <SectionHeading
              label="ΔΙΠΛΩΜΑΤΑ & ΥΠΗΡΕΣΙΕΣ"
              title="Διάλεξε τη δική σου διαδρομή."
            >
              Από την πρώτη βόλτα στην πόλη μέχρι την επόμενη απόδραση.
              <br className="desktop-break" /> Το σωστό δίπλωμα ξεκινά με τη
              σωστή καθοδήγηση.
            </SectionHeading>
            <span className="section-index">01 / START YOUR ENGINE</span>
          </div>
          <div className="licence-grid">
            {licences.map((licence) => (
              <article
                key={licence.id}
                id={`licence-${licence.id}`}
                className={`licence-card ${licence.featured ? "featured" : ""}`}
              >
                <div className="licence-card-top">
                  <span className="category-mark">{licence.id}</span>
                  {licence.id === "B" ? (
                    <CarFront size={35} strokeWidth={1.4} />
                  ) : (
                    <Bike size={35} strokeWidth={1.4} />
                  )}
                </div>
                <p className="card-eyebrow">{licence.eyebrow}</p>
                <h3>{licence.title}</h3>
                <p className="licence-description">{licence.description}</p>
                <ul>
                  {licence.facts.map((fact) => (
                    <li key={fact}>
                      <Check size={14} />
                      {fact}
                    </li>
                  ))}
                </ul>
                <div className="licence-card-bottom">
                  <span>{licence.age}</span>
                  <a
                    href="#epikoinonia"
                    onClick={() => select(licence.id)}
                    aria-label={`Με ενδιαφέρει: ${licence.title}`}
                  >
                    Με ενδιαφέρει <ArrowUpRight size={18} />
                  </a>
                </div>
              </article>
            ))}
          </div>
          <div className="licence-notes">
            <p>
              *Β: συνοδευόμενη οδήγηση πριν τα 18. Α: δυνατότητα από τα 22 με Α2
              επί διετία. Ισχύουν επιπλέον προϋποθέσεις ανά κατηγορία.
            </p>
            <a
              href="https://mitos.gov.gr/index.php/ΔΔ:Αρχική_χορήγηση_άδειας_οδήγησης_κατηγορίας_ΑΜ,_Α1,_Α2,_Α"
              target="_blank"
              rel="noreferrer"
            >
              Επίσημη ενημέρωση <ArrowUpRight size={13} />
            </a>
          </div>
          <div className="secondary-services" aria-label="Επιπλέον υπηρεσίες">
            <span>Έχεις ήδη δίπλωμα;</span>
            {business.services
              .filter((service) => service.enabled)
              .map((service) => (
                <a
                  href="#epikoinonia"
                  key={service.label}
                  onClick={() =>
                    select("other", `Με ενδιαφέρει: ${service.label}.`)
                  }
                >
                  {service.label}
                  <ArrowUpRight size={14} />
                </a>
              ))}
          </div>
          <OptionalServices select={select} />
          <LicenceFinder select={select} />
          {reviews[0] && (
            <figure className="early-proof">
              <span className="stars" aria-hidden="true">
                ★★★★★
              </span>
              <div>
                <blockquote>«{reviews[0].text}»</blockquote>
                <figcaption>
                  {reviews[0].name} ·{" "}
                  {business.demo
                    ? "Φανταστική αξιολόγηση demo"
                    : reviews[0].category}
                </figcaption>
              </div>
              <a href="#axiologiseis">
                Δες τις ιστορίες
                <ArrowUpRight size={16} />
              </a>
            </figure>
          )}
        </div>
      </section>
      <section className="process-section section" id="diadikasia">
        <div className="container">
          <div className="section-top">
            <SectionHeading
              light
              label="ΑΠΟ ΤΟ «ΘΕΛΩ» ΣΤΟ «ΟΔΗΓΩ»"
              title={
                <>
                  Ένα βήμα τη φορά.
                  <br />
                  Μαζί, σε όλη τη διαδρομή.
                </>
              }
            />
            <p className="process-intro">
              Δεν χρειάζεται να ξέρεις από πού να αρχίσεις.
              <br />
              Αυτό είναι δική μας δουλειά.
            </p>
          </div>
          <ol className="process-grid">
            {process.map((step, i) => (
              <li key={step.title}>
                <div className="step-line">
                  <span className={i === 5 ? "last-step" : ""}>
                    {i === 5 ? <Check size={20} /> : `0${i + 1}`}
                  </span>
                  <ArrowRight size={17} />
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
          <div className="process-bottom">
            <span>
              <Route size={19} /> Ξεκάθαρα βήματα. Χωρίς περιττή ταλαιπωρία.
            </span>
            <a href="#epikoinonia">
              Κάνε το πρώτο βήμα <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
