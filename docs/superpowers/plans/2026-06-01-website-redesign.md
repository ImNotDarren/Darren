# Website Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the personal site as a light, playful, choose-your-path experience: a split landing routing into two distinct content worlds (Research, Music), each a sequence of Apple-style pinned scroll-scrubbed stages with Lenis smooth scroll, then redeploy over the live Firebase site.

**Architecture:** `react-router-dom` serves three routes (`/`, `/research`, `/music`). A light theme system sets per-world accent CSS variables on a wrapper. `PinnedStage` uses a sticky panel + Framer Motion `useScroll` to scrub child animations; Lenis smooths scrolling. 2D canvas motifs replace three.js. Content comes from existing `data/*.ts` modules, extended with per-world about text, stats, and world tagging on experience.

**Tech Stack:** Vite 8, React 19, TypeScript 6 (strict), Tailwind v4, Framer Motion 12, react-router-dom 7.16, lenis 1.3, Vitest 4. Removes three / @react-three/* / @types/three.

---

## File Structure

```
src/
  main.tsx                      # BrowserRouter wrapper
  App.tsx                       # Routes + WipeTransition + Lenis
  routes/
    Landing.tsx                 # split-screen entry
    ResearchWorld.tsx           # composes research stages
    MusicWorld.tsx              # composes music stages
  theme/
    worlds.ts                   # world configs + applyAccents()
  lib/
    useReducedMotion.ts         # kept (reduced-motion, coarse pointer, hasWebGL unused-> drop hasWebGL)
    useLenis.ts                 # smooth scroll setup hook
    useScrollProgress.ts        # useScroll wrapper for a target ref
    useCountUp.ts               # animated number hook
  components/
    WorldNav.tsx                # nav + persistent world switcher
    WipeTransition.tsx          # full-screen color wipe on route change
    PinnedStage.tsx             # sticky scrub wrapper
    motifs/
      DataNodes.tsx             # research canvas motif (cursor-reactive)
      Waveform.tsx              # music canvas motif (interactive)
    ui/
      SectionTitle.tsx
      MagneticButton.tsx
      TiltCard.tsx
      Chip.tsx
      StatCounter.tsx
      DragTrack.tsx
      PortalCTA.tsx
    stages/
      research/
        Intro.tsx  AboutResearch.tsx  Themes.tsx  Publications.tsx
        Projects.tsx  ExperienceResearch.tsx  Skills.tsx
      music/
        Intro.tsx  AboutMusic.tsx  Discography.tsx  Production.tsx
        Featured.tsx  ExperienceMusic.tsx
  data/
    profile.ts                  # + about.research/about.music + stats
    experience.ts               # + world tag
    publications.ts projects.ts discography.ts   # reused as-is
    worlds.ts  -> NOTE: world config lives in theme/worlds.ts (not data/)
  styles/index.css              # light theme variables + base
tests/
  data.test.ts                  # + world tag coverage
  worlds.test.ts                # world config completeness
```

Files to DELETE (old dark/single-scroll implementation):
`src/components/Hero.tsx`, `src/components/HeroCanvas.tsx`, `src/components/Nav.tsx`, `src/components/ScrollProgress.tsx`, `src/components/CursorGlow.tsx`, `src/components/reveal/Reveal.tsx`, `src/components/sections/*` (About, Research, Publications, Projects, Music, Experience, Skills, Contact), `src/theme/IdentityContext.tsx`, `src/theme/palettes.ts`, `tests/palettes.test.ts`.

---

## Task 1: Dependency swap + remove old implementation

**Files:** `package.json`; delete old component/theme/test files.

- [ ] **Step 1: Remove three.js, add router + lenis**

Run:
```bash
npm uninstall three @react-three/fiber @react-three/drei @types/three
npm install react-router-dom@7.16.0 lenis@1.3.23
```
Expected: installs succeed.

- [ ] **Step 2: Delete old presentation files**

Run:
```bash
git rm src/components/Hero.tsx src/components/HeroCanvas.tsx src/components/Nav.tsx \
  src/components/ScrollProgress.tsx src/components/CursorGlow.tsx \
  src/components/reveal/Reveal.tsx \
  src/components/sections/About.tsx src/components/sections/Research.tsx \
  src/components/sections/Publications.tsx src/components/sections/Projects.tsx \
  src/components/sections/Music.tsx src/components/sections/Experience.tsx \
  src/components/sections/Skills.tsx src/components/sections/Contact.tsx \
  src/theme/IdentityContext.tsx src/theme/palettes.ts tests/palettes.test.ts
```
Expected: files removed. (App.tsx will be rewritten in Task 13; build will be red until then — that's expected.)

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove three.js + old single-scroll implementation, add router + lenis"
```

---

## Task 2: Light theme system (worlds config + CSS variables)

**Files:**
- Create: `src/theme/worlds.ts`, `tests/worlds.test.ts`
- Modify: `src/styles/index.css`

- [ ] **Step 1: Write failing test `tests/worlds.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { WORLDS, WORLD_KEYS, type WorldKey } from "@/theme/worlds";

describe("worlds", () => {
  it("defines research and music", () => {
    expect(WORLD_KEYS).toEqual(["research", "music"]);
  });

  it("each world has label, role, route, and accents", () => {
    for (const key of WORLD_KEYS as WorldKey[]) {
      const w = WORLDS[key];
      expect(w.label).toMatch(/.+/);
      expect(w.role).toMatch(/.+/);
      expect(w.route).toMatch(/^\//);
      expect(w.accent).toMatch(/^#/);
      expect(w.accent2).toMatch(/^#/);
      expect(w.accentSoft).toMatch(/rgba/);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/worlds.test.ts`
Expected: FAIL (cannot resolve `@/theme/worlds`).

- [ ] **Step 3: Create `src/theme/worlds.ts`**

```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/worlds.test.ts`
Expected: PASS.

- [ ] **Step 5: Replace `src/styles/index.css` with the light theme**

```css
@import "tailwindcss";

:root {
  --bg: #ffffff;
  --bg-soft: #f5f5f7;
  --ink: #0f0f12;
  --ink-muted: #5b5b66;
  --line: rgba(15, 15, 18, 0.10);
  /* accents default to research; overridden by applyAccents */
  --accent: #0b4cff;
  --accent-2: #3b82f6;
  --accent-soft: rgba(11, 76, 255, 0.10);
}

