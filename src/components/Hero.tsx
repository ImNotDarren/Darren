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
