# Personal Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a comprehensive dual-identity (Researcher ⇄ Musician) single-page personal website for Darren Liu using Vite + React + TS, deployed to Firebase Hosting (`darren-40535`).

**Architecture:** Single-page React app. A global `IdentityContext` toggles between `researcher` and `musician`, swapping CSS custom-property palette values that re-theme the whole site via Tailwind v4 CSS variables. Content sections read from typed `data/*.ts` modules so content never mixes with view logic. A lazy-loaded three.js (`@react-three/fiber`) particle hero morphs between a node-mesh and a waveform; it degrades to a CSS gradient under `prefers-reduced-motion` or no WebGL.

**Tech Stack:** Vite 8, React 19, TypeScript 6 (strict), Tailwind CSS v4 (`@tailwindcss/vite`), Framer Motion 12, three 0.184 + `@react-three/fiber` 9 + `@react-three/drei` 10, Vitest 4 (data-module tests), Firebase Hosting.

---

## File Structure

```
package.json, vite.config.ts, tsconfig.json, tsconfig.node.json, index.html
firebase.json, .firebaserc, .gitignore
src/
  main.tsx                      # entry, mounts <App/> in IdentityProvider
  App.tsx                       # nav + section composition + scroll progress
  vite-env.d.ts
  styles/index.css              # Tailwind import + CSS vars + base
  theme/
    IdentityContext.tsx         # identity state/provider/hook
    palettes.ts                 # per-identity CSS-var maps + applyPalette()
  lib/
    useReducedMotion.ts         # reduced-motion + WebGL capability hooks
  data/
    profile.ts                  # name, taglines, contact, skills groups
    publications.ts             # 11 publication records
    projects.ts                 # project cards
    discography.ts              # albums + singles
    experience.ts               # timeline entries
  components/
    Nav.tsx                     # sticky nav, identity toggle, anchor links, mobile menu
    ScrollProgress.tsx          # top scroll-progress bar
    CursorGlow.tsx              # desktop cursor glow
    Hero.tsx                    # hero text + CTAs, wraps HeroCanvas (lazy)
    HeroCanvas.tsx              # three.js particle field (lazy chunk)
    reveal/Reveal.tsx           # scroll-reveal wrapper
    ui/
      SectionTitle.tsx
      MagneticButton.tsx
      TiltCard.tsx
      Chip.tsx
    sections/
      About.tsx
      Research.tsx
      Publications.tsx
      Projects.tsx
      Music.tsx
      Experience.tsx
      Skills.tsx
      Contact.tsx
tests/
  data.test.ts                  # validates data-module integrity
  palettes.test.ts              # validates palette completeness
scripts/
  fetch-artwork.mjs             # one-shot: resolve Apple Music artwork URLs via iTunes API
```

---

## Task 1: Scaffold Vite + React + TS project

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `index.html`, `.gitignore`, `src/main.tsx`, `src/App.tsx`, `src/vite-env.d.ts`, `src/styles/index.css`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "darren-liu-website",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "typecheck": "tsc -b --noEmit"
  },
  "dependencies": {
    "react": "19.2.7",
    "react-dom": "19.2.7",
    "framer-motion": "12.40.0",
    "three": "0.184.0",
    "@react-three/fiber": "9.6.1",
    "@react-three/drei": "10.7.7"
  },
  "devDependencies": {
    "vite": "8.0.16",
    "@vitejs/plugin-react": "6.0.2",
    "typescript": "6.0.3",
    "@types/react": "19.2.16",
    "@types/react-dom": "19.2.3",
    "@types/three": "0.184.1",
    "tailwindcss": "4.3.0",
    "@tailwindcss/vite": "4.3.0",
    "vitest": "4.1.8"
  }
}
```

- [ ] **Step 2: Create `vite.config.ts`**

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  build: {
    target: "es2022",
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three", "@react-three/fiber", "@react-three/drei"],
        },
      },
    },
  },
});
```

