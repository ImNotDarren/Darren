export function Chip({ label }: { label: string }) {
  return (
    <span
      className="inline-block rounded-full px-3 py-1 text-xs font-medium"
      style={{ backgroundColor: "var(--accent-soft)", color: "var(--ink)", border: "1px solid var(--line)" }}
    >
      {label}
    </span>
  );
}
