# Personal Website — Design Spec

**Date:** 2026-06-01
**Owner:** Darren (Sizuo) Liu
**Goal:** A comprehensive, visually striking personal website that presents Darren as both a Biomedical Informatics PhD researcher and a music producer/recording artist. Built with Vite, deployed to Firebase Hosting (project `darren-40535`).

## Concept

A single-page scrolling site with a persistent **Researcher ⇄ Musician identity toggle** in the navigation. Toggling smoothly morphs the global palette and motion language. Content sections persist; styling reframes around the active identity. Default load is a blended hero styled toward the Researcher identity (professional-first), since academic/recruiter visitors are the primary audience.

- **Researcher mode:** deep navy/black canvas, cyan/violet accents, data/node-mesh motifs, precise sans typography.
- **Musician mode:** charcoal canvas, magenta/amber neon accents, waveform/equalizer motifs, looser expressive type.
- The transition is a color-morph driven by CSS custom properties animated via Framer Motion, not a hard cut.

## Tech Stack

- **Vite + React + TypeScript** (strict mode).
- **Tailwind CSS** with CSS-variable theming so the identity toggle re-themes the whole site by swapping variable values.
- **Framer Motion** for scroll-reveal, layout, and the identity morph.
- **three.js** (`@react-three/fiber` + `@react-three/drei`) for the WebGL hero: a particle field that morphs between a node-mesh (Researcher) and a waveform surface (Musician). Lazy-loaded; falls back to a static gradient when `prefers-reduced-motion` is set or WebGL is unavailable.
- Absolute imports via `tsconfig` path alias (`@/`).
- Component-per-section. Each section file kept focused (target 150–250 lines, hard cap 400 per the code-style rule).

## Architecture

```
src/
├── main.tsx                  # entry
├── App.tsx                   # layout, section composition, scroll container
├── theme/
│   ├── IdentityContext.tsx   # 'researcher' | 'musician' state + provider
│   └── palettes.ts           # CSS-variable value maps per identity
├── components/
│   ├── Nav.tsx               # sticky nav + identity toggle + section links
│   ├── HeroCanvas.tsx        # three.js particle hero (lazy)
│   ├── Hero.tsx              # hero text + CTAs, wraps HeroCanvas
│   ├── reveal/Reveal.tsx     # scroll-reveal wrapper (IntersectionObserver/Framer)
│   ├── ui/                   # MagneticButton, TiltCard, Chip, SectionTitle, cursor glow
│   └── sections/
│       ├── About.tsx
│       ├── Research.tsx
│       ├── Publications.tsx  # filter by year/type
│       ├── Projects.tsx      # TiltCard grid
│       ├── Music.tsx         # discography cover grid, links out
│       ├── Experience.tsx    # timeline
│       ├── Skills.tsx        # grouped animated chips
│       └── Contact.tsx       # links + footer
├── data/
│   ├── publications.ts       # typed records (title, authors, venue, year, type, url)
│   ├── projects.ts
│   ├── discography.ts        # albums/singles (title, year, type, artworkUrl, url)
│   ├── experience.ts
│   └── profile.ts            # name, taglines, contact links, skills groups
└── styles/index.css          # Tailwind + CSS variables + base
```

Data lives in typed `data/*.ts` modules so content edits never touch component logic. Each section component reads from one data module.

## Sections (scroll order)

1. **Hero** — WebGL particle hero, name, dual-identity tagline, CTAs (View research / Listen to music), scroll cue.
2. **About** — Short narrative bridging research and music; Atlanta; current PhD role.
3. **Research** — PhD focus and themes: LLM agents for health, nutrition AI, clinical NLP, physiological-signal ML.
4. **Publications** — All 11 records, filterable by year and type (journal / conference / preprint), each linking to source.
5. **Projects** — NutriCamp (nutricamp.ai), CanBeWell (canbewell.help), ModelMeetsData, CRCWeb, AlarmX; tech tags, live links, 3D tilt.
6. **Music** — Discography cover grid: albums *Murderer (US Version)* (2021), *Playboy (Deluxe) EP* (2021), *Darren* (2024); singles *3am* (2025), *Bystander*, *Hello*, *Telepath*, *Whispers of Return*, *Dream*. Producer credits (Silence Music; co-produced Yichuan Wang's *Stop Daydreaming*). Cover art links out to Apple Music / SoundCloud. Artwork URLs sourced from the iTunes Search API at build/author time.
7. **Experience** — Timeline: Emory (PhD, Information Analyst), Nihon Kohden America, Silence Music, Chinasoft International.
8. **Skills** — Grouped animated chips: Languages, Web & Mobile, ML & Data, Tools & Infra.
9. **Contact** — Email (darren.liu@emory.edu), LinkedIn, GitHub (ImNotDarren), Google Scholar, Apple Music. Footer with last-updated.

## Effects (performance-budgeted)

- three.js particle hero, lazy-loaded, reduced-motion + no-WebGL fallback to CSS gradient.
- Scroll-reveal via Framer Motion / IntersectionObserver.
- Magnetic buttons and 3D card tilt (desktop pointer only).
- Identity color-morph transition.
- Custom cursor glow (desktop only) and a section scroll-progress indicator.
- All motion gated behind `prefers-reduced-motion`.

## Accessibility & Quality

- Semantic landmarks, heading hierarchy, keyboard-navigable nav and toggle, visible focus states.
- Color contrast checked for both palettes.
- `prefers-reduced-motion` disables non-essential animation and the WebGL hero.
- Responsive: mobile-first; hero and grids reflow; effects degrade gracefully on touch.

## Deployment

- `firebase.json`: hosting `public: dist`, SPA rewrite `** -> /index.html`, ignore rules.
- `.firebaserc`: default project `darren-40535`.
- Build with `npm run build` (Vite -> `dist/`).
- `firebase deploy --only hosting` requires Darren's auth. Darren runs `! firebase login` in-session (or supplies a CI token); then deploy. Claude prepares everything and runs the build, confirms before the outward-facing deploy.

## Non-Goals (YAGNI)

- No CMS/backend, no contact form submission backend (mailto link only).
- No blog engine.
- No embedded audio players (cover art + outbound links only).
- No i18n in v1.

## Open Risks

- iTunes artwork URLs may change; store resolved URLs in `discography.ts` and self-host fallback if needed.
- WebGL performance on low-end mobile: mitigated by reduced particle count on small viewports and reduced-motion fallback.
