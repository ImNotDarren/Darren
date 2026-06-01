import { experience } from "@/data/experience";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/reveal/Reveal";

export function Experience() {
  const sorted = [...experience].sort((a, b) => b.start - a.start);
  return (
    <section id="experience" className="mx-auto max-w-4xl px-6 py-28">
      <SectionTitle eyebrow="Experience" title="Where I've worked" />
      <div className="relative border-l pl-8" style={{ borderColor: "var(--c-border)" }}>
        {sorted.map((e, i) => (
          <Reveal key={`${e.org}-${e.role}`} delay={i * 0.06}>
            <div className="relative mb-10">
              <span
                className="absolute -left-[37px] top-1 h-3 w-3 rounded-full"
                style={{ backgroundColor: "var(--c-accent)" }}
              />
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-semibold">{e.role}</h3>
                <span className="text-sm" style={{ color: "var(--c-accent)" }}>
                  {e.period}
                </span>
              </div>
              <p className="text-sm" style={{ color: "var(--c-text-muted)" }}>
                {e.org} · {e.location}
              </p>
              <ul className="mt-2 space-y-1 text-sm" style={{ color: "var(--c-text-muted)" }}>
                {e.points.map((pt) => (
                  <li key={pt}>• {pt}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
