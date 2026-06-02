import { discography, type Release } from "@/data/discography";
import { SectionTitle } from "@/components/ui/SectionTitle";

const FEATURED = ["3am", "Bystander", "Telepath"];

export function Featured() {
  const picks = FEATURED.map((t) => discography.find((r) => r.title === t)).filter(
    (r): r is Release => Boolean(r),
  );
  return (
    <section id="featured" className="mx-auto max-w-6xl px-6 py-32">
      <SectionTitle eyebrow="Featured" title="Recent singles" />
      <div className="grid gap-6 sm:grid-cols-3">
        {picks.map((r) => (
          <a key={r.title} href={r.url} target="_blank" rel="noopener noreferrer" className="group block">
            <div className="overflow-hidden rounded-2xl shadow-md" style={{ border: "1px solid var(--line)" }}>
              <img
                src={r.artworkUrl}
                alt={r.title}
                loading="lazy"
                className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <p className="mt-3 text-lg font-semibold">{r.title}</p>
            <p className="text-sm" style={{ color: "var(--ink-muted)" }}>Single · {r.year}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
