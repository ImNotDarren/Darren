import { useRef, type ReactNode } from "react";
import { useCoarsePointer } from "@/lib/useReducedMotion";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

export function TiltCard({ children, className }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const coarse = useCoarsePointer();

  function onMove(e: React.MouseEvent) {
    if (coarse || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.transform = `perspective(800px) rotateY(${px * 7}deg) rotateX(${-py * 7}deg)`;
  }
  function onLeave() {
    if (ref.current) ref.current.style.transform = "perspective(800px) rotateY(0) rotateX(0)";
  }

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={className} style={{ transition: "transform 0.3s ease" }}>
      {children}
    </div>
  );
}
