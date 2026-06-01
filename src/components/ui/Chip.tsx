interface ChipProps {
  label: string;
}

export function Chip({ label }: ChipProps) {
  return (
    <span
      className="inline-block rounded-full px-3 py-1 text-xs font-medium"
      style={{
        backgroundColor: "var(--c-accent-soft)",
        color: "var(--c-text)",
        border: "1px solid var(--c-border)",
      }}
    >
      {label}
    </span>
  );
}
