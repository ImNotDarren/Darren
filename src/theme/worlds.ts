export type WorldKey = "research" | "music";

export const WORLD_KEYS = ["research", "music"] as const;

export interface World {
  key: WorldKey;
  label: string;
  role: string;
  route: string;
  accent: string;
  accent2: string;
  accentSoft: string;
}

export const WORLDS: Record<WorldKey, World> = {
  research: {
    key: "research",
    label: "Research",
    role: "PhD Researcher",
    route: "/research",
    accent: "#0b4cff",
    accent2: "#3b82f6",
    accentSoft: "rgba(11,76,255,0.10)",
  },
  music: {
    key: "music",
    label: "Music",
    role: "Producer & Artist",
    route: "/music",
    accent: "#ff2d78",
    accent2: "#ff7a18",
    accentSoft: "rgba(255,45,120,0.10)",
  },
};

/** Set per-world accent CSS variables on a target element (defaults to :root). */
export function applyAccents(world: WorldKey, el?: HTMLElement): void {
  const w = WORLDS[world];
  const root = el ?? document.documentElement;
  root.style.setProperty("--accent", w.accent);
  root.style.setProperty("--accent-2", w.accent2);
  root.style.setProperty("--accent-soft", w.accentSoft);
  root.dataset.world = world;
}
