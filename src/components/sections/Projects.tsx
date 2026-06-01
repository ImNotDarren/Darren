import { projects } from "@/data/projects";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/reveal/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { Chip } from "@/components/ui/Chip";

export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-28">
      <SectionTitle eyebrow="Projects" title="Things I've built" />
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.06}>
            <TiltCard className="h-full">
              <div
                className="flex h-full flex-col rounded-2xl p-6"
                style={{ backgroundColor: "var(--c-surface)", border: "1px solid var(--c-border)" }}
              >
                <div className="mb-2 flex items-baseline justify-between">
                  <h3 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                    {p.name}
                  </h3>
                  {p.url && (
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-sm" style={{ color: "var(--c-accent)" }}>
                      Visit ↗
                    </a>
                  )}
                </div>
                <p className="mb-2 text-sm font-medium" style={{ color: "var(--c-accent)" }}>
                  {p.tagline}
                </p>
                <p className="mb-4 flex-1 text-sm" style={{ color: "var(--c-text-muted)" }}>
                  {p.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <Chip key={t} label={t} />
                  ))}
                </div>
                {p.repo && (
                  <a href={p.repo} target="_blank" rel="noopener noreferrer" className="mt-3 text-sm" style={{ color: "var(--c-accent)" }}>
                    GitHub ↗
                  </a>
                )}
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
