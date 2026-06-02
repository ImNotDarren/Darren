import { useRef, type ReactNode } from "react";
import { useCoarsePointer } from "@/lib/useReducedMotion";

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  primary?: boolean;
}

export function MagneticButton({ children, href, onClick, primary }: MagneticButtonProps) {
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
    <a
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="inline-flex cursor-pointer items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-transform"
      style={{
        backgroundColor: primary ? "var(--accent)" : "transparent",
        color: primary ? "#fff" : "var(--ink)",
        border: primary ? "none" : "1px solid var(--line)",
      }}
    >
      {children}
    </a>
  );
}
