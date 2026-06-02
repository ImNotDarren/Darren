import { useRef, type ReactNode } from "react";
import { motion } from "framer-motion";

interface DragTrackProps {
  children: ReactNode;
  className?: string;
}

export function DragTrack({ children, className }: DragTrackProps) {
  const constraints = useRef<HTMLDivElement>(null);
  return (
    <div ref={constraints} className={`overflow-hidden ${className ?? ""}`}>
      <motion.div drag="x" dragConstraints={constraints} dragElastic={0.08} className="flex cursor-grab gap-6 active:cursor-grabbing">
        {children}
      </motion.div>
    </div>
  );
}
