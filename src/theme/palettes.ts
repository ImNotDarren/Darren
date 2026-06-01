export type Identity = "researcher" | "musician";

export const PALETTE_KEYS = [
  "bg",
  "bg-elev",
  "surface",
  "text",
  "text-muted",
  "accent",
  "accent-2",
  "accent-soft",
  "border",
  "glow",
] as const;

export type PaletteKey = (typeof PALETTE_KEYS)[number];
export type Palette = Record<PaletteKey, string>;

export const PALETTES: Record<Identity, Palette> = {
  researcher: {
    bg: "#070b16",
    "bg-elev": "#0d1326",
    surface: "rgba(255,255,255,0.04)",
    text: "#e8edff",
    "text-muted": "#9aa7c7",
    accent: "#46e0ff",
    "accent-2": "#8a7bff",
    "accent-soft": "rgba(70,224,255,0.14)",
    border: "rgba(138,123,255,0.22)",
    glow: "rgba(70,224,255,0.35)",
  },
  musician: {
    bg: "#120710",
    "bg-elev": "#1d0c1a",
    surface: "rgba(255,255,255,0.05)",
    text: "#ffeaf6",
    "text-muted": "#d3a7c2",
    accent: "#ff3fae",
    "accent-2": "#ffb648",
    "accent-soft": "rgba(255,63,174,0.16)",
    border: "rgba(255,182,72,0.24)",
    glow: "rgba(255,63,174,0.4)",
  },
};

/** Apply a palette by writing CSS custom properties on :root. */
export function applyPalette(identity: Identity): void {
  const palette = PALETTES[identity];
  const root = document.documentElement;
  for (const key of PALETTE_KEYS) {
    root.style.setProperty(`--c-${key}`, palette[key]);
  }
  root.dataset.identity = identity;
}
