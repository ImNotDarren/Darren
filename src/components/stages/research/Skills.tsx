import { profile } from "@/data/profile";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Chip } from "@/components/ui/Chip";

export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-5xl px-6 py-32">
      <SectionTitle eyebrow="Skills" title="Tools of the trade" />
      <div className="grid gap-8 sm:grid-cols-2">
        {profile.skills.map((g) => (
          <div key={g.label}>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--accent)" }}>{g.label}</h3>
            <div className="flex flex-wrap gap-2">{g.items.map((s) => <Chip key={s} label={s} />)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
