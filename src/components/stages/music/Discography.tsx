import { discography } from "@/data/discography";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { DragTrack } from "@/components/ui/DragTrack";

export function Discography() {
  const sorted = [...discography].sort((a, b) => b.year - a.year);
  return (
    <section id="discography" className="py-32">
      <div className="mx-auto mb-10 max-w-6xl px-6">
        <SectionTitle eyebrow="Discography" title="Released as Darren Liu" />
        <p className="text-sm" style={{ color: "var(--ink-muted)" }}>Drag through the catalog →</p>
      </div>
      <DragTrack className="px-6">
        {sorted.map((r) => (
          <a key={r.title} href={r.url} target="_blank" rel="noopener noreferrer" className="group w-64 shrink-0">
            <div className="relative overflow-hidden rounded-2xl shadow-lg" style={{ border: "1px solid var(--line)" }}>
              <img
                src={r.artworkUrl}
                alt={r.title}
                loading="lazy"
                draggable={false}
                className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {r.upcoming && (
                <span
                  className="absolute left-3 top-3 rounded-full px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.15em]"
                  style={{ background: "var(--accent)", color: "#fff" }}
                >
                  Coming Soon
                </span>
              )}
            </div>
            <p className="mt-3 font-semibold">{r.title}</p>
            <p className="text-xs uppercase tracking-wide" style={{ color: "var(--ink-muted)" }}>
              {r.upcoming ? "Single · July 1, 2026" : `${r.type} · ${r.year}`}
            </p>
          </a>
        ))}
      </DragTrack>
    </section>
  );
}
