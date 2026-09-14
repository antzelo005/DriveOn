import { ContactActionLink } from "../components/ContactActions";
import { useEffect, useRef, useState } from "react";
import { usePhoneLayout } from "../lib/use-phone-layout";
import { ArrowLeft, ArrowRight, ChevronDown, Phone } from "lucide-react";
import { business } from "../data/business";
import { faq, reviews } from "../data/content";
import { SectionHeading } from "./Shared";

export function ReviewsFAQ() {
  const [page, setPage] = useState(0);
  const [moreFaq, setMoreFaq] = useState(false);
  const pages = Math.ceil(reviews.length / 3);
  const mobile = usePhoneLayout();
  const rail = useRef<HTMLDivElement>(null);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [previousLayout, setPreviousLayout] = useState(mobile);
  if (previousLayout !== mobile) {
    setPreviousLayout(mobile);
    setReviewIndex(0);
  }
  useEffect(() => {
    rail.current?.scrollTo({ left: 0, behavior: "instant" });
  }, [mobile]);
  const moveReview = (direction: number) => {
    if (!mobile) {
      setPage(page + direction);
      return;
    }
    const target = rail.current?.children[reviewIndex + direction] as
      HTMLElement | undefined;
    if (target && rail.current)
      rail.current.scrollTo({
        left:
          target.offsetLeft -
          (rail.current.children[0] as HTMLElement).offsetLeft,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
  };
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
            <div
              className="reviews-grid"
              ref={rail}
              role="region"
              aria-label="Αξιολογήσεις μαθητών"
              tabIndex={mobile ? 0 : undefined}
              aria-live={mobile ? "off" : "polite"}
              aria-atomic="true"
              onScroll={(e) => {
                if (!mobile) return;
                const el = e.currentTarget;
                const distance =
                  (el.children[1] as HTMLElement)?.offsetLeft -
                  (el.children[0] as HTMLElement)?.offsetLeft;
                if (distance > 0)
                  setReviewIndex(
                    Math.min(
                      reviews.length - 1,
                      Math.max(0, Math.round(el.scrollLeft / distance)),
                    ),
                  );
              }}
            >
              {(mobile ? reviews : reviews.slice(page * 3, page * 3 + 3)).map(
                (review) => (
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
                ),
              )}
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
                <span aria-live="polite" aria-atomic="true">
                  {mobile ? reviewIndex + 1 : `0${page + 1}`}{" "}
                  <span>
                    / {mobile ? reviews.length : String(pages).padStart(2, "0")}
                  </span>
                </span>
                <button
                  className="icon-button"
                  aria-label="Προηγούμενες αξιολογήσεις"
                  disabled={mobile ? reviewIndex === 0 : page === 0}
                  onClick={() => moveReview(-1)}
                >
                  <ArrowLeft size={19} />
                </button>
                <button
                  className="icon-button"
                  aria-label="Επόμενες αξιολογήσεις"
                  disabled={
                    mobile
                      ? reviewIndex >= reviews.length - 1
                      : page >= pages - 1
                  }
                  onClick={() => moveReview(1)}
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
