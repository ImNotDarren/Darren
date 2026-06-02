import { useState } from "react";
import { motion } from "framer-motion";
import { WORLDS } from "@/theme/worlds";
import { useWipe } from "@/components/WipeTransition";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { profile } from "@/data/profile";
import { ParticleField } from "@/components/landing/ParticleField";
import { WaveField } from "@/components/landing/WaveField";
import { GrainOverlay, PortalRing } from "@/components/landing/LandingFx";

type Hover = "research" | "music" | null;

/** "r,g,b" triple from a #rrggbb hex. */
function rgb(hex: string): string {
  const n = parseInt(hex.replace("#", ""), 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}

const RESEARCH_TAGS = ["Biomedical Informatics", "AI for health", "Papers", "Projects"];
const MUSIC_TAGS = ["Producer", "Singer-songwriter", "Albums", "Singles"];

export function Landing() {
  const [hover, setHover] = useState<Hover>(null);
  const { wipeTo } = useWipe();
  const reduced = useReducedMotion();
  const r = WORLDS.research;
  const m = WORLDS.music;

  const researchFlex = hover === "research" ? 1.6 : hover === "music" ? 0.4 : 1;
  const musicFlex = hover === "music" ? 1.6 : hover === "research" ? 0.4 : 1;

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black">
      <div className="flex h-full w-full">
        <Panel
          side="left"
          world={r}
          active={hover === "research"}
          dimmed={hover === "music"}
          flex={researchFlex}
          tags={RESEARCH_TAGS}
          onEnter={() => setHover("research")}
          onLeave={() => setHover(null)}
          onClick={() => wipeTo(r.route, r.accent)}
          field={
            <ParticleField
              node={rgb("#dbe6ff")}
              line={rgb(r.accent2)}
              active={hover === "research"}
              dimmed={hover === "music"}
              reduced={reduced}
            />
          }
        />
        <Panel
          side="right"
          world={m}
          active={hover === "music"}
          dimmed={hover === "research"}
          flex={musicFlex}
          tags={MUSIC_TAGS}
          onEnter={() => setHover("music")}
          onLeave={() => setHover(null)}
          onClick={() => wipeTo(m.route, m.accent)}
          field={
            <WaveField
              c1={rgb(m.accent)}
              c2={rgb(m.accent2)}
              active={hover === "music"}
              dimmed={hover === "research"}
              reduced={reduced}
            />
          }
        />
      </div>

      {/* center seam beam */}
      <div className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-px -translate-x-1/2 bg-white/30 mix-blend-overlay" />

      <PortalRing reduced={reduced} />
      <GrainOverlay />

      {/* name + prompt */}
      <div className="pointer-events-none absolute inset-x-0 top-[8vh] z-40 flex flex-col items-center text-center">
        <motion.h1
          className="text-3xl font-bold tracking-tight text-white mix-blend-difference sm:text-5xl"
          style={{ fontFamily: "var(--font-display)" }}
          initial={reduced ? false : { y: -24, opacity: 0, filter: "blur(8px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {profile.name}
        </motion.h1>
        <motion.p
          className="mt-3 flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.45em] text-white mix-blend-difference"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <span className="inline-block h-px w-8 bg-white/60" />
          Choose a world
          <span className="inline-block h-px w-8 bg-white/60" />
        </motion.p>
      </div>

      {/* bottom hint */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-6 z-40 text-center text-[0.65rem] uppercase tracking-[0.35em] text-white/70 mix-blend-difference"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        Hover to explore · Click to enter
      </motion.div>
    </main>
  );
}

interface PanelProps {
  side: "left" | "right";
  world: (typeof WORLDS)[keyof typeof WORLDS];
  active: boolean;
  dimmed: boolean;
  flex: number;
  tags: string[];
  field: React.ReactNode;
  onEnter: () => void;
  onLeave: () => void;
  onClick: () => void;
}

function Panel({ side, world, active, dimmed, flex, tags, field, onEnter, onLeave, onClick }: PanelProps) {
  const innerEdge = side === "left" ? "right-0" : "left-0";
  return (
    <motion.button
      type="button"
      className="group relative flex h-full items-center justify-center overflow-hidden"
      style={{ background: `radial-gradient(120% 120% at ${side === "left" ? "30%" : "70%"} 40%, ${world.accent}, ${world.accent2} 55%, #05060a)` }}
      animate={{ flex }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
      aria-label={`Enter the ${world.label} world`}
    >
      {field}

      {/* depth vignette + dim layer */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{ background: "radial-gradient(80% 80% at 50% 45%, transparent 40%, rgba(0,0,0,0.55))", opacity: dimmed ? 0.85 : 0.5 }}
      />
      {/* inner edge glow toward the seam */}
      <div className={`pointer-events-none absolute inset-y-0 ${innerEdge} w-32`} style={{ background: `linear-gradient(${side === "left" ? "270deg" : "90deg"}, ${world.accent}, transparent)`, opacity: 0.35, mixBlendMode: "screen" }} />

      <motion.div
        className="relative z-10 px-6 text-white"
        animate={{ scale: active ? 1.06 : 1, y: active ? -4 : 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.p
          className="text-xs font-semibold uppercase tracking-[0.4em] text-white/80"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7 }}
        >
          {world.role}
        </motion.p>
        <motion.h2
          className="mt-3 text-6xl font-bold leading-none drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)] sm:text-8xl"
          style={{ fontFamily: "var(--font-display)" }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {world.label}
        </motion.h2>

        {/* tag chips reveal on hover */}
        <motion.div
          className="mt-6 flex flex-wrap justify-center gap-2"
          animate={{ opacity: active ? 1 : 0.55, y: active ? 0 : 6 }}
          transition={{ duration: 0.4 }}
        >
          {tags.map((tag) => (
            <span key={tag} className="rounded-full border border-white/40 bg-white/10 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-wider backdrop-blur-sm">
              {tag}
            </span>
          ))}
        </motion.div>

        <motion.span
          className="mt-7 inline-flex items-center gap-2 text-sm font-semibold tracking-wide"
          animate={{ opacity: active ? 1 : 0, x: active ? 0 : -8 }}
          transition={{ duration: 0.4 }}
        >
          Enter the {world.label.toLowerCase()} world
          <span aria-hidden>→</span>
        </motion.span>
      </motion.div>
    </motion.button>
  );
}
