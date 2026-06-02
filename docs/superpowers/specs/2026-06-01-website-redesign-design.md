# Personal Website Redesign — Design Spec

**Date:** 2026-06-01
**Owner:** Darren (Sizuo) Liu
**Supersedes presentation layer of:** `2026-06-01-personal-website-design.md` (data modules and Firebase deploy are reused)

## Goal

Rework the personal site from a single dark scroll into a playful, light, choose-your-path experience with two distinct content worlds (Research and Music) and Apple-style pinned, scroll-scrubbed animation. Redeploy over the live site at `darren-40535.web.app` once verified.

## What changes and what stays

- **Stays:** Vite + React + TypeScript + Tailwind v4 + Framer Motion + Vitest, the `data/*.ts` content modules, Firebase Hosting config, self-hosted album art in `public/album-art/`.
- **Removed:** `three`, `@react-three/fiber`, `@react-three/drei`, `@types/three`. The hero motifs become lighter 2D canvas/SVG, which fit the bright palette and the interactive moments better and cut the bundle.
- **Added:** `react-router-dom` 7 (three routes), `lenis` 1.3 (smooth scroll).
- **Theme:** rebuilt as a light system (white base, vivid per-world accents) instead of dark.

## Visual system (light with vivid pops)

- Canvas: white `#ffffff` / near-white `#f7f7f9`. Ink text `#0f0f12`, muted `#5b5b66`.
- Research accent: electric blue `#0b4cff` (with a lighter `#3b82f6` tint and soft `rgba(11,76,255,0.10)`).
- Music accent: hot pink `#ff2d78` with orange `#ff7a18` as the secondary, used as a gradient.
- Big color blocks and oversized display type (Space Grotesk) over Inter body. Accents drive buttons, section labels, color-block backgrounds, and motifs.
- Per-world accent values live in CSS custom properties set on a wrapper, so research and music pages re-theme without dark mode.

## Routing & top-level structure

Client-routed with `react-router-dom` (BrowserRouter; Firebase SPA rewrite already serves `index.html` for all paths):

- `/` — **Landing split.** Full-screen two panels divided by a diagonal seam. Left = Research (electric blue), right = Music (hot pink/orange). Name "Darren (Sizuo) Liu" sits across the seam with the prompt "Choose a world". Hovering a side expands it (the seam shifts, the other side dims) and previews the world. Clicking a side triggers a full-screen color-wipe transition and navigates into that world.
- `/research` — Research journey.
- `/music` — Music journey.

Crossover: a small persistent **world switcher** in the nav on both world pages, plus a prominent **end portal** ("Cross over to Music/Research") as the final stage of each journey. Browser back returns to the landing split.

## Pinned scroll-stage mechanism

A reusable `PinnedStage` component renders a tall outer wrapper (e.g. `300vh`) containing a `sticky top-0 h-screen` inner panel. A `useScroll({ target, offset: ["start start", "end end"] })` progress value drives child animations (translate/scale/opacity/clip) as the user scrubs. When progress completes the sticky panel releases and the next stage scrolls in. Lenis provides smooth scrolling that makes the scrub feel continuous.

Not every section needs pinning. Intro and content-heavy stages (publications) pin; lighter stages use ordinary scroll with staggered reveals. Pinned stages collapse to normal static sections under `prefers-reduced-motion`.

## Research journey (`/research`) stages

1. **Intro** — "Darren (Sizuo) Liu / Researcher". Cursor-reactive 2D data-node motif (canvas: points connected by lines that lean toward the pointer) in electric blue on white. Scroll cue.
2. **About (research framing)** — research-leaning bio paragraph plus animated stat counters that count up when in view: publications (12), research themes (4), PhD years.
3. **Research themes** — the 4 themes; cards translate/scale in on scrub within a pinned stage.
4. **Publications** — pinned list with the existing filter (All/Journal/Conference/Preprint); the result count animates on filter change. Sorted newest first.
5. **Projects** — technical projects (NutriCamp, CanBeWell, ModelMeetsData, CRCWeb, AlarmX) as tilt cards in a draggable horizontal track.
6. **Experience** — academic/industry timeline (Emory PhD, Nihon Kohden, Emory Information Analyst, Chinasoft). Music role omitted here.
7. **Skills** — grouped animated chips.
8. **Contact + portal** — contact links and a large "Cross over to Music" portal.

