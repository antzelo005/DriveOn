import { business } from "../data/business";
import type { LicenceId } from "../data/content";
import { ArrowUpRight } from "lucide-react";

export function OptionalServices({
  select,
}: {
  select: (id: LicenceId, message?: string) => void;
}) {
  const labels = [
    business.features.pickup && "Σημείο παραλαβής κατόπιν συνεννόησης",
    business.features.freeIntro && "Δωρεάν πρώτη γνωριμία",
    business.features.englishLessons && "Μαθήματα στα Αγγλικά",
    ...business.languages
      .filter((language) => language !== "Ελληνικά")
      .map((language) => `Γλώσσα μαθημάτων: ${language}`),
  ].filter(Boolean) as string[];
  const prices = business.prices as {
    title: string;
    description: string;
    price: string;
  }[];
  if (
    !labels.length &&
    !business.theoryResource.enabled &&
    !business.promotion.enabled &&
    !business.features.pricePackages
  )
    return null;
  return (
    <div className="optional-offers" aria-label="Πρόσθετες επιλογές">
      {labels.map((label) => (
        <a
          key={label}
          href="#epikoinonia"
          onClick={() => select("other", `Με ενδιαφέρει: ${label}.`)}
        >
          {label} <ArrowUpRight size={14} />
        </a>
      ))}
      {business.theoryResource.enabled && (
        <a href={business.theoryResource.url} target="_blank" rel="noreferrer">
          {business.theoryResource.title} <ArrowUpRight size={14} />
        </a>
      )}
      {business.promotion.enabled && (
        <a
          href="#epikoinonia"
          onClick={() =>
            select("other", `Με ενδιαφέρει: ${business.promotion.title}.`)
          }
        >
          <strong>{business.promotion.title}</strong> —{" "}
          {business.promotion.description}
        </a>
      )}
      {business.features.pricePackages &&
        prices.map((price) => (
          <a
            href="#epikoinonia"
            key={price.title}
            onClick={() =>
              select("other", `Με ενδιαφέρει το πακέτο ${price.title}.`)
            }
          >
            <strong>
              {price.title} · {price.price}
            </strong>{" "}
            — {price.description}
          </a>
        ))}
    </div>
  );
}
