export type AgeBand = "under17" | "17" | "18-19" | "20-21" | "22-23" | "24+";
export type FinderAnswers = {
  vehicle: "car" | "moto";
  age: AgeBand;
  existing: "none" | "other" | "a2recent" | "a2two";
  preference: "125" | "35" | "unlimited" | "unsure";
};
export type FinderCategory = "B" | "A1" | "A2" | "A";
/** Indicative minimum-age guidance, never an eligibility decision. No persistence. */
export function recommendLicence(
  answers: FinderAnswers,
  available: readonly string[],
): { category: FinderCategory | null; note: string } {
  const age = {
    under17: 16,
    "17": 17,
    "18-19": 18,
    "20-21": 20,
    "22-23": 22,
    "24+": 24,
  }[answers.age];
  let category: FinderCategory | null = null;
  let note = "";
  if (answers.vehicle === "car") {
    if (age >= 17) category = "B";
    note =
      age < 17
        ? "Η διαδικασία για Β προβλέπεται από τα 17. Μπορείς να ενημερωθείς για τα μελλοντικά σου βήματα."
        : age === 17
          ? "Πριν τα 18 ισχύουν ειδικοί όροι συνοδευόμενης οδήγησης και συναίνεσης κηδεμόνα."
          : "Η κατηγορία Β αφορά επιβατικά αυτοκίνητα. Η εκπαίδευση και τα δικαιολογητικά εξετάζονται μαζί με τη σχολή.";
  } else {
    const canA = age >= 24 || (age >= 22 && answers.existing === "a2two");
    if (age >= 18)
      category =
        answers.preference === "125"
          ? "A1"
          : answers.preference === "35"
            ? age >= 20
              ? "A2"
              : "A1"
            : canA
              ? "A"
              : age >= 20
                ? "A2"
                : "A1";
    note = !category
      ? "Για τις κατηγορίες που παρουσιάζονται εδώ, η μικρότερη ηλικία είναι τα 18 (Α1). Ρώτησε τη σχολή για άλλες δυνατότητες, όπως ΑΜ."
      : category === "A"
        ? "Α: από 24 ετών ή από 22 με κατοχή Α2 επί τουλάχιστον δύο χρόνια."
        : category === "A2"
          ? "Α2: από 20 ετών, έως 35 kW και με επιπλέον περιορισμούς ισχύος/βάρους και προέλευσης."
          : "Α1: από 18 ετών, έως 125 cc και 11 kW, με περιορισμό ισχύος/βάρους.";
    if (
      (answers.preference === "unlimited" && category && category !== "A") ||
      (answers.preference === "35" && category === "A1")
    )
      note +=
        " Η επιθυμητή μεγαλύτερη κατηγορία δεν προκύπτει από την ηλικιακή ομάδα που επέλεξες· εμφανίζεται μια μικρότερη δυνατότητα.";
    if (answers.existing === "a2two" && age < 22)
      note +=
        " Η επιλογή Α2 επί διετία χρειάζεται διευκρίνιση με βάση την ηλικία σου.";
    if (answers.existing === "a2recent" || answers.existing === "a2two")
      note +=
        " Αν ήδη κατέχεις αυτή την κατηγορία, συζήτησε επέκταση ή επανεκπαίδευση.";
  }
  if (category && !available.includes(category))
    return {
      category: null,
      note: "Η ενδεικτική κατηγορία δεν προσφέρεται στον τρέχοντα κατάλογο της σχολής. Ζήτησε προσωπική καθοδήγηση.",
    };
  return { category, note };
}