@theme inline {
  --color-bg: var(--bg);
  --color-bg-soft: var(--bg-soft);
  --color-ink: var(--ink);
  --color-ink-muted: var(--ink-muted);
  --color-accent: var(--accent);
  --color-accent-2: var(--accent-2);
  --font-display: "Space Grotesk", system-ui, sans-serif;
  --font-body: "Inter", system-ui, sans-serif;
}

html {
  background: var(--bg);
}

body {
  margin: 0;
  color: var(--ink);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
}

/* Lenis smooth-scroll baseline */
html.lenis,
html.lenis body {
  height: auto;
}
.lenis.lenis-smooth {
  scroll-behavior: auto !important;
}
.lenis.lenis-stopped {
  overflow: hidden;
}

::selection {
  background: var(--accent);
  color: #fff;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add light theme system with per-world accent variables"
```

---

## Task 3: Data additions (about variants, stats, world tagging)

**Files:**
- Modify: `src/data/profile.ts`, `src/data/experience.ts`
- Modify: `tests/data.test.ts`

- [ ] **Step 1: Update `src/data/profile.ts`** — replace the `about` string with per-world variants and add `stats`. Replace the whole file with:

```ts
export interface SkillGroup {
  label: string;
  items: string[];
}

export interface ContactLink {
  label: string;
  href: string;
}

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export const profile = {
  name: "Darren (Sizuo) Liu",
  location: "Atlanta, GA",
  taglines: {
    research: "PhD researcher in Biomedical Informatics, building AI for health.",
    music: "Singer-songwriter & music producer.",
  },
  about: {
    research:
      "I am a PhD student in Computer Science and Informatics at Emory University on the Biomedical Informatics track. I build LLM agents and machine-learning systems for healthcare and nutrition, spanning clinical NLP, multimodal models, and physiological-signal analysis. I like turning messy clinical data into tools that reach real patients and clinicians.",
    music:
      "I write, record, and produce music as Darren Liu, with several albums and singles released across streaming platforms. As a recording engineer and producer at Silence Music in Chengdu I directed vocals, composed, and co-produced other artists. Sound is the other half of how I think.",
  },
  stats: {
    research: [
      { value: 12, suffix: "", label: "Publications" },
      { value: 4, suffix: "", label: "Research themes" },
      { value: 2028, suffix: "", label: "PhD expected" },
    ] as Stat[],
    music: [
      { value: 9, suffix: "", label: "Releases" },
      { value: 2, suffix: "", label: "Albums" },
      { value: 5, suffix: "+", label: "Years producing" },
    ] as Stat[],
  },
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

- [ ] **Step 2: Update `src/data/experience.ts`** — add a `world` field to the interface and tag each entry. Replace the interface and array; keep existing data, adding `world`:

Change the interface to:
```ts
export type ExperienceWorld = "research" | "music" | "both";

export interface ExperienceEntry {
  role: string;
  org: string;
  location: string;
  period: string;
  start: number;
  world: ExperienceWorld;
  points: string[];
}
```

Then add `world` to each entry: Emory PhD → `"research"`, Nihon Kohden → `"research"`, Emory Information Analyst → `"research"`, Silence Music → `"music"`, Chinasoft → `"research"`. (Insert `world: "research",` / `world: "music",` after each `start:` line.)

- [ ] **Step 3: Update `tests/data.test.ts`** — add world-tag and stats assertions. Append inside the `describe("data integrity", ...)` block:

```ts
  it("experience entries are world-tagged", () => {
    for (const e of experience) {
      expect(["research", "music", "both"]).toContain(e.world);
    }
    expect(experience.some((e) => e.world === "music")).toBe(true);
    expect(experience.some((e) => e.world === "research")).toBe(true);
  });

  it("profile has per-world about and stats", () => {
    expect(profile.about.research).toMatch(/.+/);
    expect(profile.about.music).toMatch(/.+/);
    expect(profile.stats.research.length).toBe(3);
    expect(profile.stats.music.length).toBe(3);
  });
```

Also update the existing "profile has contacts" usage if needed (no change). Remove the old `profile.about` string assertion if present (the original test referenced `profile.contacts` only, so no change required beyond the additions).

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: PASS (data + worlds).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add per-world about/stats and world-tag experience"
```

---

## Task 4: lib hooks (Lenis, scroll progress, count-up, reduced motion)

**Files:**
- Modify: `src/lib/useReducedMotion.ts` (drop unused `hasWebGL`)
- Create: `src/lib/useLenis.ts`, `src/lib/useScrollProgress.ts`, `src/lib/useCountUp.ts`

- [ ] **Step 1: Replace `src/lib/useReducedMotion.ts`** (remove `hasWebGL`, keep the two hooks)

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

- [ ] **Step 2: Create `src/lib/useLenis.ts`**

```ts
import { useEffect } from "react";
import Lenis from "lenis";

/** Initialize Lenis smooth scrolling for the page lifetime. Disabled under reduced motion. */
export function useLenis(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [enabled]);
}
```

- [ ] **Step 3: Create `src/lib/useScrollProgress.ts`**

```ts
import { useScroll, type MotionValue } from "framer-motion";
import { useRef, type RefObject } from "react";

/** Returns a ref to attach to a tall stage wrapper and the 0..1 scroll progress through it. */
export function useStageProgress(): {
  ref: RefObject<HTMLDivElement | null>;
  progress: MotionValue<number>;
} {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  return { ref, progress: scrollYProgress };
}
```

- [ ] **Step 4: Create `src/lib/useCountUp.ts`**

```ts
import { useEffect, useRef, useState } from "react";

/** Counts from 0 to `target` once when `active` first becomes true. */
export function useCountUp(target: number, active: boolean, durationMs = 1200): number {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!active || started.current) return;
    started.current = true;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, durationMs]);

  return value;
}
```

- [ ] **Step 5: Typecheck (will still error on App.tsx until Task 13; check these files compile in isolation via test run)**

Run: `npx vitest run tests/worlds.test.ts`
Expected: PASS (confirms no syntax errors in imported lib chain is not required here; this is a smoke check).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add lenis, stage-progress, count-up, reduced-motion hooks"
```

