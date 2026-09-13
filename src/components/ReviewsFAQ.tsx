import { ContactActionLink } from "../components/ContactActions";
import { useState } from "react";
import { ArrowLeft, ArrowRight, ChevronDown, Phone } from "lucide-react";
import { business } from "../data/business";
import { faq, reviews } from "../data/content";
import { SectionHeading } from "./Shared";

export function ReviewsFAQ() {
  const [page, setPage] = useState(0);
  const [moreFaq, setMoreFaq] = useState(false);
  const pages = Math.ceil(reviews.length / 3);
  return (
    <>
      {reviews.length > 0 && (
        <section className="section reviews-section" id="axiologiseis">
          <div className="container">
            <div className="section-top">
              <SectionHeading
                label="ΙΣΤΟΡΙΕΣ ΠΟΥ ΜΑΣ ΔΙΝΟΥΝ ΚΙΝΗΤΡΟ"
                title="Ξεκίνησαν όπως κι εσύ."
              />
              {(business.demo || business.rating.verified) && (
                <div className="review-score">
                  <strong>
                    {business.rating.score}
                    <span>/5</span>
                  </strong>
                  <div>
                    <span className="stars">★★★★★</span>
                    <small>
                      {business.rating.count}{" "}
                      {business.demo
                        ? "ενδεικτικές αξιολογήσεις"
                        : "αξιολογήσεις"}
                    </small>
                  </div>
                </div>
              )}
            </div>
            <div className="reviews-grid" aria-live="polite" aria-atomic="true">
              {reviews.slice(page * 3, page * 3 + 3).map((review) => (
                <figure className="review-card" key={review.name}>
                  <span className="stars" aria-label="5 από 5 αστέρια">
                    ★★★★★
                  </span>
                  <blockquote>«{review.text}»</blockquote>
                  <figcaption>
                    <span className="review-avatar">{review.initials}</span>
                    <div>
                      <strong>{review.name}</strong>
                      <small>{review.category}</small>
                    </div>
                    <span className="review-quote" aria-hidden="true">
                      ”
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
            <div className="reviews-bottom">
              <p>
                {business.demo
                  ? "Οι αξιολογήσεις και η βαθμολογία είναι φανταστικές, για τις ανάγκες του demo."
                  : "Εμπειρίες μαθητών, δημοσιευμένες με την άδειά τους."}
                {!business.demo && business.rating.reviewsUrl && (
                  <a
                    className="text-link"
                    href={business.rating.reviewsUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Αξιολογήσεις στο Google ↗
                  </a>
                )}
              </p>
              <div className="review-controls">
                <span>
                  0{page + 1} <span>/ {String(pages).padStart(2, "0")}</span>
                </span>
                <button
                  className="icon-button"
                  aria-label="Προηγούμενες αξιολογήσεις"
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                >
                  <ArrowLeft size={19} />
                </button>
                <button
                  className="icon-button"
                  aria-label="Επόμενες αξιολογήσεις"
                  disabled={page >= pages - 1}
                  onClick={() => setPage(page + 1)}
                >
                  <ArrowRight size={19} />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
      <section className="section faq-section" id="faq">
        <div className="container faq-layout">
          <div>
            <SectionHeading
              label="ΚΑΛΕΣ ΕΡΩΤΗΣΕΙΣ. ΚΑΘΑΡΕΣ ΑΠΑΝΤΗΣΕΙΣ."
              title={
                <>
                  Το σκέφτεσαι;
                  <br />
                  Λύνουμε τις απορίες σου.
                </>
              }
            />
            <p className="faq-intro">
              Κι αν η δική σου ερώτηση δεν είναι εδώ,
              <br />
              είμαστε ένα τηλεφώνημα μακριά.
            </p>
            <ContactActionLink className="text-link" action="phone">
              <Phone size={17} />
              {business.phone}
            </ContactActionLink>
          </div>
          <div className="faq-list">
            {faq
              .slice(0, moreFaq ? undefined : 5)
              .map(([question, answer], i) => (
                <details key={question} name="faq">
                  <summary>
                    <span className="faq-number">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{question}</span>
                    <ChevronDown size={19} />
                  </summary>
                  <p>{answer}</p>
                </details>
              ))}
            {faq.length > 5 && (
              <button
                className="faq-more text-link"
                type="button"
                aria-expanded={moreFaq}
                onClick={() => setMoreFaq(!moreFaq)}
              >
                {moreFaq ? "Λιγότερες ερωτήσεις" : "Περισσότερες ερωτήσεις"}
                <ChevronDown size={17} />
              </button>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
