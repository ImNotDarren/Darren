import { profile } from "@/data/profile";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/reveal/Reveal";

export function About() {
  return (
    <section id="about" className="mx-auto max-w-4xl px-6 py-28">
      <SectionTitle eyebrow="About" title="Two worlds, one person" />
      <Reveal>
        <p className="text-lg leading-relaxed" style={{ color: "var(--c-text-muted)" }}>
          {profile.about}
        </p>
      </Reveal>
    </section>
  );
}
