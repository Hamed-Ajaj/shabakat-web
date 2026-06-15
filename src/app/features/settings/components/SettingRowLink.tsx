import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export interface SettingRowLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  value?: string;
}

export function SettingRowLink({ to, icon, label, value }: Readonly<SettingRowLinkProps>) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 border-b border-black/5 px-4 py-4 transition-colors last:border-b-0 hover:bg-black/[0.02] dark:border-white/8 dark:hover:bg-white/[0.03]"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {value ? <p className="truncate text-xs text-muted-foreground">{value}</p> : null}
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}
