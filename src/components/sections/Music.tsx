import { discography, producerCredits } from "@/data/discography";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/reveal/Reveal";

function initials(title: string): string {
  return title.replace(/\(.*?\)/g, "").trim().slice(0, 2).toUpperCase();
}

export function Music() {
  const sorted = [...discography].sort((a, b) => b.year - a.year);
  return (
    <section id="music" className="mx-auto max-w-6xl px-6 py-28">
      <SectionTitle eyebrow="Music" title="Released as Darren Liu" />
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {sorted.map((r, i) => (
          <Reveal key={r.title} delay={Math.min(i * 0.05, 0.4)}>
            <a href={r.url} target="_blank" rel="noopener noreferrer" className="group block">
              <div
                className="relative aspect-square overflow-hidden rounded-xl"
                style={{ border: "1px solid var(--c-border)" }}
              >
                {r.artworkUrl ? (
                  <img
                    src={r.artworkUrl}
                    alt={r.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center text-2xl font-bold"
                    style={{
                      background: "linear-gradient(135deg, var(--c-accent), var(--c-accent-2))",
                      color: "var(--c-bg)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {initials(r.title)}
                  </div>
                )}
              </div>
              <p className="mt-2 text-sm font-semibold">{r.title}</p>
              <p className="text-xs uppercase tracking-wide" style={{ color: "var(--c-text-muted)" }}>
                {r.type} · {r.year}
              </p>
            </a>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div
          className="mt-12 rounded-2xl p-6"
          style={{ backgroundColor: "var(--c-surface)", border: "1px solid var(--c-border)" }}
        >
          <h3 className="mb-2 text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>
            Production
          </h3>
          <p className="mb-3 text-sm" style={{ color: "var(--c-accent)" }}>
            {producerCredits.label}
          </p>
          <ul className="space-y-1 text-sm" style={{ color: "var(--c-text-muted)" }}>
            {producerCredits.notes.map((n) => (
              <li key={n}>• {n}</li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
