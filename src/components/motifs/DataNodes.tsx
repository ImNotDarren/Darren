import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export function DataNodes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -1e4, y: -1e4 };

    function resize() {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    const count = Math.min(70, Math.max(24, Math.floor(w / 16)));
    const nodes: Node[] = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
    }));

    function accent(): string {
      return getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#0b4cff";
    }

    let raf = 0;
    function frame() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      const color = accent();
      for (const n of nodes) {
        if (!reduced) {
          n.x += n.vx;
          n.y += n.vy;
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 14000) {
            n.x += dx * 0.0009;
            n.y += dy * 0.0009;
          }
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
        }
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 120) {
            ctx.globalAlpha = (1 - dist / 120) * 0.35;
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      for (const n of nodes) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduced) raf = requestAnimationFrame(frame);
    }
    frame();

    function onMove(e: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  return <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />;
}
