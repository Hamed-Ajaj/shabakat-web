import { Suspense, lazy } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AppShell } from "../shell/AppShell";
import { ProtectedRoute } from "./ProtectedRoute";

const DashboardPage = lazy(() => import("../features/dashboard/pages/DashboardPage"));
const SubscribersPage = lazy(() => import("../features/subscribers/pages/SubscribersPage"));
const InvoicesPage = lazy(() => import("../features/invoices/pages/InvoicesPage"));
const SettingsPage = lazy(() => import("../features/settings/pages/SettingsPage"));
const PricingSettingPage = lazy(() => import("../features/settings/pages/PricingSettingPage"));
const TriggerMessagePage = lazy(() => import("../features/settings/pages/TriggerMessagePage"));
const TriggerDatePage = lazy(() => import("../features/settings/pages/TriggerDatePage"));
const LanguageSettingPage = lazy(() => import("../features/settings/pages/LanguageSettingPage"));
const LoginPage = lazy(() => import("../features/auth/pages/LoginPage"));

function ShellLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

function RouteFallback() {
  return (
    <div className="min-h-dvh bg-background px-6 py-10 text-muted-foreground">
      Loading workspace...
    </div>
  );
}

export function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          element={
            <ProtectedRoute>
              <ShellLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/subscribers" element={<SubscribersPage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/pricing/:field" element={<PricingSettingPage />} />
          <Route path="/settings/trigger-date" element={<TriggerDatePage />} />
          <Route path="/settings/trigger-message" element={<TriggerMessagePage />} />
          <Route path="/settings/language" element={<LanguageSettingPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
