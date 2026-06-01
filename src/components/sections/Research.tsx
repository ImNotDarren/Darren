import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/reveal/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";

const THEMES = [
  { title: "LLM Agents for Health", body: "Multi-agent systems grounded in clinical guidelines for nutrition and symptom management." },
  { title: "Clinical NLP", body: "Evaluating and applying LLMs to clinical concepts from EHR and nursing notes." },
  { title: "Multimodal Nutrition AI", body: "Estimating nutrition directly from food images with multimodal models." },
  { title: "Physiological-Signal ML", body: "Time-series and alarm analytics for real-time critical-care monitoring." },
];

export function Research() {
  return (
    <section id="research" className="mx-auto max-w-6xl px-6 py-28">
      <SectionTitle eyebrow="Research" title="What I work on" />
      <div className="grid gap-6 sm:grid-cols-2">
        {THEMES.map((t, i) => (
          <Reveal key={t.title} delay={i * 0.08}>
            <TiltCard className="h-full">
              <div
                className="h-full rounded-2xl p-6"
                style={{ backgroundColor: "var(--c-surface)", border: "1px solid var(--c-border)" }}
              >
                <h3 className="mb-2 text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                  {t.title}
                </h3>
                <p style={{ color: "var(--c-text-muted)" }}>{t.body}</p>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
