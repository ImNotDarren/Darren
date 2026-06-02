import { useScroll, type MotionValue } from "framer-motion";
import { useRef, type RefObject } from "react";

/** Returns a ref to attach to a tall stage wrapper and the 0..1 scroll progress through it. */
export function useStageProgress(): {
  ref: RefObject<HTMLDivElement | null>;
  progress: MotionValue<number>;
} {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  return { ref, progress: scrollYProgress };
}
