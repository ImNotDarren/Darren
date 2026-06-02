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
