import { Suspense, lazy } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { BoxesPageSkeleton } from "../features/boxes/components/BoxesPageSkeleton";
import { InvoicesPageSkeleton } from "../features/invoices/components/InvoicesPageSkeleton";
import { SubscribersPageSkeleton } from "../features/subscribers/components/SubscribersPageSkeleton";
import { AppShell } from "../shell/AppShell";
import { ProtectedRoute } from "./ProtectedRoute";

const DashboardPage = lazy(() => import("../features/dashboard/pages/DashboardPage"));
const AreasPage = lazy(() => import("../features/areas/pages/AreasPage"));
const AmpereSchedulesPage = lazy(() => import("../features/ampere-schedules/pages/AmpereSchedulesPage"));
const BoxesPage = lazy(() => import("../features/boxes/pages/BoxesPage"));
const SubscribersPage = lazy(() => import("../features/subscribers/pages/SubscribersPage"));
const InvoicesPage = lazy(() => import("../features/invoices/pages/InvoicesPage"));
const ExpensesPage = lazy(() => import("../features/expenses/pages/ExpensesPage"));
const SettingsPage = lazy(() => import("../features/settings/pages/SettingsPage"));
const PricingSettingPage = lazy(() => import("../features/settings/pages/PricingSettingPage"));
const DueDatePage = lazy(() => import("../features/settings/pages/DueDatePage"));
const TriggerMessagePage = lazy(() => import("../features/settings/pages/TriggerMessagePage"));
const TriggerDatePage = lazy(() => import("../features/settings/pages/TriggerDatePage"));
const LanguageSettingPage = lazy(() => import("../features/settings/pages/LanguageSettingPage"));
const CompanyLogoPage = lazy(() => import("../features/settings/pages/CompanyLogoPage"));
const AmpereSchedulePricingPage = lazy(() => import("../features/settings/pages/AmpereSchedulePricingPage"));
const WhatsAppConnectionPage = lazy(() => import("../features/settings/pages/WhatsAppConnectionPage"));
const LoginPage = lazy(() => import("../features/auth/pages/LoginPage"));

function ShellLayout() {
  return (
    <AppShell>
      <Suspense fallback={<RouteFallback />}>
        <Outlet />
      </Suspense>
    </AppShell>
  );
}

function RouteFallback() {
  const { pathname } = useLocation();

  if (pathname.startsWith("/subscribers")) {
    return (
      <div className="px-6 py-6">
        <SubscribersPageSkeleton />
      </div>
    );
  }

  if (pathname.startsWith("/invoices")) {
    return (
      <div className="px-6 py-6">
        <InvoicesPageSkeleton />
      </div>
    );
  }

  if (pathname.startsWith("/boxes")) {
    return (
      <div className="px-6 py-6">
        <BoxesPageSkeleton />
      </div>
    );
  }

  return <div className="min-h-dvh bg-background px-6 py-10 text-muted-foreground">Loading workspace...</div>;
}

export function AppRoutes() {
  return (
      <Routes>
        <Route
          path="/login"
          element={(
            <Suspense fallback={<RouteFallback />}>
              <LoginPage />
            </Suspense>
          )}
        />
        <Route
          element={
            <ProtectedRoute>
              <ShellLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/areas" element={<AreasPage />} />
          <Route path="/ampere-schedules" element={<AmpereSchedulesPage />} />
          <Route path="/boxes" element={<BoxesPage />} />
          <Route path="/subscribers" element={<SubscribersPage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/pricing/:field" element={<PricingSettingPage />} />
          <Route path="/settings/due-date" element={<DueDatePage />} />
          <Route path="/settings/trigger-date" element={<TriggerDatePage />} />
          <Route path="/settings/trigger-message" element={<TriggerMessagePage />} />
          <Route path="/settings/language" element={<LanguageSettingPage />} />
          <Route path="/settings/company-logo" element={<CompanyLogoPage />} />
          <Route path="/settings/ampere-schedule-pricing" element={<AmpereSchedulePricingPage />} />
          <Route path="/settings/whatsapp" element={<WhatsAppConnectionPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
  );
}