---

## Task 5: PinnedStage component

**Files:**
- Create: `src/components/PinnedStage.tsx`

- [ ] **Step 1: Create `src/components/PinnedStage.tsx`**

```tsx
import { type ReactNode } from "react";
import { type MotionValue } from "framer-motion";
import { useStageProgress } from "@/lib/useScrollProgress";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface PinnedStageProps {
  /** Total scroll length as a multiple of viewport height (e.g. 2.5 => 250vh). */
  length?: number;
  /** Render prop receives 0..1 progress through the stage. */
  children: (progress: MotionValue<number> | null) => ReactNode;
  id?: string;
  className?: string;
}

/**
 * A tall wrapper containing a sticky full-height panel. Scrolling through the
 * wrapper drives `progress` 0..1. Under reduced motion it renders a static panel
 * (progress = null) so children show their final state.
 */
export function PinnedStage({ length = 2, children, id, className }: PinnedStageProps) {
  const { ref, progress } = useStageProgress();
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <section id={id} className={className}>
        <div className="min-h-screen">{children(null)}</div>
      </section>
    );
  }

  return (
    <section id={id} ref={ref} style={{ height: `${length * 100}vh` }} className={className}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {children(progress)}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add PinnedStage sticky scrub component"
```

---

## Task 6: Canvas motifs (DataNodes, Waveform)

**Files:**
- Create: `src/components/motifs/DataNodes.tsx`, `src/components/motifs/Waveform.tsx`

- [ ] **Step 1: Create `src/components/motifs/DataNodes.tsx`** (research: points + links leaning toward cursor)

```tsx
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export function DataNodes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -1e4, y: -1e4 };

    function resize() {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    const count = Math.min(70, Math.floor(w / 16));
    const nodes: Node[] = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
    }));

    function accent(): string {
      return getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#0b4cff";
    }

    let raf = 0;
    function frame() {
      ctx.clearRect(0, 0, w, h);
      const color = accent();
      for (const n of nodes) {
        if (!reduced) {
          n.x += n.vx;
          n.y += n.vy;
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 14000) {
            n.x += dx * 0.0009;
            n.y += dy * 0.0009;
          }
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
        }
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 120) {
            ctx.globalAlpha = (1 - dist / 120) * 0.35;
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      for (const n of nodes) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduced) raf = requestAnimationFrame(frame);
    }
    frame();

    function onMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  return <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />;
}
```

- [ ] **Step 2: Create `src/components/motifs/Waveform.tsx`** (music: animated bars rising toward cursor)

```tsx
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

export function Waveform() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let mouseX = -1e4;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    const barW = 6;
    const gap = 6;

    function colors(): [string, string] {
      const root = getComputedStyle(document.documentElement);
      return [
        root.getPropertyValue("--accent").trim() || "#ff2d78",
        root.getPropertyValue("--accent-2").trim() || "#ff7a18",
      ];
    }

    let raf = 0;
    let t = 0;
    function frame() {
      ctx.clearRect(0, 0, w, h);
      const [c1, c2] = colors();
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, c1);
      grad.addColorStop(1, c2);
      ctx.fillStyle = grad;
      const n = Math.floor(w / (barW + gap));
      const mid = h / 2;
      for (let i = 0; i < n; i++) {
        const x = i * (barW + gap);
        const base = Math.sin(i * 0.35 + t) * 0.5 + 0.5;
        let amp = base * h * 0.28 + 4;
        const dist = Math.abs(x - mouseX);
        if (dist < 120) amp += (1 - dist / 120) * h * 0.22;
        ctx.beginPath();
        const r = barW / 2;
        const top = mid - amp;
        const bot = mid + amp;
        ctx.roundRect(x, top, barW, bot - top, r);
        ctx.fill();
      }
      if (!reduced) {
        t += 0.04;
        raf = requestAnimationFrame(frame);
      }
    }
    frame();

    function onMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  return <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />;
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add DataNodes and Waveform canvas motifs"
```

---

## Task 7: UI primitives

**Files:**
- Create: `src/components/ui/SectionTitle.tsx`, `MagneticButton.tsx`, `TiltCard.tsx`, `Chip.tsx`, `StatCounter.tsx`, `DragTrack.tsx`, `PortalCTA.tsx`

- [ ] **Step 1: `SectionTitle.tsx`**

```tsx
interface SectionTitleProps {
  eyebrow: string;
  title: string;
}

export function SectionTitle({ eyebrow, title }: SectionTitleProps) {
  return (
    <header className="mb-10">
      <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--accent)" }}>
        {eyebrow}
      </p>
      <h2 className="text-4xl font-bold sm:text-5xl" style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
        {title}
      </h2>
    </header>
  );
}
```

- [ ] **Step 2: `MagneticButton.tsx`**

```tsx
import { useRef, type ReactNode } from "react";
import { useCoarsePointer } from "@/lib/useReducedMotion";

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  primary?: boolean;
}

export function MagneticButton({ children, href, onClick, primary }: MagneticButtonProps) {
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
    <a
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="inline-flex cursor-pointer items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-transform"
      style={{
        backgroundColor: primary ? "var(--accent)" : "transparent",
        color: primary ? "#fff" : "var(--ink)",
        border: primary ? "none" : "1px solid var(--line)",
      }}
    >
      {children}
    </a>
  );
}
```

