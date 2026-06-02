import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { upcomingSingle } from "@/data/discography";

/** Soft palette pulled from the Immature cover art. */
const PINK = "#f48fb6";
const PINK_DEEP = "#e35d92";
const CREAM = "#fff4f8";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  released: boolean;
}

function diff(target: Date): TimeLeft {
  const ms = target.getTime() - Date.now();
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, released: true };
  const s = Math.floor(ms / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    released: false,
  };
}

function useCountdown(target: Date): TimeLeft {
  const [left, setLeft] = useState(() => diff(target));
  useEffect(() => {
    const id = setInterval(() => setLeft(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);
  return left;
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span
        className="tabular-nums leading-none"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2.25rem, 6vw, 4rem)",
          fontWeight: 700,
          color: CREAM,
          textShadow: "0 2px 24px rgba(180,40,100,0.45)",
        }}
      >
        {String(value).padStart(2, "0")}
      </span>
      <span
        className="mt-1 text-xs font-semibold uppercase tracking-[0.25em]"
        style={{ color: "rgba(255,244,248,0.78)" }}
      >
        {label}
      </span>
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.12 * i, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function UpcomingSingle() {
  const reduced = useReducedMotion();
  const target = useMemo(() => upcomingSingle.releaseDate, []);
  const t = useCountdown(target);

  const reveal = (i: number) =>
    reduced
      ? {}
      : { variants: fadeUp, custom: i, initial: "hidden" as const, whileInView: "show" as const, viewport: { once: true, amount: 0.4 } };

  return (
    <section
      id="upcoming"
      className="relative isolate overflow-hidden"
      aria-label="Upcoming single: Immature"
      style={{
        background: `radial-gradient(120% 90% at 80% 0%, ${PINK} 0%, ${PINK_DEEP} 55%, #c2477d 100%)`,
      }}
    >
      {/* Soft light blooms for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(45% 45% at 15% 20%, rgba(255,255,255,0.35), transparent 70%), radial-gradient(40% 40% at 90% 85%, rgba(255,180,210,0.4), transparent 70%)",
        }}
      />
      {/* Grain overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-6 py-28 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left: type + countdown */}
        <div className="order-2 lg:order-1">
          <motion.p
            {...reveal(0)}
            className="text-sm font-semibold uppercase tracking-[0.4em]"
            style={{ color: CREAM }}
          >
            ✦ New Single
          </motion.p>

          <motion.h2
            {...reveal(1)}
            className="mt-4 leading-[0.88]"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(4rem, 13vw, 9rem)",
              color: CREAM,
              letterSpacing: "-0.02em",
              textShadow: "0 6px 40px rgba(150,30,85,0.45)",
            }}
          >
            Immature
          </motion.h2>

          <motion.p
            {...reveal(2)}
            className="mt-5 max-w-md text-lg"
            style={{ color: "rgba(255,244,248,0.9)" }}
          >
            The next chapter from <strong>Darren Liu</strong> arrives{" "}
            <span style={{ color: CREAM, fontWeight: 600 }}>{upcomingSingle.releaseLabel}</span>.
          </motion.p>

          <motion.div
            {...reveal(3)}
            className="mt-8 inline-flex items-center gap-5 rounded-2xl px-6 py-4"
            style={{
              background: "rgba(255,255,255,0.14)",
              border: "1px solid rgba(255,255,255,0.28)",
              backdropFilter: "blur(8px)",
            }}
          >
            {t.released ? (
              <span
                style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.75rem", color: CREAM }}
              >
                Out now
              </span>
            ) : (
              <>
                <Unit value={t.days} label="Days" />
                <span className="-mt-4 text-3xl" style={{ color: "rgba(255,244,248,0.5)" }}>:</span>
                <Unit value={t.hours} label="Hrs" />
                <span className="-mt-4 text-3xl" style={{ color: "rgba(255,244,248,0.5)" }}>:</span>
                <Unit value={t.minutes} label="Min" />
                <span className="-mt-4 text-3xl" style={{ color: "rgba(255,244,248,0.5)" }}>:</span>
                <Unit value={t.seconds} label="Sec" />
              </>
            )}
          </motion.div>

          <motion.p
            {...reveal(4)}
            className="mt-6 text-sm font-medium uppercase tracking-[0.18em]"
            style={{ color: "rgba(255,244,248,0.82)" }}
          >
            {upcomingSingle.credit}
          </motion.p>

          <motion.a
            {...reveal(5)}
            href={upcomingSingle.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
            style={{ background: CREAM, color: PINK_DEEP }}
          >
            Follow on Apple Music ↗
          </motion.a>
        </div>

        {/* Right: artwork */}
        <motion.div
          {...reveal(2)}
          className="order-1 flex justify-center lg:order-2"
        >
          <motion.div
            animate={reduced ? undefined : { y: [0, -16, 0] }}
            transition={reduced ? undefined : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-full max-w-md"
            style={{ rotate: "-2deg" }}
          >
            <div
              aria-hidden
              className="absolute -inset-6 rounded-[2rem] blur-2xl"
              style={{ background: "rgba(255,255,255,0.35)" }}
            />
            <img
              src={upcomingSingle.artworkUrl}
              alt="Immature single cover"
              className="relative aspect-square w-full rounded-[1.75rem] object-cover"
              style={{ boxShadow: "0 40px 80px -20px rgba(120,20,70,0.6)" }}
            />
            <span
              className="absolute -right-3 -top-3 rotate-6 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em]"
              style={{ background: PINK_DEEP, color: CREAM, boxShadow: "0 8px 24px rgba(120,20,70,0.5)" }}
            >
              Coming Soon
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Marquee strip */}
      <div className="relative overflow-hidden border-t py-4" style={{ borderColor: "rgba(255,255,255,0.25)" }}>
        <motion.div
          className="flex whitespace-nowrap"
          animate={reduced ? undefined : { x: ["0%", "-50%"] }}
          transition={reduced ? undefined : { duration: 22, repeat: Infinity, ease: "linear" }}
        >
          {Array.from({ length: 2 }).map((_, block) => (
            <span key={block} className="flex shrink-0">
              {Array.from({ length: 8 }).map((_, i) => (
                <span
                  key={i}
                  className="mx-6 text-2xl font-bold uppercase tracking-[0.2em]"
                  style={{ fontFamily: "var(--font-display)", color: "rgba(255,244,248,0.85)" }}
                >
                  Immature <span style={{ color: "rgba(255,244,248,0.4)" }}>✦</span>
                </span>
              ))}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
