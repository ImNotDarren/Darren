import { producerCredits } from "@/data/discography";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function Production() {
  return (
    <section id="production" className="mx-auto max-w-4xl px-6 py-32">
      <SectionTitle eyebrow="Production" title="Behind the board" />
      <div className="rounded-3xl p-8" style={{ background: "linear-gradient(120deg, var(--accent-soft), transparent)", border: "1px solid var(--line)" }}>
        <p className="mb-4 text-lg font-medium" style={{ color: "var(--accent)" }}>{producerCredits.label}</p>
        <ul className="space-y-2 text-lg" style={{ color: "var(--ink-muted)" }}>
          {producerCredits.notes.map((n) => <li key={n}>• {n}</li>)}
        </ul>
      </div>
    </section>
  );
}
