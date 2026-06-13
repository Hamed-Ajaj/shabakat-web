export interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({ children, className = "" }: Readonly<SectionCardProps>) {
  return (
    <section
      className={`rounded-2xl border border-white/8 bg-card ${className}`.trim()}
      style={{ borderColor: "var(--border)" }}
    >
      {children}
    </section>
  );
}