- [ ] **Step 3: Create `tsconfig.json` and `tsconfig.node.json`**

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] },
    "types": ["vitest/globals"]
  },
  "include": ["src", "tests"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

`tsconfig.node.json`:
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noEmit": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 4: Create `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Darren (Sizuo) Liu — Researcher & Producer</title>
    <meta name="description" content="Darren Liu: PhD researcher in Biomedical Informatics at Emory, and music producer. Research, publications, projects, and music." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Create `.gitignore`, `src/vite-env.d.ts`, placeholder `src/styles/index.css`, `src/main.tsx`, `src/App.tsx`**

`.gitignore`:
```
node_modules
dist
.firebase
*.log
.DS_Store
.env*
```

`src/vite-env.d.ts`:
```ts
/// <reference types="vite/client" />
```

`src/styles/index.css` (placeholder, finalized in Task 3):
```css
@import "tailwindcss";
```

`src/main.tsx`:
```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App";
import "@/styles/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

`src/App.tsx` (placeholder, replaced in Task 11):
```tsx
export default function App() {
  return <main>Bootstrapping…</main>;
}
```

- [ ] **Step 6: Install deps and verify build**

Run: `npm install && npm run build`
Expected: install succeeds, `dist/` is produced with no TS errors.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite + React + TS + Tailwind v4 project"
```

---

## Task 2: Vitest setup + data-integrity test harness

**Files:**
- Modify: `vite.config.ts` (add `test` config)
- Create: `tests/data.test.ts` (will fail until data modules exist — fleave as scaffold importing nothing yet)

- [ ] **Step 1: Add Vitest config to `vite.config.ts`**

Add this property to the `defineConfig` object (alongside `plugins`):
```ts
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
```

- [ ] **Step 2: Create a trivial passing test `tests/data.test.ts`**

```ts
import { describe, it, expect } from "vitest";

describe("harness", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 3: Run tests to verify harness**

Run: `npm test`
Expected: PASS (1 test).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "test: add vitest harness"
```

---

## Task 3: Theme — palettes, IdentityContext, base CSS

**Files:**
- Create: `src/theme/palettes.ts`, `src/theme/IdentityContext.tsx`, `tests/palettes.test.ts`
- Modify: `src/styles/index.css`

- [ ] **Step 1: Write failing test `tests/palettes.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { PALETTES, PALETTE_KEYS, type Identity } from "@/theme/palettes";

describe("palettes", () => {
  it("defines both identities", () => {
    const ids: Identity[] = ["researcher", "musician"];
    for (const id of ids) expect(PALETTES[id]).toBeDefined();
  });

  it("every identity defines every palette key", () => {
    for (const id of Object.keys(PALETTES) as Identity[]) {
      for (const key of PALETTE_KEYS) {
        expect(PALETTES[id][key], `${id}.${key}`).toMatch(/.+/);
      }
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/palettes.test.ts`
Expected: FAIL (cannot resolve `@/theme/palettes`).

- [ ] **Step 3: Create `src/theme/palettes.ts`**

```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/palettes.test.ts`
Expected: PASS.

- [ ] **Step 5: Create `src/theme/IdentityContext.tsx`**

```tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { applyPalette, type Identity } from "@/theme/palettes";

interface IdentityContextValue {
  identity: Identity;
  setIdentity: (id: Identity) => void;
  toggle: () => void;
}

const IdentityCtx = createContext<IdentityContextValue | null>(null);

export function IdentityProvider({ children }: { children: ReactNode }) {
  const [identity, setIdentityState] = useState<Identity>("researcher");

  const setIdentity = useCallback((id: Identity) => {
    setIdentityState(id);
    applyPalette(id);
  }, []);

  const toggle = useCallback(() => {
    setIdentityState((prev) => {
      const next: Identity = prev === "researcher" ? "musician" : "researcher";
      applyPalette(next);
      return next;
    });
  }, []);

  useEffect(() => {
    applyPalette(identity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({ identity, setIdentity, toggle }),
    [identity, setIdentity, toggle],
  );

  return <IdentityCtx.Provider value={value}>{children}</IdentityCtx.Provider>;
}

export function useIdentity(): IdentityContextValue {
  const ctx = useContext(IdentityCtx);
  if (!ctx) throw new Error("useIdentity must be used within IdentityProvider");
  return ctx;
}
```

- [ ] **Step 6: Finalize `src/styles/index.css`**

```css
@import "tailwindcss";

:root {
  --c-bg: #070b16;
  --c-bg-elev: #0d1326;
  --c-surface: rgba(255, 255, 255, 0.04);
  --c-text: #e8edff;
  --c-text-muted: #9aa7c7;
  --c-accent: #46e0ff;
  --c-accent-2: #8a7bff;
  --c-accent-soft: rgba(70, 224, 255, 0.14);
  --c-border: rgba(138, 123, 255, 0.22);
  --c-glow: rgba(70, 224, 255, 0.35);
}

@theme inline {
  --color-bg: var(--c-bg);
  --color-bg-elev: var(--c-bg-elev);
  --color-surface: var(--c-surface);
  --color-text: var(--c-text);
  --color-text-muted: var(--c-text-muted);
  --color-accent: var(--c-accent);
  --color-accent-2: var(--c-accent-2);
  --color-border: var(--c-border);
  --font-display: "Space Grotesk", system-ui, sans-serif;
  --font-body: "Inter", system-ui, sans-serif;
}

* {
  /* smooth palette morph */
  transition:
    background-color 0.6s ease,
    border-color 0.6s ease,
    color 0.6s ease;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background-color: var(--c-bg);
  color: var(--c-text);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  * {
    transition: none !important;
    animation: none !important;
  }
}
```

- [ ] **Step 7: Run all tests + typecheck**

Run: `npm test && npm run typecheck`
Expected: PASS, no type errors.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add identity theme system (palettes + context + base css)"
```

---

## Task 4: Reduced-motion + WebGL capability hooks

**Files:**
- Create: `src/lib/useReducedMotion.ts`

- [ ] **Step 1: Create `src/lib/useReducedMotion.ts`**

```ts
import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

export function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")),
    );
  } catch {
    return false;
  }
}

