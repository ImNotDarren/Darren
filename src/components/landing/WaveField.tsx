import { useEffect, useRef } from "react";

interface WaveFieldProps {
  /** rgb triples "r,g,b". */
  c1: string;
  c2: string;
  active: boolean;
  dimmed: boolean;
  reduced: boolean;
}

interface Ring {
  x: number;
  y: number;
  r: number;
  life: number;
}

/**
 * Animated equalizer waveform with pointer-spawned sound rings.
 * Used for the Music portal.
 */
export function WaveField({ c1, c2, active, dimmed, reduced }: WaveFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ active, dimmed });
  stateRef.current = { active, dimmed };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let bars = 0;
    let phases: number[] = [];
    let freqs: number[] = [];
    let t = 0;
    let raf = 0;
    let ringClock = 0;
    const mouse = { x: -9999, y: -9999, on: false };
    const rings: Ring[] = [];

    const roundRectBottom = (x: number, y: number, width: number, height: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x, y + r);
      ctx.arcTo(x, y, x + r, y, r);
      ctx.lineTo(x + width - r, y);
      ctx.arcTo(x + width, y, x + width, y + r, r);
      ctx.lineTo(x + width, y + height);
      ctx.lineTo(x, y + height);
      ctx.closePath();
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bars = Math.max(24, Math.min(80, Math.round(w / 16)));
      phases = Array.from({ length: bars }, (_, i) => i * 0.5);
      freqs = Array.from({ length: bars }, () => 0.6 + Math.random() * 1.6);
    };

    const frame = () => {
      const { active: act, dimmed: dim } = stateRef.current;
      const globalAlpha = dim ? 0.4 : 1;
      const amp = act ? 1.5 : 1;
      t += act ? 0.05 : 0.03;
      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = globalAlpha;

      const grad = ctx.createLinearGradient(0, h, 0, h * 0.25);
      grad.addColorStop(0, `rgba(${c1},0.95)`);
      grad.addColorStop(1, `rgba(${c2},0.85)`);

      const bw = w / bars;
      for (let i = 0; i < bars; i++) {
        const x = i * bw;
        let base =
          (Math.sin(t * freqs[i] + phases[i]) * 0.5 + 0.5) * 0.45 +
          (Math.sin(t * 0.6 + i * 0.3) * 0.5 + 0.5) * 0.2;
        if (mouse.on) {
          const dx = Math.abs(x + bw / 2 - mouse.x);
          const bump = Math.max(0, 1 - dx / (bw * 5));
          base += bump * 0.5;
        }
        const bh = Math.min(h * 0.85, base * h * 0.6 * amp);
        const bx = x + bw * 0.18;
        const bwInner = bw * 0.64;
        ctx.fillStyle = grad;
        const radius = Math.min(bwInner / 2, 6);
        roundRectBottom(bx, h - bh, bwInner, bh, radius);
        ctx.fill();
        ctx.fillStyle = `rgba(255,255,255,${(0.25 * globalAlpha).toFixed(3)})`;
        ctx.fillRect(bx, h - bh, bwInner, 2);
      }

      for (let i = rings.length - 1; i >= 0; i--) {
        const ring = rings[i];
        ring.r += act ? 3.2 : 2.4;
        ring.life -= 0.012;
        if (ring.life <= 0) {
          rings.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = `rgba(255,255,255,${(ring.life * 0.5 * globalAlpha).toFixed(3)})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2);
        ctx.stroke();
      }

      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.on = true;
      ringClock++;
      if (ringClock % 6 === 0 && rings.length < 18) {
        rings.push({ x: mouse.x, y: mouse.y, r: 4, life: 1 });
      }
    };
    const onLeave = () => {
      mouse.on = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    if (reduced) {
      frame();
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced, c1, c2]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
