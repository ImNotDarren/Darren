import { useRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useCoarsePointer } from "@/lib/useReducedMotion";

interface MagneticButtonProps {
  children: ReactNode;
  href: string;
  primary?: boolean;
}

export function MagneticButton({ children, href, primary }: MagneticButtonProps) {
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
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold"
      style={{
        backgroundColor: primary ? "var(--c-accent)" : "transparent",
        color: primary ? "var(--c-bg)" : "var(--c-text)",
        border: primary ? "none" : "1px solid var(--c-border)",
        transition: "transform 0.2s ease",
      }}
    >
      {children}
    </motion.a>
  );
}