- [ ] **Step 3: `TiltCard.tsx`**

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
    ref.current.style.transform = `perspective(800px) rotateY(${px * 7}deg) rotateX(${-py * 7}deg)`;
  }
  function onLeave() {
    if (ref.current) ref.current.style.transform = "perspective(800px) rotateY(0) rotateX(0)";
  }

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={className} style={{ transition: "transform 0.3s ease" }}>
      {children}
    </div>
  );
}
```

- [ ] **Step 4: `Chip.tsx`**

```tsx
export function Chip({ label }: { label: string }) {
  return (
    <span
      className="inline-block rounded-full px-3 py-1 text-xs font-medium"
      style={{ backgroundColor: "var(--accent-soft)", color: "var(--ink)", border: "1px solid var(--line)" }}
    >
      {label}
    </span>
  );
}
```

- [ ] **Step 5: `StatCounter.tsx`**

```tsx
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useCountUp } from "@/lib/useCountUp";

interface StatCounterProps {
  value: number;
  suffix?: string;
  label: string;
}

export function StatCounter({ value, suffix = "", label }: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const n = useCountUp(value, inView);
  return (
    <motion.div ref={ref} className="text-center">
      <div className="text-5xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}>
        {n}
        {suffix}
      </div>
      <div className="mt-1 text-sm" style={{ color: "var(--ink-muted)" }}>
        {label}
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 6: `DragTrack.tsx`** (horizontal drag/scroll track)

```tsx
import { useRef, type ReactNode } from "react";
import { motion } from "framer-motion";

interface DragTrackProps {
  children: ReactNode;
  className?: string;
}

export function DragTrack({ children, className }: DragTrackProps) {
  const constraints = useRef<HTMLDivElement>(null);
  return (
    <div ref={constraints} className={`overflow-hidden ${className ?? ""}`}>
      <motion.div drag="x" dragConstraints={constraints} dragElastic={0.08} className="flex cursor-grab gap-6 active:cursor-grabbing">
        {children}
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 7: `PortalCTA.tsx`** (cross-over portal)

```tsx
import { useNavigate } from "react-router-dom";
import { WORLDS, type WorldKey } from "@/theme/worlds";

interface PortalCTAProps {
  to: WorldKey;
  onNavigate?: (route: string) => void;
}

export function PortalCTA({ to, onNavigate }: PortalCTAProps) {
  const navigate = useNavigate();
  const w = WORLDS[to];
  function go() {
    if (onNavigate) onNavigate(w.route);
    else navigate(w.route);
  }
  return (
    <button
      onClick={go}
      className="group relative w-full overflow-hidden rounded-3xl px-8 py-16 text-left"
      style={{ background: `linear-gradient(120deg, ${w.accent}, ${w.accent2})`, color: "#fff" }}
    >
      <span className="text-sm font-semibold uppercase tracking-[0.25em] opacity-80">Cross over</span>
      <span className="mt-2 block text-4xl font-bold sm:text-6xl" style={{ fontFamily: "var(--font-display)" }}>
        Enter the {w.label} world →
      </span>
    </button>
  );
}
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add ui primitives (title, magnetic, tilt, chip, counter, drag track, portal)"
```

---

## Task 8: WipeTransition + WorldNav

**Files:**
- Create: `src/components/WipeTransition.tsx`, `src/components/WorldNav.tsx`

- [ ] **Step 1: Create `src/components/WipeTransition.tsx`** (context-driven full-screen wipe used on navigation)

```tsx
import { AnimatePresence, motion } from "framer-motion";
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface WipeContextValue {
  wipeTo: (route: string, color: string) => void;
}
const WipeCtx = createContext<WipeContextValue | null>(null);

export function WipeProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [color, setColor] = useState("#0b4cff");
  const pending = useRef<string | null>(null);

  const wipeTo = useCallback((route: string, c: string) => {
    setColor(c);
    pending.current = route;
    setActive(true);
  }, []);

  function onCovered() {
    if (pending.current) {
      navigate(pending.current);
      pending.current = null;
      window.scrollTo(0, 0);
      setActive(false);
    }
  }

  return (
    <WipeCtx.Provider value={{ wipeTo }}>
      {children}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[100]"
            style={{ backgroundColor: color, transformOrigin: "bottom" }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0, transformOrigin: "top" }}
            transition={{ duration: 0.5, ease: [0.7, 0, 0.3, 1] }}
            onAnimationComplete={onCovered}
          />
        )}
      </AnimatePresence>
    </WipeCtx.Provider>
  );
}

export function useWipe(): WipeContextValue {
  const ctx = useContext(WipeCtx);
  if (!ctx) throw new Error("useWipe must be used within WipeProvider");
  return ctx;
}
```

- [ ] **Step 2: Create `src/components/WorldNav.tsx`** (persistent nav + world switcher)

```tsx
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
        <div className="flex items-center gap-1 rounded-full p-1" style={{ border: "1px solid var(--line)", background: "rgba(255,255,255,0.6)", backdropFilter: "blur(8px)" }}>
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
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add wipe transition provider and world nav switcher"
```

---

## Task 9: Landing route (split screen)

**Files:**
- Create: `src/routes/Landing.tsx`

- [ ] **Step 1: Create `src/routes/Landing.tsx`**

```tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { WORLDS } from "@/theme/worlds";
import { useWipe } from "@/components/WipeTransition";
import { profile } from "@/data/profile";

type Hover = "research" | "music" | null;

