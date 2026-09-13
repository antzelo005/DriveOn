import { useState } from "react";
import { ArrowLeft, ArrowRight, ChevronDown, Phone } from "lucide-react";
import { business, contactLinks } from "../data/business";
import { faq, reviews } from "../data/content";
import { SectionHeading, TextLink } from "./Shared";

export function ReviewsFAQ() {
  const [page, setPage] = useState(0);
  return (
    <>
      <section className="section reviews-section" id="axiologiseis">
        <div className="container">
          <div className="section-top">
            <SectionHeading
              label="ΙΣΤΟΡΙΕΣ ΠΟΥ ΜΑΣ ΔΙΝΟΥΝ ΚΙΝΗΤΡΟ"
              title="Ξεκίνησαν όπως κι εσύ."
            />
            <div className="review-score">
              <strong>
                4.9<span>/5</span>
              </strong>
              <div>
                <span className="stars">★★★★★</span>
                <small>180+ ενδεικτικές αξιολογήσεις</small>
              </div>
            </div>
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
              Οι αξιολογήσεις και η βαθμολογία είναι φανταστικές, για τις
              ανάγκες του demo.
            </p>
            <div className="review-controls">
              <span>
                0{page + 1} <span>/ 02</span>
              </span>
              <button
                className="icon-button"
                aria-label="Προηγούμενες αξιολογήσεις"
                disabled={page === 0}
                onClick={() => setPage(0)}
              >
                <ArrowLeft size={19} />
              </button>
              <button
                className="icon-button"
                aria-label="Επόμενες αξιολογήσεις"
                disabled={page === 1}
                onClick={() => setPage(1)}
              >
                <ArrowRight size={19} />
              </button>
            </div>
          </div>
        </div>
      </section>
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
            <TextLink href={contactLinks.phone}>
              <Phone size={17} />
              {business.phone}
            </TextLink>
          </div>
          <div className="faq-list">
            {faq.map(([question, answer], i) => (
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
          </div>
        </div>
      </section>
    </>
  );
}
