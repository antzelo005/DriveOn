import { business } from "../data/business";
import { useState } from "react";
import {
  ArrowUpRight,
  Bike,
  CarFront,
  Clock3,
  HeartHandshake,
  Route,
  ShieldCheck,
} from "lucide-react";
import { assets, team, vehicles } from "../data/content";
import type { LicenceId } from "../data/content";
import { Photo, SectionHeading, TextLink } from "./Shared";

export function School({ select }: { select: (id: LicenceId) => void }) {
  const [filter, setFilter] = useState<"car" | "moto">(
    business.enabledLicences.includes("B") ? "car" : "moto",
  );
  const filteredVehicles = vehicles.filter((v) =>
    filter === "car" ? v.category === "B" : v.category !== "B",
  );
  return (
    <>
      <section className="section why-section" id="sxoli">
        <div className="container why-grid">
          <div>
            <SectionHeading
              label="Η ΦΙΛΟΣΟΦΙΑ ΜΑΣ"
              title={
                <>
                  Μαθαίνεις για τον δρόμο.
                  <br />
                  <span className="muted-heading">
                    Όχι μόνο για τις εξετάσεις.
                  </span>
                </>
              }
            >
              Το δίπλωμα είναι η αρχή. Θέλουμε να νιώθεις έτοιμος για όσα
              ακολουθούν: την πρώτη διαδρομή μόνος, την κίνηση, τη βροχή, το
              δύσκολο παρκάρισμα.
            </SectionHeading>
            <TextLink href="#ekpaideftes">Γνώρισε τους ανθρώπους σου</TextLink>
            <div className="quote-note">
              <span>“</span>
              <p>
                Η καλή οδήγηση ξεκινά όταν
                <br />
                το άγχος δίνει τη θέση του στη σιγουριά.
              </p>
            </div>
          </div>
          <div className="benefits-grid">
            {[
              {
                icon: HeartHandshake,
                title: "Υπομονή, σε κάθε μάθημα.",
                text: "Ρωτάς, δοκιμάζεις, ξαναδοκιμάζεις. Εδώ κάθε απορία έχει χώρο.",
              },
              {
                icon: Clock3,
                title: "Χρόνος που σου ταιριάζει.",
                text: `Βρίσκουμε μαζί το πρόγραμμά σου.${business.features.eveningLessons ? " Και απογευματινές ώρες." : ""}${business.features.saturdayLessons ? " Και το Σάββατο." : ""}`,
              },
              {
                icon: ShieldCheck,
                title: "Ξέρεις τι να περιμένεις.",
                text: "Συζητάμε κόστος, μαθήματα και διαδικασία πριν ξεκινήσεις.",
              },
              {
                icon: Route,
                title: "Στην πραγματική πόλη.",
                text: "Εξάσκηση σε διαδρομές που θα κάνεις και μετά το δίπλωμα.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div className="benefit" key={title}>
                <Icon size={27} strokeWidth={1.5} />
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section fleet-section" id="oximata">
        <div className="container">
          <div className="section-top">
            <SectionHeading
              label="ΤΑ ΟΧΗΜΑΤΑ ΜΑΣ"
              title="Το σωστό ξεκίνημα θέλει καλό συνοδηγό."
            >
              Σύγχρονα, φιλικά οχήματα. Για να συγκεντρώνεσαι σε αυτό που
              μετράει: την οδήγηση.
            </SectionHeading>
            <div
              className="segmented-control"
              role="group"
              aria-label="Τύπος οχήματος"
            >
              {business.enabledLicences.includes("B") && (
                <button
                  aria-pressed={filter === "car"}
                  onClick={() => setFilter("car")}
                >
                  <CarFront size={17} /> Αυτοκίνητα
                </button>
              )}
              {business.enabledLicences.some((id) => id !== "B") && (
                <button
                  aria-pressed={filter === "moto"}
                  onClick={() => setFilter("moto")}
                >
                  <Bike size={17} /> Μηχανές
                </button>
              )}
            </div>
          </div>
          <div className="fleet-layout">
            <div className="fleet-photo">
              <Photo
                key={filter}
                src={filter === "car" ? assets.hero : assets.motorcycle}
                avif={
                  filter === "car" ? assets.heroAvif : assets.motorcycleAvif
                }
                alt={
                  filter === "car"
                    ? "Ενδεικτική φωτογραφία εκπαιδευτικού αυτοκινήτου"
                    : "Ενδεικτική φωτογραφία εκπαιδευτικής μοτοσυκλέτας"
                }
              />
              <span className="fleet-photo-label">
                {filter === "car"
                  ? "Τέσσερις τροχοί. Αμέτρητες δυνατότητες."
                  : "Δύο τροχοί. Μια νέα ελευθερία."}
              </span>
              {business.demo && (
                <small>Εικόνα AI για το demo · Ενδεικτικός στόλος</small>
              )}
            </div>
            <div className="vehicle-list" aria-live="polite">
              {filteredVehicles.map((vehicle) => (
                <article className="vehicle-row" key={vehicle.name}>
                  <div>
                    <span className="vehicle-category">{vehicle.category}</span>
                    <span className="vehicle-type">{vehicle.type}</span>
                  </div>
                  <h3>{vehicle.name}</h3>
                  <p>{vehicle.description}</p>
                  <a
                    href="#epikoinonia"
                    onClick={() => select(vehicle.category as LicenceId)}
                    aria-label={`Μαθήματα με ${vehicle.name}`}
                  >
                    <ArrowUpRight size={22} />
                  </a>
                </article>
              ))}
              <p className="fleet-footnote">
                <ShieldCheck size={17} /> Εκπαίδευση με έμφαση στον έλεγχο και
                την ασφάλεια.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="section team-section" id="ekpaideftes">
        <div className="container">
          <div className="section-top">
            <SectionHeading
              label="ΟΙ ΑΝΘΡΩΠΟΙ ΣΟΥ"
              title="Δίπλα σου. Όχι απλώς δίπλα στο τιμόνι."
            >
              Άνθρωποι με υπομονή και αγάπη για τη σωστή οδήγηση.{" "}
              {business.demo &&
                "Η ομάδα παρουσιάζεται ως φανταστικό παράδειγμα."}
            </SectionHeading>
            <span className="section-index">MEET YOUR CO-DRIVERS</span>
          </div>
          <div className="team-photo">
            <Photo
              src={assets.team}
              avif={assets.teamAvif}
              alt={`${business.media.teamAlt}${business.demo ? " — φανταστικά πρόσωπα, εικόνα AI" : ""}`}
            />
            <div>
              <HeartHandshake size={19} /> Καλή χημεία. Καλύτερα μαθήματα.
            </div>
          </div>
          <div className="team-grid">
            {team.map((person, i) => (
              <article key={person.name}>
                <span className="person-number">0{i + 1}</span>
                <div>
                  <p className="card-eyebrow">{person.role}</p>
                  <h3>{person.name}</h3>
                  <span className="person-detail">{person.detail}</span>
                  <p>{person.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
