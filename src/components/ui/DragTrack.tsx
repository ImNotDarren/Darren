import { type ReactNode } from "react";

interface DragTrackProps {
  children: ReactNode;
  className?: string;
}

export function DragTrack({ children, className }: DragTrackProps) {
  return (
    <div className={`overflow-x-auto overscroll-x-contain ${className ?? ""}`}>
      <div className="flex gap-6">{children}</div>
    </div>
  );
}
