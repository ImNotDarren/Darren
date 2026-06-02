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
    <main className="relative h-screen w-screen overflow-hidden">
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
