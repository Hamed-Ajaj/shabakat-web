import { Suspense, lazy } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AppShell } from "../shell/AppShell";
import { ProtectedRoute } from "./ProtectedRoute";

const DashboardPage = lazy(() => import("../features/dashboard/pages/DashboardPage"));
const SubscribersPage = lazy(() => import("../features/subscribers/pages/SubscribersPage"));
const InvoicesPage = lazy(() => import("../features/invoices/pages/InvoicesPage"));
const NotificationsPage = lazy(() => import("../features/notifications/pages/NotificationsPage"));
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
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
