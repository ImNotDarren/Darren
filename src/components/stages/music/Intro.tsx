import { motion, useMotionValue, useTransform, type MotionValue } from "framer-motion";
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
  return (
    <section id="intro" className="relative h-screen">
      <Inner progress={null} />
    </section>
  );
}
