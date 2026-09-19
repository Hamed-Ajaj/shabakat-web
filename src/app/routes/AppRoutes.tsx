import { Suspense, lazy } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { BoxesPageSkeleton } from "../features/boxes/components/BoxesPageSkeleton";
import { InvoicesPageSkeleton } from "../features/invoices/components/InvoicesPageSkeleton";
import { SubscribersPageSkeleton } from "../features/subscribers/components/SubscribersPageSkeleton";
import { AppShell } from "../shell/AppShell";
import { MarketingLayout } from "../features/marketing/components/MarketingLayout";
import { ProtectedRoute } from "./ProtectedRoute";

const DashboardPage = lazy(() => import("../features/dashboard/pages/DashboardPage"));
const AreasPage = lazy(() => import("../features/areas/pages/AreasPage"));
const AmpereSchedulesPage = lazy(() => import("../features/ampere-schedules/pages/AmpereSchedulesPage"));
const BoxesPage = lazy(() => import("../features/boxes/pages/BoxesPage"));
const SubscribersPage = lazy(() => import("../features/subscribers/pages/SubscribersPage"));
const InvoicesPage = lazy(() => import("../features/invoices/pages/InvoicesPage"));
const FixedKilowattCalculatorPage = lazy(() => import("../features/invoices/pages/FixedKilowattCalculatorPage"));
const ExpensesPage = lazy(() => import("../features/expenses/pages/ExpensesPage"));
const AuditLogsPage = lazy(() => import("../features/audit-logs/pages/AuditLogsPage"));
const SettingsPage = lazy(() => import("../features/settings/pages/SettingsPage"));
const PricingSettingPage = lazy(() => import("../features/settings/pages/PricingSettingPage"));
const DueDatePage = lazy(() => import("../features/settings/pages/DueDatePage"));
const TriggerMessagePage = lazy(() => import("../features/settings/pages/TriggerMessagePage"));
const TriggerDatePage = lazy(() => import("../features/settings/pages/TriggerDatePage"));
const LanguageSettingPage = lazy(() => import("../features/settings/pages/LanguageSettingPage"));
const CompanyLogoPage = lazy(() => import("../features/settings/pages/CompanyLogoPage"));
const AmpereSchedulePricingPage = lazy(() => import("../features/settings/pages/AmpereSchedulePricingPage"));
const AmpereProrationPage = lazy(() => import("../features/settings/pages/AmpereProrationPage"));
const WhatsAppConnectionPage = lazy(() => import("../features/settings/pages/WhatsAppConnectionPage"));
const ExcelExportColumnsPage = lazy(() => import("../features/settings/pages/ExcelExportColumnsPage"));
const LoginPage = lazy(() => import("../features/auth/pages/LoginPage"));
const LandingPage = lazy(() => import("../features/marketing/pages/LandingPage"));
const AboutPage = lazy(() => import("../features/marketing/pages/AboutPage"));
const ContactPage = lazy(() => import("../features/marketing/pages/ContactPage"));
const PrivacyPolicyPage = lazy(() => import("../features/marketing/pages/PrivacyPolicyPage"));
const TermsPage = lazy(() => import("../features/marketing/pages/TermsPage"));
const DataDeletionPage = lazy(() => import("../features/marketing/pages/DataDeletionPage"));

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
        <Route element={<MarketingLayout />}>
          <Route index element={<Suspense fallback={<MarketingFallback />}><LandingPage /></Suspense>} />
          <Route path="/about" element={<Suspense fallback={<MarketingFallback />}><AboutPage /></Suspense>} />
          <Route path="/contact" element={<Suspense fallback={<MarketingFallback />}><ContactPage /></Suspense>} />
          <Route path="/privacy" element={<Suspense fallback={<MarketingFallback />}><PrivacyPolicyPage /></Suspense>} />
          <Route path="/terms" element={<Suspense fallback={<MarketingFallback />}><TermsPage /></Suspense>} />
          <Route path="/data-deletion" element={<Suspense fallback={<MarketingFallback />}><DataDeletionPage /></Suspense>} />
        </Route>

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
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/areas" element={<AreasPage />} />
          <Route path="/ampere-schedules" element={<AmpereSchedulesPage />} />
          <Route path="/boxes" element={<BoxesPage />} />
          <Route path="/subscribers" element={<SubscribersPage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/calculator" element={<FixedKilowattCalculatorPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/notifications" element={<AuditLogsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/pricing/:field" element={<PricingSettingPage />} />
          <Route path="/settings/due-date" element={<DueDatePage />} />
          <Route path="/settings/trigger-date" element={<TriggerDatePage />} />
          <Route path="/settings/trigger-message" element={<TriggerMessagePage />} />
          <Route path="/settings/language" element={<LanguageSettingPage />} />
          <Route path="/settings/company-logo" element={<CompanyLogoPage />} />
          <Route path="/settings/ampere-schedule-pricing" element={<AmpereSchedulePricingPage />} />
          <Route path="/settings/ampere-proration" element={<AmpereProrationPage />} />
          <Route path="/settings/whatsapp" element={<WhatsAppConnectionPage />} />
          <Route path="/settings/excel-export" element={<ExcelExportColumnsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  );
}

function MarketingFallback() {
  return <div className="min-h-dvh bg-[#0B0B15]" />;
}