export function Landing() {
  const [hover, setHover] = useState<Hover>(null);
  const { wipeTo } = useWipe();
  const r = WORLDS.research;
  const m = WORLDS.music;

  const researchFlex = hover === "research" ? 1.5 : hover === "music" ? 0.5 : 1;
  const musicFlex = hover === "music" ? 1.5 : hover === "research" ? 0.5 : 1;

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-bg">
      <div className="flex h-full w-full">
        <motion.button
          className="relative flex h-full items-center justify-center overflow-hidden"
          style={{ background: `linear-gradient(140deg, ${r.accent}, ${r.accent2})` }}
          animate={{ flex: researchFlex }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          onMouseEnter={() => setHover("research")}
          onMouseLeave={() => setHover(null)}
          onClick={() => wipeTo(r.route, r.accent)}
          aria-label="Enter the Research world"
        >
          <div className="text-center text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] opacity-80">{r.role}</p>
            <h2 className="mt-2 text-5xl font-bold sm:text-7xl" style={{ fontFamily: "var(--font-display)" }}>
              {r.label}
            </h2>
            <p className="mt-4 text-sm opacity-80">Papers · Projects · AI for health →</p>
          </div>
        </motion.button>

        <motion.button
          className="relative flex h-full items-center justify-center overflow-hidden"
          style={{ background: `linear-gradient(140deg, ${m.accent}, ${m.accent2})` }}
          animate={{ flex: musicFlex }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          onMouseEnter={() => setHover("music")}
          onMouseLeave={() => setHover(null)}
          onClick={() => wipeTo(m.route, m.accent)}
          aria-label="Enter the Music world"
        >
          <div className="text-center text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] opacity-80">{m.role}</p>
            <h2 className="mt-2 text-5xl font-bold sm:text-7xl" style={{ fontFamily: "var(--font-display)" }}>
              {m.label}
            </h2>
            <p className="mt-4 text-sm opacity-80">Albums · Singles · Production →</p>
          </div>
        </motion.button>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-10 text-center">
        <h1 className="text-2xl font-bold text-white mix-blend-difference sm:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
          {profile.name}
        </h1>
        <p className="mt-1 text-sm text-white mix-blend-difference opacity-90">Choose a world</p>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add split-screen landing route"
```

---

## Task 10: Research world stages

**Files:**
- Create: `src/components/stages/research/Intro.tsx`, `AboutResearch.tsx`, `Themes.tsx`, `Publications.tsx`, `Projects.tsx`, `ExperienceResearch.tsx`, `Skills.tsx`

- [ ] **Step 1: `Intro.tsx`** (pinned, motif background, scrubbed title)

```tsx
import { motion, useTransform, type MotionValue } from "framer-motion";
import { PinnedStage } from "@/components/PinnedStage";
import { DataNodes } from "@/components/motifs/DataNodes";
import { profile } from "@/data/profile";
import { WORLDS } from "@/theme/worlds";

function Inner({ progress }: { progress: MotionValue<number> | null }) {
  const fallback = useTransform(progress ?? new (class { } as never), [0, 1], [1, 1]);
  const opacity = progress ? useTransform(progress, [0, 0.6, 1], [1, 1, 0]) : fallback;
  const y = progress ? useTransform(progress, [0, 1], [0, -120]) : fallback;
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0">
        <DataNodes />
      </div>
      <motion.div style={{ opacity, y }} className="relative z-10 mx-auto flex h-full max-w-5xl flex-col justify-center px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: "var(--accent)" }}>
          {WORLDS.research.role} · {profile.location}
        </p>
        <h1 className="mt-3 text-6xl font-bold sm:text-8xl" style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
          {profile.name}
        </h1>
        <p className="mt-4 max-w-xl text-lg" style={{ color: "var(--ink-muted)" }}>
          {profile.taglines.research}
        </p>
      </motion.div>
    </div>
  );
}

export function Intro() {
  return <PinnedStage id="intro" length={2}>{(p) => <Inner progress={p} />}</PinnedStage>;
}
```

NOTE for implementer: the `fallback`/conditional `useTransform` pattern above risks violating the rules-of-hooks (calling hooks conditionally). Implement it WITHOUT conditionals by always calling `useTransform` on a guaranteed MotionValue. Use this corrected pattern in every scrubbed stage:

```tsx
import { useMotionValue } from "framer-motion";
// inside Inner:
const zero = useMotionValue(0);
const src = progress ?? zero;            // always a MotionValue
const opacity = useTransform(src, [0, 0.6, 1], [1, 1, progress ? 0 : 1]);
const y = useTransform(src, [0, 1], [0, progress ? -120 : 0]);
```

Apply this corrected approach (never call `useTransform` conditionally) in Intro and all stages below.

- [ ] **Step 2: `AboutResearch.tsx`** (normal section + stat counters)

```tsx
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StatCounter } from "@/components/ui/StatCounter";
import { profile } from "@/data/profile";

export function AboutResearch() {
  return (
    <section id="about" className="mx-auto max-w-4xl px-6 py-32">
      <SectionTitle eyebrow="About" title="Researcher" />
      <p className="text-xl leading-relaxed" style={{ color: "var(--ink-muted)" }}>
        {profile.about.research}
      </p>
      <div className="mt-16 grid grid-cols-3 gap-6">
        {profile.stats.research.map((s) => (
          <StatCounter key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: `Themes.tsx`** (4 theme cards, staggered reveal)

```tsx
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
```

- [ ] **Step 4: `Publications.tsx`** (filter + animated count) — port the existing component to light styling:

```tsx
import { useMemo, useState } from "react";
import { publications, type PubType } from "@/data/publications";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StatCounter } from "@/components/ui/StatCounter";

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
    const f = filter === "all" ? publications : publications.filter((p) => p.type === filter);
    return [...f].sort((a, b) => b.year - a.year);
  }, [filter]);

  return (
    <section id="publications" className="mx-auto max-w-5xl px-6 py-32">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <SectionTitle eyebrow="Publications" title="Selected papers" />
        <StatCounter value={publications.length} label="Total" />
      </div>
      <div className="mb-8 flex flex-wrap gap-3">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="rounded-full px-4 py-1.5 text-sm font-medium"
            style={{
              backgroundColor: filter === f.key ? "var(--accent)" : "transparent",
              color: filter === f.key ? "#fff" : "var(--ink-muted)",
              border: "1px solid var(--line)",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>
      <ul className="space-y-4">
        {list.map((p) => (
          <li key={p.title} className="rounded-2xl p-6 transition-shadow hover:shadow-lg" style={{ backgroundColor: "var(--bg-soft)", border: "1px solid var(--line)" }}>
            <a href={p.url} target="_blank" rel="noopener noreferrer">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-semibold leading-snug" style={{ color: "var(--ink)" }}>{p.title}</h3>
                <span className="shrink-0 text-sm font-medium" style={{ color: "var(--accent)" }}>{p.date}</span>
              </div>
              <p className="mt-1 text-sm" style={{ color: "var(--ink-muted)" }}>{p.authors}</p>
              <p className="mt-1 text-sm italic" style={{ color: "var(--ink-muted)" }}>{p.venue}</p>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 5: `Projects.tsx`** (draggable track of tilt cards)

```tsx
import { projects } from "@/data/projects";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { DragTrack } from "@/components/ui/DragTrack";
import { TiltCard } from "@/components/ui/TiltCard";
import { Chip } from "@/components/ui/Chip";

export function Projects() {
  return (
    <section id="projects" className="py-32">
      <div className="mx-auto mb-10 max-w-6xl px-6">
        <SectionTitle eyebrow="Projects" title="Things I've built" />
        <p className="text-sm" style={{ color: "var(--ink-muted)" }}>Drag to explore →</p>
      </div>
      <DragTrack className="px-6">
        {projects.map((p) => (
          <TiltCard key={p.name} className="w-80 shrink-0">
            <div className="flex h-full flex-col rounded-3xl p-7" style={{ backgroundColor: "var(--bg-soft)", border: "1px solid var(--line)" }}>
              <div className="mb-2 flex items-baseline justify-between">
                <h3 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>{p.name}</h3>
                {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-sm" style={{ color: "var(--accent)" }}>Visit ↗</a>}
              </div>
              <p className="mb-2 text-sm font-medium" style={{ color: "var(--accent)" }}>{p.tagline}</p>
              <p className="mb-4 flex-1 text-sm" style={{ color: "var(--ink-muted)" }}>{p.description}</p>
              <div className="flex flex-wrap gap-2">{p.tags.map((t) => <Chip key={t} label={t} />)}</div>
              {p.repo && <a href={p.repo} target="_blank" rel="noopener noreferrer" className="mt-3 text-sm" style={{ color: "var(--accent)" }}>GitHub ↗</a>}
            </div>
          </TiltCard>
        ))}
      </DragTrack>
    </section>
  );
}
```

- [ ] **Step 6: `ExperienceResearch.tsx`** (timeline filtered to research/both)

```tsx
import { experience } from "@/data/experience";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function ExperienceResearch() {
  const list = experience.filter((e) => e.world !== "music").sort((a, b) => b.start - a.start);
  return (
    <section id="experience" className="mx-auto max-w-4xl px-6 py-32">
      <SectionTitle eyebrow="Experience" title="Where I've worked" />
      <div className="relative border-l pl-8" style={{ borderColor: "var(--line)" }}>
        {list.map((e) => (
          <div key={`${e.org}-${e.role}`} className="relative mb-10">
            <span className="absolute -left-[37px] top-1 h-3 w-3 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-semibold">{e.role}</h3>
              <span className="text-sm font-medium" style={{ color: "var(--accent)" }}>{e.period}</span>
            </div>
            <p className="text-sm" style={{ color: "var(--ink-muted)" }}>{e.org} · {e.location}</p>
            <ul className="mt-2 space-y-1 text-sm" style={{ color: "var(--ink-muted)" }}>
              {e.points.map((pt) => <li key={pt}>• {pt}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 7: `Skills.tsx`**

```tsx
import { profile } from "@/data/profile";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Chip } from "@/components/ui/Chip";

export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-5xl px-6 py-32">
      <SectionTitle eyebrow="Skills" title="Tools of the trade" />
      <div className="grid gap-8 sm:grid-cols-2">
        {profile.skills.map((g) => (
          <div key={g.label}>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--accent)" }}>{g.label}</h3>
            <div className="flex flex-wrap gap-2">{g.items.map((s) => <Chip key={s} label={s} />)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add research world stages"
```

---

## Task 11: Music world stages

**Files:**
- Create: `src/components/stages/music/Intro.tsx`, `AboutMusic.tsx`, `Discography.tsx`, `Production.tsx`, `Featured.tsx`, `ExperienceMusic.tsx`

- [ ] **Step 1: `Intro.tsx`** (pinned, Waveform motif). Use the corrected non-conditional `useTransform` pattern from Task 10 Step 1.

```tsx
import { motion, useMotionValue, useTransform, type MotionValue } from "framer-motion";
import { PinnedStage } from "@/components/PinnedStage";
import { Waveform } from "@/components/motifs/Waveform";
import { profile } from "@/data/profile";
import { WORLDS } from "@/theme/worlds";

function Inner({ progress }: { progress: MotionValue<number> | null }) {
  const zero = useMotionValue(0);
  const src = progress ?? zero;
  const opacity = useTransform(src, [0, 0.6, 1], [1, 1, progress ? 0 : 1]);
  const y = useTransform(src, [0, 1], [0, progress ? -120 : 0]);
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 opacity-90">
        <Waveform />
      </div>
      <motion.div style={{ opacity, y }} className="relative z-10 mx-auto flex h-full max-w-5xl flex-col justify-center px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: "var(--accent)" }}>
          {WORLDS.music.role} · {profile.location}
        </p>
        <h1 className="mt-3 text-6xl font-bold sm:text-8xl" style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
          {profile.name}
        </h1>
        <p className="mt-4 max-w-xl text-lg" style={{ color: "var(--ink-muted)" }}>
          {profile.taglines.music}
        </p>
      </motion.div>
    </div>
  );
}

export function Intro() {
  return <PinnedStage id="intro" length={2}>{(p) => <Inner progress={p} />}</PinnedStage>;
}
```

- [ ] **Step 2: `AboutMusic.tsx`**

```tsx
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StatCounter } from "@/components/ui/StatCounter";
import { profile } from "@/data/profile";

export function AboutMusic() {
  return (
    <section id="about" className="mx-auto max-w-4xl px-6 py-32">
      <SectionTitle eyebrow="About" title="Producer & Artist" />
      <p className="text-xl leading-relaxed" style={{ color: "var(--ink-muted)" }}>
        {profile.about.music}
      </p>
      <div className="mt-16 grid grid-cols-3 gap-6">
        {profile.stats.music.map((s) => (
          <StatCounter key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: `Discography.tsx`** (draggable album cards with real art)

```tsx
import { discography } from "@/data/discography";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { DragTrack } from "@/components/ui/DragTrack";

export function Discography() {
  const sorted = [...discography].sort((a, b) => b.year - a.year);
  return (
    <section id="discography" className="py-32">
      <div className="mx-auto mb-10 max-w-6xl px-6">
        <SectionTitle eyebrow="Discography" title="Released as Darren Liu" />
        <p className="text-sm" style={{ color: "var(--ink-muted)" }}>Drag through the catalog →</p>
      </div>
      <DragTrack className="px-6">
        {sorted.map((r) => (
          <a key={r.title} href={r.url} target="_blank" rel="noopener noreferrer" className="group w-64 shrink-0">
            <div className="overflow-hidden rounded-2xl shadow-lg" style={{ border: "1px solid var(--line)" }}>
              <img src={r.artworkUrl} alt={r.title} loading="lazy" draggable={false} className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <p className="mt-3 font-semibold">{r.title}</p>
            <p className="text-xs uppercase tracking-wide" style={{ color: "var(--ink-muted)" }}>{r.type} · {r.year}</p>
          </a>
        ))}
      </DragTrack>
    </section>
  );
}
```

- [ ] **Step 4: `Production.tsx`**

```tsx
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
```

- [ ] **Step 5: `Featured.tsx`** (highlight a few singles)

```tsx
import { discography } from "@/data/discography";
import { SectionTitle } from "@/components/ui/SectionTitle";

const FEATURED = ["3am", "Bystander", "Telepath"];

export function Featured() {
  const picks = FEATURED.map((t) => discography.find((r) => r.title === t)).filter((r): r is NonNullable<typeof r> => Boolean(r));
  return (
    <section id="featured" className="mx-auto max-w-6xl px-6 py-32">
      <SectionTitle eyebrow="Featured" title="Recent singles" />
      <div className="grid gap-6 sm:grid-cols-3">
        {picks.map((r) => (
          <a key={r.title} href={r.url} target="_blank" rel="noopener noreferrer" className="group block">
            <div className="overflow-hidden rounded-2xl shadow-md" style={{ border: "1px solid var(--line)" }}>
              <img src={r.artworkUrl} alt={r.title} loading="lazy" className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <p className="mt-3 text-lg font-semibold">{r.title}</p>
            <p className="text-sm" style={{ color: "var(--ink-muted)" }}>Single · {r.year}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 6: `ExperienceMusic.tsx`** (timeline filtered to music/both)

```tsx
import { experience } from "@/data/experience";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function ExperienceMusic() {
  const list = experience.filter((e) => e.world !== "research").sort((a, b) => b.start - a.start);
  return (
    <section id="experience" className="mx-auto max-w-4xl px-6 py-32">
      <SectionTitle eyebrow="Experience" title="On the music side" />
      <div className="relative border-l pl-8" style={{ borderColor: "var(--line)" }}>
        {list.map((e) => (
          <div key={`${e.org}-${e.role}`} className="relative mb-10">
            <span className="absolute -left-[37px] top-1 h-3 w-3 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-semibold">{e.role}</h3>
              <span className="text-sm font-medium" style={{ color: "var(--accent)" }}>{e.period}</span>
            </div>
            <p className="text-sm" style={{ color: "var(--ink-muted)" }}>{e.org} · {e.location}</p>
            <ul className="mt-2 space-y-1 text-sm" style={{ color: "var(--ink-muted)" }}>
              {e.points.map((pt) => <li key={pt}>• {pt}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
```

NOTE: Silence Music is the only `music` entry; if the filtered list would otherwise be empty for some filter, that is fine here since Silence Music is tagged `music`.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add music world stages"
```

---

## Task 12: World route compositions (Contact shared inline)

**Files:**
- Create: `src/routes/ResearchWorld.tsx`, `src/routes/MusicWorld.tsx`

- [ ] **Step 1: Create `src/routes/ResearchWorld.tsx`**

```tsx
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
              <a key={c.label} href={c.href} target={c.href.startsWith("mailto:") ? undefined : "_blank"} rel="noopener noreferrer"
                 className="rounded-full px-5 py-2.5 text-sm font-medium" style={{ backgroundColor: "var(--bg-soft)", border: "1px solid var(--line)", color: "var(--ink)" }}>
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
```

- [ ] **Step 2: Create `src/routes/MusicWorld.tsx`**

```tsx
import { useEffect } from "react";
import { applyAccents } from "@/theme/worlds";
import { WorldNav } from "@/components/WorldNav";
import { PortalCTA } from "@/components/ui/PortalCTA";
import { profile } from "@/data/profile";
import { Intro } from "@/components/stages/music/Intro";
import { AboutMusic } from "@/components/stages/music/AboutMusic";
import { Discography } from "@/components/stages/music/Discography";
import { Production } from "@/components/stages/music/Production";
import { Featured } from "@/components/stages/music/Featured";
import { ExperienceMusic } from "@/components/stages/music/ExperienceMusic";

export function MusicWorld() {
  useEffect(() => {
    applyAccents("music");
  }, []);
  return (
    <>
      <WorldNav current="music" />
      <main>
        <Intro />
        <AboutMusic />
        <Discography />
        <Production />
        <Featured />
        <ExperienceMusic />
        <section id="contact" className="mx-auto max-w-5xl px-6 py-32">
          <div className="mb-12 flex flex-wrap gap-4">
            {profile.contacts.map((c) => (
              <a key={c.label} href={c.href} target={c.href.startsWith("mailto:") ? undefined : "_blank"} rel="noopener noreferrer"
                 className="rounded-full px-5 py-2.5 text-sm font-medium" style={{ backgroundColor: "var(--bg-soft)", border: "1px solid var(--line)", color: "var(--ink)" }}>
                {c.label} ↗
              </a>
            ))}
          </div>
          <PortalCTA to="research" />
          <footer className="mt-16 text-sm" style={{ color: "var(--ink-muted)" }}>
            © Darren Liu · Built with React, Vite & Framer Motion
          </footer>
        </section>
      </main>
    </>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: compose research and music world routes"
```

---

## Task 13: App routes + main.tsx + Lenis wiring

**Files:**
- Modify: `src/App.tsx`, `src/main.tsx`

- [ ] **Step 1: Replace `src/App.tsx`**

```tsx
import { Routes, Route } from "react-router-dom";
import { WipeProvider } from "@/components/WipeTransition";
import { useLenis } from "@/lib/useLenis";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { Landing } from "@/routes/Landing";
import { ResearchWorld } from "@/routes/ResearchWorld";
import { MusicWorld } from "@/routes/MusicWorld";

export default function App() {
  const reduced = useReducedMotion();
  useLenis(!reduced);
  return (
    <WipeProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/research" element={<ResearchWorld />} />
        <Route path="/music" element={<MusicWorld />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </WipeProvider>
  );
}
```

- [ ] **Step 2: Replace `src/main.tsx`** (wrap in BrowserRouter)

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "@/App";
import "@/styles/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

- [ ] **Step 3: Typecheck + build**

Run: `npm run build`
Expected: success (no TS errors, no leftover imports of deleted files).

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: PASS (data + worlds).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: wire routes, BrowserRouter, and Lenis smooth scroll"
```

---

## Task 14: Browser verification

**Files:** `temp/verify.py` (temporary)

- [ ] **Step 1: Start dev server and verify with Playwright**

Write `temp/verify.py` that:
- loads `/`, asserts two landing panels exist, screenshots `temp/landing.png`.
- navigates to `/research`, waits, scrolls through, asserts `#intro #about #research #publications #projects #experience #skills #contact` exist, checks an accent var equals `#0b4cff`, screenshots `temp/research.png`.
- navigates to `/music`, asserts `#intro #about #discography #production #featured #experience #contact` exist, checks accent `#ff2d78`, music images loaded 9/9, screenshots `temp/music.png`.
- collects console/page errors (expect none).

Run via:
```bash
python /Users/darren/.claude/skills/webapp-testing/scripts/with_server.py --server "npm run dev" --port 5173 -- python temp/verify.py
```
Expected: all assertions pass, 0 errors, music images 9/9.

- [ ] **Step 2: Verify reduced-motion**

Add to the script a context with `reduced_motion="reduce"`; load `/research`; confirm sections render statically (no sticky height errors) and content is visible.

- [ ] **Step 3: Inspect screenshots**

Open `temp/*.png`; confirm light theme, vivid accent blocks, legible content, pinned hero. Fix visual issues found.

- [ ] **Step 4: Clean up + commit any fixes**

```bash
rm -rf temp
git add -A
git commit -m "fix: address issues from browser verification" --allow-empty
```

---

## Task 15: Build + deploy

**Files:** none (deploy)

- [ ] **Step 1: Production build**

Run: `npm run build`
Expected: `dist/` produced.

- [ ] **Step 2: Deploy (outward-facing — user already authorized redeploy)**

Run: `firebase deploy --only hosting --project darren-40535`
Expected: deploy succeeds; Hosting URL `https://darren-40535.web.app`.

- [ ] **Step 3: Verify live**

Load `https://darren-40535.web.app` (landing), `/research`, `/music`; confirm routes resolve (SPA rewrite), accents correct, no console errors.

---

## Self-Review Notes

- **Spec coverage:** routing/3 views (T9, T12, T13), light theme + per-world accents (T2), pinned scroll stages + Lenis (T4, T5, T13), data divergence about/stats/world-tag (T3), research stages all 8 incl contact+portal (T10, T12), music stages incl contact+portal (T11, T12), signature interactions — landing hover-split (T9), motifs (T6), draggable tracks (T7 DragTrack used T10/T11), count-up (T7 StatCounter/T4), magnetic buttons (T7), wipe transition (T8), persistent switcher + end portal (T8 WorldNav, T7 PortalCTA), three.js removal (T1), reduced-motion fallbacks (T5 PinnedStage, motifs, App Lenis gate), deploy redeploy (T15). All spec sections map to tasks.
- **Type consistency:** `WorldKey`, `WORLDS`, `WORLD_KEYS`, `applyAccents`, `useStageProgress`, `useCountUp`, `useLenis`, `useReducedMotion`, `useCoarsePointer`, `useWipe`/`WipeProvider`, `PinnedStage` render-prop `(progress: MotionValue<number> | null)`, `ExperienceEntry.world`, `profile.about.{research,music}`, `profile.stats.{research,music}` are defined once and reused with matching names. Both `stages/research/Intro` and `stages/music/Intro` export `Intro` (imported under distinct paths — no collision).
- **Hooks rule fix:** Task 10 Step 1 documents and mandates the non-conditional `useTransform` pattern (always pass a real MotionValue via `useMotionValue(0)` fallback). Applied in both Intro stages.
- **Placeholder scan:** Task 14 describes the verification script in prose rather than full code; this is an acceptable verification task (no production code), but the implementer must write the script following the existing Task-18 pattern from the prior plan. All production-code steps include complete code.
