import { AlertCircle, ArrowRight } from "lucide-react";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../providers/AuthProvider";
import { AppLogo } from "../../../shared/components/AppLogo";

export default function LoginPage() {
  const { hasHydrated, isAuthenticated, isLoggingIn, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const redirectTo =
    (location.state as { from?: string } | null)?.from ?? "/dashboard";

  useEffect(() => {
    if (hasHydrated && isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [hasHydrated, isAuthenticated, navigate, redirectTo]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    setError("");

    try {
      await login(email, password);
      startTransition(() => navigate(redirectTo, { replace: true }));
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to sign in.",
      );
    }
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,192,0,0.18),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.12),transparent_22%)]" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/8 bg-card/90 shadow-[0_40px_120px_rgba(0,0,0,0.55)] backdrop-blur xl:grid-cols-[1.15fr_0.85fr]">
        <div className="hidden border-r border-white/8 p-10 xl:block">
          <AppLogo />
          <div className="mt-16 max-w-lg">
            <p className="text-sm uppercase tracking-[0.3em] text-primary">
              Operations Control
            </p>
            <h1 className="mt-4 text-5xl font-semibold leading-tight text-foreground">
              Run subscriptions, billing, and reminders from one clean
              workspace.
            </h1>
          </div>
        </div>

        <div className="p-6 sm:p-8 xl:p-10">
          <div className="xl:hidden">
            <AppLogo />
          </div>

          <div className="mt-8 max-w-md">
            <p className="text-sm uppercase tracking-[0.3em] text-primary">
              Secure Sign In
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-foreground">
              Welcome back
            </h2>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm text-foreground">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="owner@nour.com"
                className="w-full rounded-2xl border border-white/8 bg-secondary px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm text-foreground">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Password123!"
                className="w-full rounded-2xl border border-white/8 bg-secondary px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
              />
            </div>

            <div className="rounded-2xl border border-white/8 bg-secondary/60 px-4 py-3 text-xs text-muted-foreground">
              Seeded local account: <span className="font-medium text-foreground">owner@nour.com</span> / <span className="font-medium text-foreground">Password123!</span>
            </div>

            {error ? (
              <div className="flex items-center gap-2 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isPending || isLoggingIn}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
              style={{ boxShadow: "0 0 20px rgba(245,192,0,0.22)" }}
            >
              {isPending || isLoggingIn ? "Signing in..." : "Enter workspace"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
