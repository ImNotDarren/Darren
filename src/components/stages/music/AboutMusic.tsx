import { SectionTitle } from "@/components/ui/SectionTitle";
import { StatCounter } from "@/components/ui/StatCounter";
import { profile } from "@/data/profile";

export function AboutMusic() {
  return (
    <section id="about" className="mx-auto max-w-4xl px-6 py-32">
      <SectionTitle eyebrow="About" title="Producer & Artist" />
      <p className="text-xl leading-relaxed" style={{ color: "var(--ink-muted)" }}>
        {profile.about.music}
      </p>
      <div className="mt-16 grid grid-cols-3 gap-6">
        {profile.stats.music.map((s) => (
          <StatCounter key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
        ))}
      </div>
    </section>
  );
}
