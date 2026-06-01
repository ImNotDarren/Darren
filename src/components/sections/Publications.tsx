import { useMemo, useState } from "react";
import { publications, type PubType } from "@/data/publications";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/reveal/Reveal";

type Filter = "all" | PubType;
const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "journal", label: "Journal" },
  { key: "conference", label: "Conference" },
  { key: "preprint", label: "Preprint" },
];

export function Publications() {
  const [filter, setFilter] = useState<Filter>("all");
  const list = useMemo(() => {
    const filtered =
      filter === "all" ? publications : publications.filter((p) => p.type === filter);
    return [...filtered].sort((a, b) => b.year - a.year);
  }, [filter]);

  return (
    <section id="publications" className="mx-auto max-w-5xl px-6 py-28">
      <SectionTitle eyebrow="Publications" title="Selected papers" />
      <div className="mb-8 flex flex-wrap gap-3">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="rounded-full px-4 py-1.5 text-sm"
            style={{
              backgroundColor: filter === f.key ? "var(--c-accent)" : "transparent",
              color: filter === f.key ? "var(--c-bg)" : "var(--c-text-muted)",
              border: "1px solid var(--c-border)",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>
      <ul className="space-y-4">
        {list.map((p, i) => (
          <Reveal key={p.title} delay={Math.min(i * 0.04, 0.3)}>
            <li
              className="rounded-xl p-5"
              style={{ backgroundColor: "var(--c-surface)", border: "1px solid var(--c-border)" }}
            >
              <a href={p.url} target="_blank" rel="noopener noreferrer">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-semibold leading-snug" style={{ color: "var(--c-text)" }}>
                    {p.title}
                  </h3>
                  <span className="shrink-0 text-sm" style={{ color: "var(--c-accent)" }}>
                    {p.date}
                  </span>
                </div>
                <p className="mt-1 text-sm" style={{ color: "var(--c-text-muted)" }}>
                  {p.authors}
                </p>
                <p className="mt-1 text-sm italic" style={{ color: "var(--c-text-muted)" }}>
                  {p.venue}
                </p>
              </a>
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
