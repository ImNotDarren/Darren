import { profile } from "@/data/profile";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/reveal/Reveal";

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-4xl px-6 py-28">
      <SectionTitle eyebrow="Contact" title="Let's connect" />
      <Reveal>
        <div className="flex flex-wrap gap-4">
          {profile.contacts.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="rounded-full px-5 py-2.5 text-sm font-medium"
              style={{ backgroundColor: "var(--c-surface)", border: "1px solid var(--c-border)", color: "var(--c-text)" }}
            >
              {c.label} ↗
            </a>
          ))}
        </div>
      </Reveal>
      <footer className="mt-20 text-sm" style={{ color: "var(--c-text-muted)" }}>
        © {profile.name.split(" ")[0]} Liu · Built with React, Vite & three.js
      </footer>
    </section>
  );
}
