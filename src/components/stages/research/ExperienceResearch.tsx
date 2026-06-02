import { experience } from "@/data/experience";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function ExperienceResearch() {
  const list = experience.filter((e) => e.world !== "music").sort((a, b) => b.start - a.start);
  return (
    <section id="experience" className="mx-auto max-w-4xl px-6 py-32">
      <SectionTitle eyebrow="Experience" title="Where I've worked" />
      <div className="relative border-l pl-8" style={{ borderColor: "var(--line)" }}>
        {list.map((e) => (
          <div key={`${e.org}-${e.role}`} className="relative mb-10">
            <span className="absolute -left-[37px] top-1 h-3 w-3 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-semibold">{e.role}</h3>
              <span className="text-sm font-medium" style={{ color: "var(--accent)" }}>{e.period}</span>
            </div>
            <p className="text-sm" style={{ color: "var(--ink-muted)" }}>{e.org} · {e.location}</p>
            <ul className="mt-2 space-y-1 text-sm" style={{ color: "var(--ink-muted)" }}>
              {e.points.map((pt) => <li key={pt}>• {pt}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