export function useCoarsePointer(): boolean {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    setCoarse(mq.matches);
    const handler = (e: MediaQueryListEvent) => setCoarse(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return coarse;
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add reduced-motion, webgl, and pointer capability hooks"
```

---

## Task 5: Data modules + integrity tests

**Files:**
- Create: `src/data/profile.ts`, `src/data/publications.ts`, `src/data/projects.ts`, `src/data/discography.ts`, `src/data/experience.ts`
- Modify: `tests/data.test.ts`

- [ ] **Step 1: Create `src/data/profile.ts`**

```ts
export interface SkillGroup {
  label: string;
  items: string[];
}

export interface ContactLink {
  label: string;
  href: string;
}

export const profile = {
  name: "Darren (Sizuo) Liu",
  location: "Atlanta, GA",
  taglines: {
    researcher: "PhD researcher in Biomedical Informatics, building AI for health.",
    musician: "Singer-songwriter & music producer.",
    blended: "Biomedical Informatics PhD researcher & music producer.",
  },
  about:
    "I am a PhD student in Computer Science and Informatics at Emory University on the Biomedical Informatics track, where I build LLM agents and machine-learning systems for healthcare and nutrition. Outside the lab I write, record, and produce music, and have released several albums as Darren Liu. I move between data and sound, and I like building things that reach real people in both worlds.",
  contacts: [
    { label: "Email", href: "mailto:darren.liu@emory.edu" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/darren-sizuo-liu/" },
    { label: "GitHub", href: "https://github.com/ImNotDarren" },
    { label: "Google Scholar", href: "https://scholar.google.com/citations?user=0pURGncAAAAJ&hl=en" },
    { label: "Apple Music", href: "https://music.apple.com/us/artist/darren-liu/1581649003" },
  ] as ContactLink[],
  skills: [
    { label: "Languages", items: ["Python", "JavaScript", "TypeScript", "SQL", "R", "Java", "C", "C++", "HTML", "CSS"] },
    { label: "Web & Mobile", items: ["React", "React Native", "Node.js", "Express.js", "Spring Boot", "Flask", "MySQL", "SQLite", "MongoDB"] },
    { label: "ML & Data", items: ["PyTorch", "TensorFlow", "scikit-learn", "Pandas", "NumPy", "Hugging Face", "LLM Agents", "Reinforcement Learning"] },
    { label: "Tools & Infra", items: ["Git", "Docker", "Kafka", "REST APIs", "Firebase", "AWS", "Azure"] },
  ] as SkillGroup[],
} as const;
```

- [ ] **Step 2: Create `src/data/publications.ts`**

```ts
export type PubType = "journal" | "conference" | "preprint";

export interface Publication {
  title: string;
  authors: string;
  venue: string;
  year: number;
  date: string;
  type: PubType;
  url: string;
}

export const publications: Publication[] = [
  {
    title:
      "NutriOrion: A Hierarchical Multi-Agent Framework for Personalized Nutrition Intervention Grounded in Clinical Guidelines",
    authors: "Wu J, Yan R, Luo H, Liu D, Wang M, Townsend K, Hartwig L, Milketinas D, Hu X, Yang C",
    venue: "In Review (arXiv)",
    year: 2026,
    date: "Feb 2026",
    type: "preprint",
    url: "https://arxiv.org/pdf/2602.18650",
  },
  {
    title:
      "DietAI24 As A Framework for Comprehensive Nutrition Estimation Using Multimodal Large Language Models",
    authors: "Yan R, Luo H, Lu J, Liu D, Posluszny H, Dhaliwal M, MacLeod J, Qin Y, Yang C, Hartman T, Hu X",
    venue: "Nature Communications Medicine",
    year: 2025,
    date: "Nov 2025",
    type: "journal",
    url: "https://www.nature.com/articles/s43856-025-01159-0",
  },
  {
    title:
      "Leveraging Artificial Intelligence for Digital Symptom Management in Oncology: The Development of CRCWeb",
    authors: "Liu D, Lin Y, Yan R, Wang Z, Bold D, Hu X",
    venue: "JMIR Cancer",
    year: 2025,
    date: "Jul 2025",
    type: "journal",
    url: "https://cancer.jmir.org/2025/1/e68516",
  },
  {
    title:
      "Prediction of cardiac arrest in the pediatric cardiac intensive care unit: A time-series machine learning approach",
    authors: "Lu J, Brown S, Wu Y, Dong K, Bold D, Liu D, Grunwell J, Hu X",
    venue: "Journal of Critical Care (ScienceDirect)",
    year: 2025,
    date: "Apr 2025",
    type: "journal",
    url: "https://www.sciencedirect.com/science/article/abs/pii/S0883944124004453",
  },
  {
    title:
      "Evaluation of Large Language Models in Tailoring Educational Content for Cancer Survivors and Their Caregivers: Quality Analysis",
    authors: "Liu D, Hu X, Xiao C, Bai J, Lee S, ..., Lin Y",
    venue: "JMIR Cancer",
    year: 2025,
    date: "Feb 2025",
    type: "journal",
    url: "https://cancer.jmir.org/2025/1/e67914",
  },
  {
    title:
      "1444: Using Machine Learning to Predict Cardiac Arrest in the Pediatric Cardiac Intensive Care Unit",
    authors: "Brown S, Grunwell J, Wu Y, Dong K, Bold D, Liu D, Fundora M, Hu X, Lu J",
    venue: "Critical Care Medicine",
    year: 2025,
    date: "Jan 2025",
    type: "journal",
    url: "https://journals.lww.com/ccmjournal/",
  },
  {
    title:
      "Perceptions and Needs for A Technology-Based Dyadic Intervention on Symptom Management Among Patients with Colorectal Cancer and Their Caregivers: A Qualitative Study",
    authors: "Epari A, Kim K, Xiao C, Porter LS, Alese OB, Northouse L, Liu D, Bold D, Graetz I, Lin Y",
    venue: "Cancer Nursing",
    year: 2024,
    date: "Sep 2024",
    type: "journal",
    url: "https://journals.lww.com/cancernursingonline/",
  },
  {
    title:
      "Evaluation of General Large Language Models in Understanding Clinical Concepts Extracted from Adult Critical Care Electronic Health Record Notes",
    authors: "Liu D, Ding C, Bold D, Bouvier M, Lu J, Jabaley CS, ..., Hu X",
    venue: "arXiv",
    year: 2024,
    date: "Jan 2024",
    type: "preprint",
    url: "https://arxiv.org/abs/2401.13588",
  },
  {
    title:
      "Enabling Scalable Predictive Monitoring and Alarm Analytics via a Real-Time Platform for Processing Continuous Cardiorespiratory Monitoring Data",
    authors: "Liu D, et al.",
    venue: "AMIA Annual Symposium",
    year: 2025,
    date: "Nov 2025",
    type: "conference",
    url: "https://amia.secure-platform.com/symposium/gallery/rounds/82021/details/20357",
  },
  {
    title: "Enabling Scalable Live Alarm Analytics: AlarmX",
    authors: "Liu D, et al.",
    venue: "IEEE BHI",
    year: 2025,
    date: "Oct 2025",
    type: "conference",
    url: "https://bhi.embs.org/2025/",
  },
  {
    title: "DietAI24: A Novel LLM-Based Dietary Assessment Software From Food Images",
    authors: "Yan R, Liu D, et al.",
    venue: "Nutrition (ASN)",
    year: 2025,
    date: "May 2025",
    type: "conference",
    url: "https://cdn.nutrition.org/article/S2475-2991(25)02366-2/fulltext",
  },
  {
    title: "Using Large Language Models to Tag Clinical Concepts Extracted from Nursing Notes",
    authors: "Liu D, et al.",
    venue: "IEEE BHI",
    year: 2023,
    date: "Oct 2023",
    type: "conference",
    url: "https://bhi.embs.org/2023/",
  },
];
```

- [ ] **Step 3: Create `src/data/projects.ts`**

```ts
export interface Project {
  name: string;
  tagline: string;
  description: string;
  tags: string[];
  url?: string;
  repo?: string;
}

export const projects: Project[] = [
  {
    name: "NutriCamp",
    tagline: "AI Diet Management Application",
    description:
      "Full-stack diet app with an embedded multimodal LLM agent that extracts micronutrient information directly from food images, removing manual logging and generating personalized dietary suggestions.",
    tags: ["LLM Agents", "Multimodal", "React", "Production"],
    url: "https://nutricamp.ai",
  },
  {
    name: "CanBeWell",
    tagline: "Mobile Health Intervention Platform",
    description:
      "A no-code platform letting clinicians design and deploy personalized activity and nutrition interventions in real time, with camera-based meal analysis and aggregated Fitbit, EMA, and sensor data.",
    tags: ["React Native", "Digital Health", "Wearables"],
    url: "https://canbewell.help",
  },
  {
    name: "ModelMeetsData",
    tagline: "ML Benchmarking Platform",
    description:
      "Full-stack React platform that hosts machine-learning models so users can benchmark them on their own datasets and owners can track performance across datasets.",
    tags: ["React", "ML Ops", "Full-stack"],
  },
  {
    name: "CRCWeb",
    tagline: "Colorectal Cancer Symptom Management",
    description:
      "React Native app delivering educational materials to colorectal cancer patients for managing psychoneurological symptoms, collecting phone sensor data to recommend daily routines.",
    tags: ["React Native", "Oncology", "Sensors"],
    repo: "https://github.com/ImNotDarren/CRCWeb",
  },
  {
    name: "AlarmX",
    tagline: "Real-Time Alarm Analytics",
    description:
      "Web-based real-time alarm analytics dashboard integrated into the Nihon Kohden Digital Health Platform, with a receiver pulling SQL data, converting to NKDHP format, and streaming to Kafka.",
    tags: ["Kafka", "Real-time", "SQL", "Dashboard"],
  },
];
```

- [ ] **Step 4: Create `src/data/discography.ts`** (artwork URLs filled by Task 6 script; start with empty strings)

```ts
export type ReleaseType = "album" | "ep" | "single";

export interface Release {
  title: string;
  year: number;
  type: ReleaseType;
  artworkUrl: string;
  url: string;
}

export const discography: Release[] = [
  { title: "Darren", year: 2024, type: "album", artworkUrl: "", url: "https://music.apple.com/us/artist/darren-liu/1581649003" },
  { title: "Murderer (US Version)", year: 2021, type: "album", artworkUrl: "", url: "https://music.apple.com/us/artist/darren-liu/1581649003" },
  { title: "Playboy (Deluxe Version) - EP", year: 2021, type: "ep", artworkUrl: "", url: "https://music.apple.com/us/artist/darren-liu/1581649003" },
  { title: "3am", year: 2025, type: "single", artworkUrl: "", url: "https://music.apple.com/us/artist/darren-liu/1581649003" },
  { title: "Bystander", year: 2024, type: "single", artworkUrl: "", url: "https://music.apple.com/us/artist/darren-liu/1581649003" },
  { title: "Hello", year: 2024, type: "single", artworkUrl: "", url: "https://music.apple.com/us/artist/darren-liu/1581649003" },
  { title: "Telepath", year: 2024, type: "single", artworkUrl: "", url: "https://music.apple.com/us/artist/darren-liu/1581649003" },
  { title: "Whispers of Return", year: 2023, type: "single", artworkUrl: "", url: "https://music.apple.com/us/artist/darren-liu/1581649003" },
  { title: "Dream", year: 2023, type: "single", artworkUrl: "", url: "https://music.apple.com/us/artist/darren-liu/1581649003" },
];

export const producerCredits = {
  label: "Silence Music (Chengdu) — Recording Engineer, Songwriter, Producer",
  notes: [
    "Chorus recording and vocal direction.",
    "Composing and producing original work.",
    "Co-produced Yichuan Wang's album \"Stop Daydreaming\".",
  ],
};
```

- [ ] **Step 5: Create `src/data/experience.ts`**

```ts
export interface ExperienceEntry {
  role: string;
  org: string;
  location: string;
  period: string;
  start: number; // sort key, year
  points: string[];
}

export const experience: ExperienceEntry[] = [
  {
    role: "PhD Researcher, Biomedical Informatics",
    org: "Emory University",
    location: "Atlanta, GA",
    period: "Aug 2024 – Present",
    start: 2024,
    points: [
      "LLM agents and machine learning for healthcare and nutrition.",
      "Research spanning clinical NLP, multimodal models, and physiological-signal ML.",
    ],
  },
  {
    role: "Data Scientist Intern",
    org: "Nihon Kohden America",
    location: "Irvine, CA",
    period: "May 2025 – Aug 2025",
    start: 2025,
    points: [
      "Built and deployed a real-time alarm analytics dashboard into the Nihon Kohden Digital Health Platform.",
      "Built a receiver pulling SQL (Bedmaster) data, converting to NKDHP format, and streaming to Kafka.",
    ],
  },
  {
    role: "Information Analyst",
    org: "Emory University",
    location: "Atlanta, GA",
    period: "Mar 2023 – Jun 2024",
    start: 2023,
    points: [
      "Built ModelMeetsData and CRCWeb full-stack platforms.",
      "Led LLM evaluation studies on clinical concept tagging and educational content.",
    ],
  },
  {
    role: "Recording Engineer, Songwriter, Producer",
    org: "Silence Music",
    location: "Chengdu, China",
    period: "Mar 2020 – Aug 2024",
    start: 2020,
    points: [
      "Chorus recording and vocal direction; composing and producing.",
      "Co-produced Yichuan Wang's album \"Stop Daydreaming\"; released albums \"Murderer\" and \"Darren\".",
    ],
  },
  {
    role: "Software Engineer Intern",
    org: "Chinasoft International",
    location: "Chongqing, China",
    period: "Jul 2020 – Aug 2020",
    start: 2019,
    points: ["Full-stack web development; requirement analysis and database design."],
  },
];
```

- [ ] **Step 6: Replace `tests/data.test.ts` with integrity tests**

```ts
import { describe, it, expect } from "vitest";
import { publications } from "@/data/publications";
import { projects } from "@/data/projects";
import { discography } from "@/data/discography";
import { experience } from "@/data/experience";
import { profile } from "@/data/profile";

const urlRe = /^(https?:|mailto:)/;

describe("data integrity", () => {
  it("publications have required fields and valid urls", () => {
    expect(publications.length).toBeGreaterThanOrEqual(11);
    for (const p of publications) {
      expect(p.title).toMatch(/.+/);
      expect(p.authors).toMatch(/.+/);
      expect(p.year).toBeGreaterThan(2000);
      expect(p.url).toMatch(urlRe);
      expect(["journal", "conference", "preprint"]).toContain(p.type);
    }
  });

  it("projects have name and description", () => {
    expect(projects.length).toBeGreaterThan(0);
    for (const p of projects) {
      expect(p.name).toMatch(/.+/);
      expect(p.description).toMatch(/.+/);
      if (p.url) expect(p.url).toMatch(urlRe);
    }
  });

  it("discography entries are valid", () => {
    for (const r of discography) {
      expect(r.title).toMatch(/.+/);
      expect(r.year).toBeGreaterThan(2000);
      expect(["album", "ep", "single"]).toContain(r.type);
      expect(r.url).toMatch(urlRe);
    }
  });

  it("experience entries are valid", () => {
    for (const e of experience) {
      expect(e.role).toMatch(/.+/);
      expect(e.org).toMatch(/.+/);
      expect(e.points.length).toBeGreaterThan(0);
    }
  });

  it("profile has contacts", () => {
    expect(profile.contacts.length).toBeGreaterThan(0);
    for (const c of profile.contacts) expect(c.href).toMatch(urlRe);
  });
});
```

- [ ] **Step 7: Run tests + typecheck**

Run: `npm test && npm run typecheck`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add typed content data modules with integrity tests"
```

---

## Task 6: Resolve Apple Music artwork URLs

**Files:**
- Create: `scripts/fetch-artwork.mjs`
- Modify: `src/data/discography.ts` (populate `artworkUrl`)

- [ ] **Step 1: Create `scripts/fetch-artwork.mjs`**

```js
// One-shot helper: query the public iTunes Search API for Darren Liu's
// releases and print {title -> artworkUrl}. Run with: node scripts/fetch-artwork.mjs
const ARTIST_ID = "1581649003";
const url = `https://itunes.apple.com/lookup?id=${ARTIST_ID}&entity=album,song&limit=200`;

const res = await fetch(url);
const data = await res.json();
const out = {};
for (const item of data.results ?? []) {
  const name = item.collectionName ?? item.trackName;
  const art = item.artworkUrl100;
  if (name && art) {
    out[name] = art.replace("100x100bb", "600x600bb");
  }
}
console.log(JSON.stringify(out, null, 2));
```

- [ ] **Step 2: Run the script and capture output**

Run: `node scripts/fetch-artwork.mjs`
Expected: JSON mapping of release names to 600x600 artwork URLs. If the API returns nothing (rate limit/region), skip to Step 4 fallback.

- [ ] **Step 3: Populate `artworkUrl` in `src/data/discography.ts`**

For each release whose name matches an output key, set `artworkUrl` to the resolved URL. Match flexibly (the API may return "Darren" or "Murderer (US Version)"). Example shape after editing one entry:
```ts
{ title: "Darren", year: 2024, type: "album", artworkUrl: "https://is1-ssl.mzstatic.com/.../600x600bb.jpg", url: "https://music.apple.com/us/artist/darren-liu/1581649003" },
```

- [ ] **Step 4: Fallback for any unresolved artwork**

For any release left with `artworkUrl: ""`, the Music component (Task 16) renders a generated gradient tile with the title initials, so empty strings are safe. Leave them empty if unresolved.

- [ ] **Step 5: Run tests**

Run: `npm test`
Expected: PASS (discography test allows empty artworkUrl).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: resolve Apple Music artwork urls for discography"
```

---

## Task 7: UI primitive — SectionTitle

**Files:**
- Create: `src/components/ui/SectionTitle.tsx`

- [ ] **Step 1: Create `src/components/ui/SectionTitle.tsx`**

```tsx
interface SectionTitleProps {
  eyebrow: string;
  title: string;
}

export function SectionTitle({ eyebrow, title }: SectionTitleProps) {
  return (
    <header className="mb-10">
      <p
        className="mb-2 text-sm font-medium uppercase tracking-[0.25em]"
        style={{ color: "var(--c-accent)" }}
      >
        {eyebrow}
      </p>
      <h2
        className="text-3xl font-bold sm:text-4xl"
        style={{ fontFamily: "var(--font-display)", color: "var(--c-text)" }}
      >
        {title}
      </h2>
    </header>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add SectionTitle ui primitive"
```

---

## Task 8: UI primitive — Reveal (scroll reveal)

**Files:**
- Create: `src/components/reveal/Reveal.tsx`

- [ ] **Step 1: Create `src/components/reveal/Reveal.tsx`**

```tsx
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

Note: Framer Motion respects `prefers-reduced-motion` automatically for transforms when the user sets `MotionConfig`, but to be safe the CSS in Task 3 disables animations under reduced motion.

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add Reveal scroll-reveal wrapper"
```

---

## Task 9: UI primitives — MagneticButton, TiltCard, Chip

**Files:**
- Create: `src/components/ui/MagneticButton.tsx`, `src/components/ui/TiltCard.tsx`, `src/components/ui/Chip.tsx`

- [ ] **Step 1: Create `src/components/ui/MagneticButton.tsx`**

```tsx
import { useRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useCoarsePointer } from "@/lib/useReducedMotion";

interface MagneticButtonProps {
  children: ReactNode;
  href: string;
  primary?: boolean;
}

export function MagneticButton({ children, href, primary }: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const coarse = useCoarsePointer();

  function onMove(e: React.MouseEvent) {
    if (coarse || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    ref.current.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  }
  function onLeave() {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold"
      style={{
        backgroundColor: primary ? "var(--c-accent)" : "transparent",
        color: primary ? "var(--c-bg)" : "var(--c-text)",
        border: primary ? "none" : "1px solid var(--c-border)",
        transition: "transform 0.2s ease",
      }}
    >
      {children}
    </motion.a>
  );
}
```

- [ ] **Step 2: Create `src/components/ui/TiltCard.tsx`**

```tsx
import { useRef, type ReactNode } from "react";
import { useCoarsePointer } from "@/lib/useReducedMotion";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

export function TiltCard({ children, className }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const coarse = useCoarsePointer();

  function onMove(e: React.MouseEvent) {
    if (coarse || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.transform = `perspective(800px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg)`;
  }
  function onLeave() {
    if (ref.current) ref.current.style.transform = "perspective(800px) rotateY(0) rotateX(0)";
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ transition: "transform 0.3s ease", transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 3: Create `src/components/ui/Chip.tsx`**

```tsx
interface ChipProps {
  label: string;
}

export function Chip({ label }: ChipProps) {
  return (
    <span
      className="inline-block rounded-full px-3 py-1 text-xs font-medium"
      style={{
        backgroundColor: "var(--c-accent-soft)",
        color: "var(--c-text)",
        border: "1px solid var(--c-border)",
      }}
    >
      {label}
    </span>
  );
}
```

- [ ] **Step 4: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add MagneticButton, TiltCard, Chip ui primitives"
```

---

## Task 10: HeroCanvas (three.js particle field) + Hero

**Files:**
- Create: `src/components/HeroCanvas.tsx`, `src/components/Hero.tsx`

- [ ] **Step 1: Create `src/components/HeroCanvas.tsx`**

A particle field whose target positions interpolate between a sphere/mesh (researcher) and a sine waveform plane (musician), colored by the active accent.

```tsx
import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useIdentity } from "@/theme/IdentityContext";

const COUNT = 2600;

function Particles({ musician }: { musician: boolean }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, meshTarget, waveTarget } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const meshTarget = new Float32Array(COUNT * 3);
    const waveTarget = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      // sphere shell (researcher)
      const phi = Math.acos(2 * (i / COUNT) - 1);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 3.2;
      meshTarget[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      meshTarget[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      meshTarget[i * 3 + 2] = r * Math.cos(phi);
      // waveform grid plane (musician)
      const gx = (i % 64) / 64 - 0.5;
      const gz = Math.floor(i / 64) / Math.ceil(COUNT / 64) - 0.5;
      waveTarget[i * 3] = gx * 9;
      waveTarget[i * 3 + 1] = 0;
      waveTarget[i * 3 + 2] = gz * 9;
      positions.set(meshTarget.subarray(i * 3, i * 3 + 3), i * 3);
    }
    return { positions, meshTarget, waveTarget };
  }, []);

  const color = useMemo(() => new THREE.Color(), []);

  useFrame((state) => {
    const pts = ref.current;
    if (!pts) return;
    const t = state.clock.elapsedTime;
    const attr = pts.geometry.attributes.position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    const k = musician ? 1 : 0;
    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3;
      const tx = THREE.MathUtils.lerp(meshTarget[ix], waveTarget[ix], k);
      let ty = THREE.MathUtils.lerp(meshTarget[ix + 1], waveTarget[ix + 1], k);
      const tz = THREE.MathUtils.lerp(meshTarget[ix + 2], waveTarget[ix + 2], k);
      if (musician) ty += Math.sin(tx * 1.2 + t * 2) * Math.cos(tz * 0.8 + t) * 0.9;
      arr[ix] += (tx - arr[ix]) * 0.05;
      arr[ix + 1] += (ty - arr[ix + 1]) * 0.05;
      arr[ix + 2] += (tz - arr[ix + 2]) * 0.05;
    }
    attr.needsUpdate = true;
    pts.rotation.y = t * 0.06;

    const accent = getComputedStyle(document.documentElement)
      .getPropertyValue("--c-accent")
      .trim();
    if (accent) {
      color.set(accent);
      (pts.material as THREE.PointsMaterial).color.lerp(color, 0.08);
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} sizeAttenuation transparent opacity={0.9} />
    </points>
  );
}

export default function HeroCanvas() {
  const { identity } = useIdentity();
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 60 }} dpr={[1, 1.8]}>
      <Particles musician={identity === "musician"} />
    </Canvas>
  );
}
```

- [ ] **Step 2: Create `src/components/Hero.tsx`** (lazy-loads HeroCanvas, gates on reduced-motion/WebGL)

```tsx
import { Suspense, lazy, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { useIdentity } from "@/theme/IdentityContext";
import { hasWebGL, useReducedMotion } from "@/lib/useReducedMotion";
import { MagneticButton } from "@/components/ui/MagneticButton";

const HeroCanvas = lazy(() => import("@/components/HeroCanvas"));

export function Hero() {
  const { identity } = useIdentity();
  const reduced = useReducedMotion();
  const [webgl, setWebgl] = useState(false);
  useEffect(() => setWebgl(hasWebGL()), []);

  const showCanvas = webgl && !reduced;
  const tagline =
    identity === "musician" ? profile.taglines.musician : profile.taglines.blended;

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      <div className="absolute inset-0 -z-0">
        {showCanvas ? (
          <Suspense fallback={null}>
            <HeroCanvas />
          </Suspense>
        ) : (
          <div
            className="h-full w-full"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 40%, var(--c-accent-soft), transparent 70%)",
            }}
          />
        )}
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-3 text-sm uppercase tracking-[0.3em]"
          style={{ color: "var(--c-accent)" }}
        >
          {profile.location}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="text-5xl font-bold leading-tight sm:text-7xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {profile.name}
        </motion.h1>
        <motion.p
          key={tagline}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-4 max-w-xl text-lg"
          style={{ color: "var(--c-text-muted)" }}
        >
          {tagline}
        </motion.p>
        <div className="mt-8 flex flex-wrap gap-4">
          <MagneticButton href="#research" primary>
            View research
          </MagneticButton>
          <MagneticButton href="#music">Listen to music</MagneticButton>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Typecheck + build (validates three.js types and chunking)**

Run: `npm run typecheck && npm run build`
Expected: build succeeds; a separate `three` chunk appears in output.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add three.js particle hero with reduced-motion fallback"
```

---

## Task 11: Nav + identity toggle + ScrollProgress + CursorGlow + App composition

**Files:**
- Create: `src/components/Nav.tsx`, `src/components/ScrollProgress.tsx`, `src/components/CursorGlow.tsx`
- Modify: `src/App.tsx`, `src/main.tsx`

- [ ] **Step 1: Create `src/components/Nav.tsx`**

```tsx
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
```

- [ ] **Step 2: Create `src/components/ScrollProgress.tsx`**

```tsx
import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left"
      style={{ scaleX, backgroundColor: "var(--c-accent)" }}
    />
  );
}
```

- [ ] **Step 3: Create `src/components/CursorGlow.tsx`**

```tsx
import { useEffect, useState } from "react";
import { useCoarsePointer } from "@/lib/useReducedMotion";

export function CursorGlow() {
  const coarse = useCoarsePointer();
  const [pos, setPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    if (coarse) return;
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [coarse]);

  if (coarse) return null;
  return (
    <div
      className="pointer-events-none fixed z-[55] h-64 w-64 rounded-full"
      style={{
        left: pos.x - 128,
        top: pos.y - 128,
        background: "radial-gradient(circle, var(--c-glow), transparent 70%)",
        opacity: 0.5,
        mixBlendMode: "screen",
      }}
    />
  );
}
```

- [ ] **Step 4: Replace `src/App.tsx`** (sections imported now; created in Tasks 12–18, so this will not build until those exist — implement App last among these, OR stub section imports). To keep the build green, create minimal placeholder section files first if needed; but since Tasks 12–18 follow, defer the final App wiring. For this task, wire only Nav/ScrollProgress/CursorGlow/Hero:

```tsx
import { IdentityProvider } from "@/theme/IdentityContext";
import { Nav } from "@/components/Nav";
import { ScrollProgress } from "@/components/ScrollProgress";
import { CursorGlow } from "@/components/CursorGlow";
import { Hero } from "@/components/Hero";

export default function App() {
  return (
    <IdentityProvider>
      <ScrollProgress />
      <CursorGlow />
      <Nav />
      <main>
        <Hero />
      </main>
    </IdentityProvider>
  );
}
```

- [ ] **Step 5: Typecheck + build + run dev smoke**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add nav, identity toggle, scroll progress, cursor glow, hero wiring"
```

---

## Task 12: About + Research sections

**Files:**
- Create: `src/components/sections/About.tsx`, `src/components/sections/Research.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create `src/components/sections/About.tsx`**

```tsx
import { profile } from "@/data/profile";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/reveal/Reveal";

export function About() {
  return (
    <section id="about" className="mx-auto max-w-4xl px-6 py-28">
      <SectionTitle eyebrow="About" title="Two worlds, one person" />
      <Reveal>
        <p className="text-lg leading-relaxed" style={{ color: "var(--c-text-muted)" }}>
          {profile.about}
        </p>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 2: Create `src/components/sections/Research.tsx`**

```tsx
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
```

- [ ] **Step 3: Add About + Research to `src/App.tsx`**

Add imports and place inside `<main>` after `<Hero />`:
```tsx
import { About } from "@/components/sections/About";
import { Research } from "@/components/sections/Research";
// ...
<Hero />
<About />
<Research />
```

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: success.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add About and Research sections"
```

---

## Task 13: Publications section (filterable)

**Files:**
- Create: `src/components/sections/Publications.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create `src/components/sections/Publications.tsx`**

```tsx
import { useMemo, useState } from "react";
import { publications, type PubType } from "@/data/publications";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/reveal/Reveal";

type Filter = "all" | PubType;
const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "journal", label: "Journal" },
  { key: "conference", label: "Conference" },
  { key: "preprint", label: "Preprint" },
];

export function Publications() {
  const [filter, setFilter] = useState<Filter>("all");
  const list = useMemo(() => {
    const filtered =
      filter === "all" ? publications : publications.filter((p) => p.type === filter);
    return [...filtered].sort((a, b) => b.year - a.year);
  }, [filter]);

  return (
    <section id="publications" className="mx-auto max-w-5xl px-6 py-28">
      <SectionTitle eyebrow="Publications" title="Selected papers" />
      <div className="mb-8 flex flex-wrap gap-3">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="rounded-full px-4 py-1.5 text-sm"
            style={{
              backgroundColor: filter === f.key ? "var(--c-accent)" : "transparent",
              color: filter === f.key ? "var(--c-bg)" : "var(--c-text-muted)",
              border: "1px solid var(--c-border)",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>
      <ul className="space-y-4">
        {list.map((p, i) => (
          <Reveal key={p.title} delay={Math.min(i * 0.04, 0.3)}>
            <li
              className="rounded-xl p-5"
              style={{ backgroundColor: "var(--c-surface)", border: "1px solid var(--c-border)" }}
            >
              <a href={p.url} target="_blank" rel="noopener noreferrer">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-semibold leading-snug" style={{ color: "var(--c-text)" }}>
                    {p.title}
                  </h3>
                  <span className="shrink-0 text-sm" style={{ color: "var(--c-accent)" }}>
                    {p.date}
                  </span>
                </div>
                <p className="mt-1 text-sm" style={{ color: "var(--c-text-muted)" }}>
                  {p.authors}
                </p>
                <p className="mt-1 text-sm italic" style={{ color: "var(--c-text-muted)" }}>
                  {p.venue}
                </p>
              </a>
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 2: Add to `src/App.tsx`** after `<Research />`:
```tsx
import { Publications } from "@/components/sections/Publications";
// ...
<Publications />
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: success.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add filterable Publications section"
```

---

## Task 14: Projects section

**Files:**
- Create: `src/components/sections/Projects.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create `src/components/sections/Projects.tsx`**

```tsx
import { projects } from "@/data/projects";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/reveal/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { Chip } from "@/components/ui/Chip";

export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-28">
      <SectionTitle eyebrow="Projects" title="Things I've built" />
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.06}>
            <TiltCard className="h-full">
              <div
                className="flex h-full flex-col rounded-2xl p-6"
                style={{ backgroundColor: "var(--c-surface)", border: "1px solid var(--c-border)" }}
              >
                <div className="mb-2 flex items-baseline justify-between">
                  <h3 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                    {p.name}
                  </h3>
                  {p.url && (
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-sm" style={{ color: "var(--c-accent)" }}>
                      Visit ↗
                    </a>
                  )}
                </div>
                <p className="mb-2 text-sm font-medium" style={{ color: "var(--c-accent)" }}>
                  {p.tagline}
                </p>
                <p className="mb-4 flex-1 text-sm" style={{ color: "var(--c-text-muted)" }}>
                  {p.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <Chip key={t} label={t} />
                  ))}
                </div>
                {p.repo && (
                  <a href={p.repo} target="_blank" rel="noopener noreferrer" className="mt-3 text-sm" style={{ color: "var(--c-accent)" }}>
                    GitHub ↗
                  </a>
                )}
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add to `src/App.tsx`** after `<Publications />`:
```tsx
import { Projects } from "@/components/sections/Projects";
// ...
<Projects />
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: success.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Projects section"
```

---

## Task 15: Music section

**Files:**
- Create: `src/components/sections/Music.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create `src/components/sections/Music.tsx`**

```tsx
import { discography, producerCredits } from "@/data/discography";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/reveal/Reveal";

function initials(title: string): string {
  return title.replace(/\(.*?\)/g, "").trim().slice(0, 2).toUpperCase();
}

export function Music() {
  const sorted = [...discography].sort((a, b) => b.year - a.year);
  return (
    <section id="music" className="mx-auto max-w-6xl px-6 py-28">
      <SectionTitle eyebrow="Music" title="Released as Darren Liu" />
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {sorted.map((r, i) => (
          <Reveal key={r.title} delay={Math.min(i * 0.05, 0.4)}>
            <a href={r.url} target="_blank" rel="noopener noreferrer" className="group block">
              <div
                className="relative aspect-square overflow-hidden rounded-xl"
                style={{ border: "1px solid var(--c-border)" }}
              >
                {r.artworkUrl ? (
                  <img
                    src={r.artworkUrl}
                    alt={r.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center text-2xl font-bold"
                    style={{
                      background: "linear-gradient(135deg, var(--c-accent), var(--c-accent-2))",
                      color: "var(--c-bg)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {initials(r.title)}
                  </div>
                )}
              </div>
              <p className="mt-2 text-sm font-semibold">{r.title}</p>
              <p className="text-xs uppercase tracking-wide" style={{ color: "var(--c-text-muted)" }}>
                {r.type} · {r.year}
              </p>
            </a>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div
          className="mt-12 rounded-2xl p-6"
          style={{ backgroundColor: "var(--c-surface)", border: "1px solid var(--c-border)" }}
        >
          <h3 className="mb-2 text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>
            Production
          </h3>
          <p className="mb-3 text-sm" style={{ color: "var(--c-accent)" }}>
            {producerCredits.label}
          </p>
          <ul className="space-y-1 text-sm" style={{ color: "var(--c-text-muted)" }}>
            {producerCredits.notes.map((n) => (
              <li key={n}>• {n}</li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 2: Add to `src/App.tsx`** after `<Projects />`:
```tsx
import { Music } from "@/components/sections/Music";
// ...
<Music />
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: success.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Music discography section"
```

---

## Task 16: Experience + Skills sections

**Files:**
- Create: `src/components/sections/Experience.tsx`, `src/components/sections/Skills.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create `src/components/sections/Experience.tsx`**

```tsx
import { experience } from "@/data/experience";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/reveal/Reveal";

export function Experience() {
  const sorted = [...experience].sort((a, b) => b.start - a.start);
  return (
    <section id="experience" className="mx-auto max-w-4xl px-6 py-28">
      <SectionTitle eyebrow="Experience" title="Where I've worked" />
      <div className="relative border-l pl-8" style={{ borderColor: "var(--c-border)" }}>
        {sorted.map((e, i) => (
          <Reveal key={`${e.org}-${e.role}`} delay={i * 0.06}>
            <div className="relative mb-10">
              <span
                className="absolute -left-[37px] top-1 h-3 w-3 rounded-full"
                style={{ backgroundColor: "var(--c-accent)" }}
              />
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-semibold">{e.role}</h3>
                <span className="text-sm" style={{ color: "var(--c-accent)" }}>
                  {e.period}
                </span>
              </div>
              <p className="text-sm" style={{ color: "var(--c-text-muted)" }}>
                {e.org} · {e.location}
              </p>
              <ul className="mt-2 space-y-1 text-sm" style={{ color: "var(--c-text-muted)" }}>
                {e.points.map((pt) => (
                  <li key={pt}>• {pt}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `src/components/sections/Skills.tsx`**

```tsx
import { profile } from "@/data/profile";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/reveal/Reveal";
import { Chip } from "@/components/ui/Chip";

export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-5xl px-6 py-28">
      <SectionTitle eyebrow="Skills" title="Tools of the trade" />
      <div className="grid gap-8 sm:grid-cols-2">
        {profile.skills.map((g, i) => (
          <Reveal key={g.label} delay={i * 0.06}>
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--c-accent)" }}>
                {g.label}
              </h3>
              <div className="flex flex-wrap gap-2">
                {g.items.map((s) => (
                  <Chip key={s} label={s} />
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Add to `src/App.tsx`** after `<Music />`:
```tsx
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
// ...
<Experience />
<Skills />
```

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: success.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Experience timeline and Skills sections"
```

---

## Task 17: Contact section + footer

**Files:**
- Create: `src/components/sections/Contact.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create `src/components/sections/Contact.tsx`**

```tsx
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
```

- [ ] **Step 2: Add to `src/App.tsx`** after `<Skills />`:
```tsx
import { Contact } from "@/components/sections/Contact";
// ...
<Contact />
```

- [ ] **Step 3: Build + full test + typecheck**

Run: `npm run build && npm test && npm run typecheck`
Expected: all pass.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Contact section and footer"
```

---

## Task 18: Manual browser verification

**Files:** none (verification only)

- [ ] **Step 1: Start dev server**

Run: `npm run dev` (note the local URL).

- [ ] **Step 2: Verify with webapp-testing skill / Playwright**

Check: hero renders (canvas or fallback), identity toggle morphs the palette across the whole page, all 9 sections present, publication filters work, music covers load, links open, mobile menu works at narrow width. Capture a screenshot in both Researcher and Musician modes.

- [ ] **Step 3: Verify reduced-motion fallback**

Emulate `prefers-reduced-motion: reduce`; confirm the WebGL hero is replaced by the gradient and transitions are disabled.

- [ ] **Step 4: Fix any visual issues found, then commit**

```bash
git add -A
git commit -m "fix: address visual issues from browser verification"
```

---

## Task 19: Firebase Hosting config + deploy

**Files:**
- Create: `firebase.json`, `.firebaserc`

- [ ] **Step 1: Create `.firebaserc`**

```json
{
  "projects": {
    "default": "darren-40535"
  }
}
```

- [ ] **Step 2: Create `firebase.json`**

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }],
    "headers": [
      {
        "source": "**/*.@(js|css|woff2|jpg|png|svg)",
        "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
      }
    ]
  }
}
```

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: `dist/` produced.

- [ ] **Step 4: Authenticate (user action)**

The user runs in-session: `! firebase login`
Expected: logged in as the account owning project `darren-40535`.

- [ ] **Step 5: Deploy (confirm before running — outward-facing)**

Run: `firebase deploy --only hosting --project darren-40535`
Expected: deploy succeeds; prints Hosting URL (`https://darren-40535.web.app`).

- [ ] **Step 6: Verify live site**

Open the Hosting URL; confirm the site loads and the toggle works.

- [ ] **Step 7: Commit config**

```bash
git add -A
git commit -m "chore: add Firebase Hosting config"
```

---

## Self-Review Notes

- **Spec coverage:** Hero (T10), dual-identity toggle/palettes (T3, T11), all 9 sections (T10, T12–T17), publications filter (T13), music cover grid + producer credits (T15), effects — magnetic/tilt/cursor/scroll-progress (T9, T11), reduced-motion + WebGL fallback (T4, T10), data modules (T5), artwork resolution (T6), accessibility (aria labels in T11, semantic sections throughout), Firebase deploy (T19). All spec sections map to tasks.
- **Type consistency:** `Identity`, `PALETTES`, `applyPalette`, `useIdentity`, `useCoarsePointer`, `useReducedMotion`, `hasWebGL`, data interfaces (`Publication`, `Project`, `Release`, `ExperienceEntry`) are defined once and reused with matching names.
- **Known nit fixed in T12:** `Research` TiltCard had double padding; instruction added to drop outer `p-6` so only the inner surface card pads.
- **Placeholder scan:** No TBD/TODO; every code step includes full code. Artwork empty strings are an intentional, handled fallback (T6 Step 4, T15 initials tile), not a placeholder.
