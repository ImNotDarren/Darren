import { useEffect } from "react";
import { applyAccents } from "@/theme/worlds";
import { WorldNav } from "@/components/WorldNav";
import { PortalCTA } from "@/components/ui/PortalCTA";
import { profile } from "@/data/profile";
import { Intro } from "@/components/stages/research/Intro";
import { AboutResearch } from "@/components/stages/research/AboutResearch";
import { Themes } from "@/components/stages/research/Themes";
import { Publications } from "@/components/stages/research/Publications";
import { Projects } from "@/components/stages/research/Projects";
import { ExperienceResearch } from "@/components/stages/research/ExperienceResearch";
import { Skills } from "@/components/stages/research/Skills";

export function ResearchWorld() {
  useEffect(() => {
    applyAccents("research");
  }, []);
  return (
    <>
      <WorldNav current="research" />
      <main>
        <Intro />
        <AboutResearch />
        <Themes />
        <Publications />
        <Projects />
        <ExperienceResearch />
        <Skills />
        <section id="contact" className="mx-auto max-w-5xl px-6 py-32">
          <div className="mb-12 flex flex-wrap gap-4">
            {profile.contacts.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="rounded-full px-5 py-2.5 text-sm font-medium"
                style={{ backgroundColor: "var(--bg-soft)", border: "1px solid var(--line)", color: "var(--ink)" }}
              >
                {c.label} ↗
              </a>
            ))}
          </div>
          <PortalCTA to="music" />
          <footer className="mt-16 text-sm" style={{ color: "var(--ink-muted)" }}>
            © Darren Liu · Built with React, Vite & Framer Motion
          </footer>
        </section>
      </main>
    </>
  );
}
