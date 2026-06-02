import { WORLDS, type WorldKey } from "@/theme/worlds";
import { useWipe } from "@/components/WipeTransition";

interface PortalCTAProps {
  to: WorldKey;
}

export function PortalCTA({ to }: PortalCTAProps) {
  const { wipeTo } = useWipe();
  const w = WORLDS[to];
  return (
    <button
      onClick={() => wipeTo(w.route, w.accent)}
      className="group relative w-full overflow-hidden rounded-3xl px-8 py-16 text-left transition-transform hover:scale-[1.01]"
      style={{ background: `linear-gradient(120deg, ${w.accent}, ${w.accent2})`, color: "#fff" }}
    >
      <span className="text-sm font-semibold uppercase tracking-[0.25em] opacity-80">Cross over</span>
      <span className="mt-2 block text-4xl font-bold sm:text-6xl" style={{ fontFamily: "var(--font-display)" }}>
        Enter the {w.label} world →
      </span>
    </button>
  );
}
