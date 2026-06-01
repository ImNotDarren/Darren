import { useState } from "react";
import { useIdentity } from "@/theme/IdentityContext";

const LINKS = [
  { id: "about", label: "About" },
  { id: "research", label: "Research" },
  { id: "publications", label: "Publications" },
  { id: "projects", label: "Projects" },
  { id: "music", label: "Music" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export function Nav() {
  const { identity, toggle } = useIdentity();
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="fixed inset-x-0 top-0 z-50 backdrop-blur-md"
      style={{ backgroundColor: "color-mix(in srgb, var(--c-bg) 70%, transparent)", borderBottom: "1px solid var(--c-border)" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#home" className="font-bold" style={{ fontFamily: "var(--font-display)" }}>
          DL
        </a>
        <div className="hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className="text-sm"
              style={{ color: "var(--c-text-muted)" }}
            >
              {l.label}
            </a>
          ))}
        </div>
        <button
          onClick={toggle}
          className="rounded-full px-4 py-2 text-xs font-semibold"
          style={{ border: "1px solid var(--c-border)", color: "var(--c-text)" }}
          aria-label={`Switch to ${identity === "researcher" ? "musician" : "researcher"} mode`}
        >
          {identity === "researcher" ? "◐ Researcher" : "◑ Musician"}
        </button>
        <button
          className="md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          style={{ color: "var(--c-text)" }}
        >
          ☰
        </button>
      </div>
      {open && (
        <div className="flex flex-col gap-3 px-6 pb-4 md:hidden">
          {LINKS.map((l) => (
            <a key={l.id} href={`#${l.id}`} onClick={() => setOpen(false)} style={{ color: "var(--c-text-muted)" }}>
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
