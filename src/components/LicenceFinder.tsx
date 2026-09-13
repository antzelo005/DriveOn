import { useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight, RotateCcw, Route } from "lucide-react";
import { business } from "../data/business";
import type { LicenceId } from "../data/content";
import { recommendLicence } from "../lib/licence-finder";
import type { FinderAnswers } from "../lib/licence-finder";
import { track } from "../lib/analytics";

const questions = [
  {
    key: "vehicle",
    title: "Τι θέλεις να οδηγείς;",
    options: [
      ["car", "Αυτοκίνητο"],
      ["moto", "Μοτοσυκλέτα"],
    ],
  },
  {
    key: "age",
    title: "Σε ποια ηλικιακή ομάδα ανήκεις;",
    options: [
      ["under17", "Κάτω από 17"],
      ["17", "17"],
      ["18-19", "18–19"],
      ["20-21", "20–21"],
      ["22-23", "22–23"],
      ["24+", "24 και άνω"],
    ],
  },
  {
    key: "existing",
    title: "Έχεις ήδη δίπλωμα;",
    options: [
      ["none", "Όχι ακόμα"],
      ["other", "Β, Α1 ή άλλη κατηγορία"],
      ["a2recent", "Α2 για λιγότερο από 2 χρόνια"],
      ["a2two", "Α2 για τουλάχιστον 2 χρόνια"],
    ],
  },
  {
    key: "preference",
    title: "Τι μοτοσυκλέτα έχεις στο μυαλό σου;",
    options: [
      ["125", "Έως 125 cc / 11 kW"],
      ["35", "Έως 35 kW"],
      ["unlimited", "Χωρίς όριο ισχύος"],
      ["unsure", "Δεν έχω αποφασίσει"],
    ],
  },
] as const;
const initial: FinderAnswers = {
  vehicle: "car",
  age: "under17",
  existing: "none",
  preference: "unsure",
};
export function LicenceFinder({
  select,
}: {
  select: (id: LicenceId, message?: string) => void;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(initial);
  const title = useRef<HTMLHeadingElement>(null);
  const finished = step === 4;
  const result = recommendLicence(answers, business.enabledLicences);
  const move = (next: number) => {
    setStep(next);
    requestAnimationFrame(() => title.current?.focus({ preventScroll: true }));
  };
  const choose = (value: string) => {
    const nextAnswers = { ...answers, [questions[step].key]: value };
    setAnswers(nextAnswers);
    const next = step === 2 && nextAnswers.vehicle === "car" ? 4 : step + 1;
    if (next === 4)
      track("finder_complete", {
        category:
          recommendLicence(nextAnswers, business.enabledLicences).category ||
          "",
        source: "finder",
      });
    move(next);
  };
  return (
    <div
      className="licence-finder"
      id="finder"
      aria-label="Βρες το δίπλωμά σου"
    >
      <div className="finder-intro">
        <span className="finder-icon">
          <Route size={24} />
        </span>
        <p className="eyebrow">ΜΙΚΡΟΣ ΟΔΗΓΟΣ ΕΠΙΛΟΓΗΣ</p>
        <h3>
          Ποιο δίπλωμα
          <br />
          σου ταιριάζει;
        </h3>
        <p>
          3–4 σύντομες ερωτήσεις.
          <br />
          Χωρίς στοιχεία ή αποθήκευση απαντήσεων.
        </p>
      </div>
      <div className="finder-panel">
        <div className="finder-progress">
          <span>
            {finished
              ? "Η αφετηρία σου"
              : `Βήμα ${step + 1} / ${answers.vehicle === "car" && step > 0 ? 3 : 4}`}
          </span>
          <span>Περίπου 30″</span>
        </div>
        <h4 ref={title} tabIndex={-1}>
          {finished
            ? result.category
              ? `Δες την κατηγορία ${result.category}`
              : "Ας το δούμε μαζί."
            : questions[step].title}
        </h4>
        {finished ? (
          <div className="finder-result">
            <p>{result.note}</p>
            <p className="finder-disclaimer">
              Ενδεικτική κατεύθυνση, όχι έλεγχος δικαιώματος ή νομική συμβουλή.
              Η σχολή επιβεβαιώνει όλες τις προϋποθέσεις και την ισχύουσα
              διαδικασία.
            </p>
            <div className="finder-result-actions">
              <a
                className="button button-yellow"
                href="#epikoinonia"
                onClick={() =>
                  select(
                    result.category || "other",
                    result.category
                      ? `Θα ήθελα πληροφορίες για την κατηγορία ${result.category}, που είδα στον οδηγό επιλογής.`
                      : "Θα ήθελα βοήθεια για την επιλογή κατηγορίας διπλώματος.",
                  )
                }
              >
                Ζήτησε καθοδήγηση <ArrowUpRight size={17} />
              </a>
              {result.category && (
                <a className="text-link" href={`#licence-${result.category}`}>
                  Δες το δίπλωμα <ArrowUpRight size={16} />
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="finder-options">
            {questions[step].options.map(([value, label]) => (
              <button type="button" key={value} onClick={() => choose(value)}>
                {label}
                <ArrowUpRight size={16} />
              </button>
            ))}
          </div>
        )}
        <div className="finder-controls">
          {step > 0 && (
            <button
              type="button"
              onClick={() =>
                move(finished ? (answers.vehicle === "car" ? 2 : 3) : step - 1)
              }
            >
              <ArrowLeft size={15} />
              Πίσω
            </button>
          )}
          {step > 0 && (
            <button
              type="button"
              onClick={() => {
                setAnswers(initial);
                move(0);
              }}
            >
              <RotateCcw size={14} />
              Από την αρχή
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
