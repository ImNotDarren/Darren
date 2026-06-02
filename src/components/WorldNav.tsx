import { Link } from "react-router-dom";
import { WORLDS, WORLD_KEYS, type WorldKey } from "@/theme/worlds";
import { useWipe } from "@/components/WipeTransition";

export function WorldNav({ current }: { current: WorldKey }) {
  const { wipeTo } = useWipe();
  return (
    <nav className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
          DL
        </Link>
        <div
          className="flex items-center gap-1 rounded-full p-1"
          style={{ border: "1px solid var(--line)", background: "rgba(255,255,255,0.6)", backdropFilter: "blur(8px)" }}
        >
          {WORLD_KEYS.map((k) => {
            const w = WORLDS[k as WorldKey];
            const isActive = k === current;
            return (
              <button
                key={k}
                onClick={() => !isActive && wipeTo(w.route, w.accent)}
                className="rounded-full px-4 py-1.5 text-sm font-semibold transition-colors"
                style={{ backgroundColor: isActive ? "var(--accent)" : "transparent", color: isActive ? "#fff" : "var(--ink-muted)" }}
                aria-current={isActive ? "page" : undefined}
              >
                {w.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
