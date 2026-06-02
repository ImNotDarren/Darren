import { projects } from "@/data/projects";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { DragTrack } from "@/components/ui/DragTrack";
import { TiltCard } from "@/components/ui/TiltCard";
import { Chip } from "@/components/ui/Chip";

export function Projects() {
  return (
    <section id="projects" className="py-32">
      <div className="mx-auto mb-10 max-w-6xl px-6">
        <SectionTitle eyebrow="Projects" title="Things I've built" />
        <p className="text-sm" style={{ color: "var(--ink-muted)" }}>Drag to explore →</p>
      </div>
      <DragTrack className="px-6">
        {projects.map((p) => (
          <TiltCard key={p.name} className="w-80 shrink-0">
            <div className="flex h-full flex-col rounded-3xl p-7" style={{ backgroundColor: "var(--bg-soft)", border: "1px solid var(--line)" }}>
              <div className="mb-2 flex items-baseline justify-between">
                <h3 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>{p.name}</h3>
                {p.url && (
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-sm" style={{ color: "var(--accent)" }}>
                    Visit ↗
                  </a>
                )}
              </div>
              <p className="mb-2 text-sm font-medium" style={{ color: "var(--accent)" }}>{p.tagline}</p>
              <p className="mb-4 flex-1 text-sm" style={{ color: "var(--ink-muted)" }}>{p.description}</p>
              <div className="flex flex-wrap gap-2">{p.tags.map((t) => <Chip key={t} label={t} />)}</div>
              {p.repo && (
                <a href={p.repo} target="_blank" rel="noopener noreferrer" className="mt-3 text-sm" style={{ color: "var(--accent)" }}>
                  GitHub ↗
                </a>
              )}
            </div>
          </TiltCard>
        ))}
      </DragTrack>
    </section>
  );
}
