import { motion } from "framer-motion";

/** Fixed film-grain overlay built from an inline SVG turbulence texture. */
export function GrainOverlay() {
  const svg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.5'/></svg>`,
  );
  return (
    <div
      className="pointer-events-none absolute inset-0 z-30 opacity-[0.07] mix-blend-overlay"
      style={{ backgroundImage: `url("data:image/svg+xml,${svg}")`, backgroundSize: "160px 160px" }}
      aria-hidden
    />
  );
}

/** Rotating concentric portal ring that sits behind the name. */
export function PortalRing({ reduced }: { reduced: boolean }) {
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
      <motion.svg
        width="440"
        height="440"
        viewBox="0 0 440 440"
        className="opacity-70 mix-blend-difference"
        fill="none"
        stroke="#fff"
        animate={reduced ? undefined : { rotate: 360 }}
        transition={{ duration: 60, ease: "linear", repeat: Infinity }}
      >
        <circle cx="220" cy="220" r="150" strokeWidth="1" strokeDasharray="2 10" opacity="0.6" />
        <circle cx="220" cy="220" r="120" strokeWidth="0.6" opacity="0.4" />
        {Array.from({ length: 72 }).map((_, i) => {
          const a = (i / 72) * Math.PI * 2;
          const long = i % 6 === 0;
          const r1 = 168;
          const r2 = long ? 184 : 176;
          return (
            <line
              key={i}
              x1={220 + Math.cos(a) * r1}
              y1={220 + Math.sin(a) * r1}
              x2={220 + Math.cos(a) * r2}
              y2={220 + Math.sin(a) * r2}
              strokeWidth={long ? 1.4 : 0.7}
              opacity={long ? 0.8 : 0.4}
            />
          );
        })}
      </motion.svg>
    </div>
  );
}
