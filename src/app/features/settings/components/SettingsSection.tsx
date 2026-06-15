export interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export function SettingsSection({ title, children }: Readonly<SettingsSectionProps>) {
  return (
    <section className="space-y-2">
      <h2 className="px-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        {title}
      </h2>
      <div className="overflow-hidden rounded-3xl border border-black/6 bg-card shadow-[0_10px_30px_rgba(0,0,0,0.04)] dark:border-white/8 dark:shadow-none">
        {children}
      </div>
    </section>
  );
}
