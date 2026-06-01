import { useEffect, useState } from "react";
import { useCoarsePointer } from "@/lib/useReducedMotion";

export function CursorGlow() {
  const coarse = useCoarsePointer();
  const [pos, setPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    if (coarse) return;
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [coarse]);

  if (coarse) return null;
  return (
    <div
      className="pointer-events-none fixed z-[55] h-64 w-64 rounded-full"
      style={{
        left: pos.x - 128,
        top: pos.y - 128,
        background: "radial-gradient(circle, var(--c-glow), transparent 70%)",
        opacity: 0.5,
        mixBlendMode: "screen",
      }}
    />
  );
}
