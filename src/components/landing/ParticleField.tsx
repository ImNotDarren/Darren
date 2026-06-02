import { useEffect, useRef } from "react";

interface ParticleFieldProps {
  /** rgb triples "r,g,b". */
  node: string;
  line: string;
  active: boolean;
  dimmed: boolean;
  reduced: boolean;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

/**
 * Animated data-node constellation. Nodes drift, link to nearby neighbours,
 * and lean toward the pointer. Used for the Research portal.
 */
export function ParticleField({ node, line, active, dimmed, reduced }: ParticleFieldProps) {
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
    let nodes: Node[] = [];
    let raf = 0;
    const mouse = { x: -9999, y: -9999, on: false };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.round((w * h) / 14000);
      const count = Math.max(28, Math.min(120, target));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.8,
      }));
    };

    const frame = () => {
      const { active: act, dimmed: dim } = stateRef.current;
      const linkDist = act ? 150 : 110;
      const speed = act ? 1.25 : 1;
      const globalAlpha = dim ? 0.35 : 1;
      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = globalAlpha;

      for (const n of nodes) {
        n.x += n.vx * speed;
        n.y += n.vy * speed;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        n.x = Math.max(0, Math.min(w, n.x));
        n.y = Math.max(0, Math.min(h, n.y));

        if (mouse.on) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 36000 && d2 > 1) {
            const f = (act ? 0.06 : 0.03) / Math.sqrt(d2);
            n.vx += dx * f;
            n.vy += dy * f;
          }
        }
        n.vx *= 0.985;
        n.vy *= 0.985;
      }

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < linkDist) {
            const alpha = (1 - dist / linkDist) * 0.55 * globalAlpha;
            ctx.strokeStyle = `rgba(${line},${alpha.toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        if (mouse.on) {
          const dist = Math.hypot(a.x - mouse.x, a.y - mouse.y);
          if (dist < linkDist * 1.4) {
            const alpha = (1 - dist / (linkDist * 1.4)) * 0.7 * globalAlpha;
            ctx.strokeStyle = `rgba(${node},${alpha.toFixed(3)})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(${node},${(0.9 * globalAlpha).toFixed(3)})`;
        ctx.shadowBlur = act ? 10 : 5;
        ctx.shadowColor = `rgba(${node},0.9)`;
        ctx.arc(n.x, n.y, n.r * (act ? 1.4 : 1), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.on = true;
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
      stateRef.current = { active: false, dimmed };
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
  }, [reduced, node, line]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
