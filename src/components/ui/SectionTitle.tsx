interface SectionTitleProps {
  eyebrow: string;
  title: string;
}

export function SectionTitle({ eyebrow, title }: SectionTitleProps) {
  return (
    <header className="mb-10">
      <p
        className="mb-2 text-sm font-medium uppercase tracking-[0.25em]"
        style={{ color: "var(--c-accent)" }}
      >
        {eyebrow}
      </p>
      <h2
        className="text-3xl font-bold sm:text-4xl"
        style={{ fontFamily: "var(--font-display)", color: "var(--c-text)" }}
      >
        {title}
      </h2>
    </header>
  );
}
