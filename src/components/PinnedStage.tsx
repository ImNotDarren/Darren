import { type ReactNode } from "react";
import { type MotionValue } from "framer-motion";
import { useStageProgress } from "@/lib/useScrollProgress";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface PinnedStageProps {
  /** Total scroll length as a multiple of viewport height (e.g. 2.5 => 250vh). */
  length?: number;
  /** Render prop receives 0..1 progress through the stage, or null under reduced motion. */
  children: (progress: MotionValue<number> | null) => ReactNode;
  id?: string;
  className?: string;
}

/**
 * A tall wrapper containing a sticky full-height panel. Scrolling through the
 * wrapper drives `progress` 0..1. Under reduced motion it renders a static panel
 * (progress = null) so children show their final state.
 */
export function PinnedStage({ length = 2, children, id, className }: PinnedStageProps) {
  const { ref, progress } = useStageProgress();
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <section id={id} className={className}>
        <div className="flex min-h-screen items-center">{children(null)}</div>
      </section>
    );
  }

  return (
    <section id={id} ref={ref} style={{ height: `${length * 100}vh` }} className={className}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {children(progress)}
      </div>
    </section>
  );
}
