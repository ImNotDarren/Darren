interface SectionTitleProps {
  eyebrow: string;
  title: string;
}

export function SectionTitle({ eyebrow, title }: SectionTitleProps) {
  return (
    <header className="mb-10">
      <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--accent)" }}>
        {eyebrow}
      </p>
      <h2 className="text-4xl font-bold sm:text-5xl" style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
        {title}
      </h2>
    </header>
  );
}
