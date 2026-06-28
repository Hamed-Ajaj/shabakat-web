import { Zap } from "lucide-react";
import { useAuth } from "../../providers/AuthProvider";

export function AppLogo() {
  const { session } = useAuth();
  const companyName = session?.companyName ?? "Shabakat";
  const logoUrl = session?.logoUrl ?? null;

  return (
    <div className="flex items-center gap-2.5">
      {logoUrl ? (
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-black/6 bg-card dark:border-white/8">
          <img src={logoUrl} alt={`${companyName} logo`} className="h-full w-full object-cover" />
        </div>
      ) : (
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"
          style={{ boxShadow: "0 0 20px rgba(245,192,0,0.35)" }}
        >
          <Zap className="h-5 w-5" fill="currentColor" />
        </div>
      )}
      <div>
        <p className="text-sm font-bold leading-tight text-foreground">{companyName}</p>
        <p className="text-xs leading-tight text-muted-foreground">Generator operations</p>
      </div>
    </div>
  );
}