## Music journey (`/music`) stages

1. **Intro** — "Darren (Sizuo) Liu / Producer & Artist". **Interactive waveform** motif (canvas bars) that reacts to hover/scrub: bars rise toward the pointer; in pink/orange gradient.
2. **About (music framing)** — music-leaning bio plus counters: releases (9), albums (2), years producing.
3. **Discography** — real cover art as **draggable album cards** in a horizontal track; drag/scroll moves through releases; hover lifts a card. Each links to Apple Music.
4. **Production** — Silence Music credits and co-productions (Yichuan Wang's "Stop Daydreaming").
5. **Featured** — a few highlighted singles ("3am", "Bystander", "Telepath") with year and link.
6. **Experience (music)** — Silence Music timeline entry framed for the music world.
7. **Contact + portal** — contact links and a large "Cross over to Research" portal.

## Signature interactions (high playfulness)

Hover-expanding landing split with diagonal seam; full-screen color-wipe on world entry/switch; cursor-reactive data-node canvas (research) and scrubbable waveform canvas (music); draggable album/project card tracks; animated count-up numbers; magnetic buttons; pinned scroll choreography. All motion respects `prefers-reduced-motion` (motifs render a static frame, pinned stages become static sections, counters show final values, drag tracks become normal scroll).

## Data additions

- `profile.ts`: add `about.research` and `about.music` variants (keep a blended fallback), and per-world stat definitions.
- `experience.ts`: tag entries with `world: "research" | "music" | "both"` so each journey filters its own.
- New `data/worlds.ts`: small config for the two worlds (key, label, role line, accents, route).

## Component structure

```
src/
  main.tsx                      # BrowserRouter + Lenis provider
  App.tsx                       # <Routes>: / , /research , /music
  routes/
    Landing.tsx                 # split-screen entry
    ResearchWorld.tsx           # composes research stages
    MusicWorld.tsx              # composes music stages
  theme/worlds.ts               # world configs + applyAccents()
  lib/
    useReducedMotion.ts         # (kept)
    useLenis.ts                 # smooth scroll setup
    useScrollProgress.ts        # helper around useScroll for a target ref
    useCountUp.ts               # animated number hook
  components/
    WorldNav.tsx                # minimal nav + persistent world switcher
    WipeTransition.tsx          # full-screen color wipe on navigation
    PinnedStage.tsx             # sticky scrub wrapper
    motifs/DataNodes.tsx        # research canvas motif
    motifs/Waveform.tsx         # music canvas motif (interactive)
    ui/ (SectionTitle, MagneticButton, TiltCard, Chip, StatCounter, DragTrack, PortalCTA)
    stages/research/*           # Intro, AboutResearch, Themes, Publications, Projects, Experience, Skills
    stages/music/*              # Intro, AboutMusic, Discography, Production, Featured, Experience
  data/*                        # reused + additions above
```

Each file stays focused (target 150–250 lines, hard cap 400). `App.tsx` only wires routes; world files only compose stages; stage files own one section each.

## Accessibility & quality

Semantic landmarks and heading order per world; keyboard-operable landing (each panel is a link/button, Enter activates); visible focus; color contrast checked on white for both accents; `prefers-reduced-motion` fallbacks as above; drag tracks also operable by scroll/keyboard. Vitest covers data integrity (incl. new world tagging) and world-config completeness.

## Deployment

Build with `npm run build`; verify locally (Playwright) across landing, both worlds, reduced motion, and mobile; then `firebase deploy --only hosting --project darren-40535`, redeploying over the current live site. SPA rewrite already in `firebase.json`.

## Non-goals (YAGNI)

No backend/CMS, no audio playback (cards link out), no blog, no i18n, no SSR. No dark mode (light only).

## Risks

- Pinned-scroll + Lenis can feel janky if overused; limit pinned stages to intro + publications + theme reveals and keep scrub math simple.
- Canvas motifs on low-end mobile: cap particle/bar counts by viewport and fall back to a static frame under reduced motion.
- Route refresh on `/research` relies on the existing Firebase SPA rewrite (already configured).
