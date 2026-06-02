import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { TiltCard } from "@/components/ui/TiltCard";

const THEMES = [
  { title: "LLM Agents for Health", body: "Multi-agent systems grounded in clinical guidelines for nutrition and symptom management." },
  { title: "Clinical NLP", body: "Evaluating and applying LLMs to clinical concepts from EHR and nursing notes." },
  { title: "Multimodal Nutrition AI", body: "Estimating nutrition directly from food images with multimodal models." },
  { title: "Physiological-Signal ML", body: "Time-series and alarm analytics for real-time critical-care monitoring." },
];

export function Themes() {
  return (
    <section id="research" className="mx-auto max-w-6xl px-6 py-32">
      <SectionTitle eyebrow="Research" title="What I work on" />
      <div className="grid gap-6 sm:grid-cols-2">
        {THEMES.map((t, i) => (
          <motion.div
            key={t.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
          >
            <TiltCard className="h-full">
              <div className="h-full rounded-3xl p-8" style={{ backgroundColor: "var(--bg-soft)", border: "1px solid var(--line)" }}>
                <h3 className="mb-2 text-2xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                  {t.title}
                </h3>
                <p style={{ color: "var(--ink-muted)" }}>{t.body}</p>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
