import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

export function Waveform() {
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
    let mouseX = -1e4;

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

    const barW = 6;
    const gap = 6;

    function colors(): [string, string] {
      const root = getComputedStyle(document.documentElement);
      return [
        root.getPropertyValue("--accent").trim() || "#ff2d78",
        root.getPropertyValue("--accent-2").trim() || "#ff7a18",
      ];
    }

    let raf = 0;
    let t = 0;
    function frame() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      const [c1, c2] = colors();
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, c1);
      grad.addColorStop(1, c2);
      ctx.fillStyle = grad;
      const n = Math.floor(w / (barW + gap));
      const mid = h / 2;
      for (let i = 0; i < n; i++) {
        const x = i * (barW + gap);
        const base = Math.sin(i * 0.35 + t) * 0.5 + 0.5;
        let amp = base * h * 0.28 + 4;
        const dist = Math.abs(x - mouseX);
        if (dist < 120) amp += (1 - dist / 120) * h * 0.22;
        const r = barW / 2;
        const top = mid - amp;
        const bot = mid + amp;
        ctx.beginPath();
        ctx.roundRect(x, top, barW, bot - top, r);
        ctx.fill();
      }
      if (!reduced) {
        t += 0.04;
        raf = requestAnimationFrame(frame);
      }
    }
    frame();

    function onMove(e: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
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
