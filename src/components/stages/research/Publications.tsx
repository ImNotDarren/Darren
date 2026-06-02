import { useMemo, useState } from "react";
import { publications, type PubType } from "@/data/publications";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StatCounter } from "@/components/ui/StatCounter";

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
    const f = filter === "all" ? publications : publications.filter((p) => p.type === filter);
    return [...f].sort((a, b) => b.year - a.year);
  }, [filter]);

  return (
    <section id="publications" className="mx-auto max-w-5xl px-6 py-32">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <SectionTitle eyebrow="Publications" title="Selected papers" />
        <StatCounter value={publications.length} label="Total" />
      </div>
      <div className="mb-8 flex flex-wrap gap-3">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="rounded-full px-4 py-1.5 text-sm font-medium"
            style={{
              backgroundColor: filter === f.key ? "var(--accent)" : "transparent",
              color: filter === f.key ? "#fff" : "var(--ink-muted)",
              border: "1px solid var(--line)",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>
      <ul className="space-y-4">
        {list.map((p) => (
          <li
            key={p.title}
            className="rounded-2xl p-6 transition-shadow hover:shadow-lg"
            style={{ backgroundColor: "var(--bg-soft)", border: "1px solid var(--line)" }}
          >
            <a href={p.url} target="_blank" rel="noopener noreferrer">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-semibold leading-snug" style={{ color: "var(--ink)" }}>{p.title}</h3>
                <span className="shrink-0 text-sm font-medium" style={{ color: "var(--accent)" }}>{p.date}</span>
              </div>
              <p className="mt-1 text-sm" style={{ color: "var(--ink-muted)" }}>{p.authors}</p>
              <p className="mt-1 text-sm italic" style={{ color: "var(--ink-muted)" }}>{p.venue}</p>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
