import { BrowserRouter } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./providers/AuthProvider";
import { I18nProvider, useI18n } from "./providers/I18nProvider";
import { QueryProvider } from "./providers/QueryProvider";
import { SettingsProvider } from "./providers/SettingsProvider";
import { AppRoutes } from "./routes/AppRoutes";

export default function App() {
  return (
    <AuthProvider>
      <QueryProvider>
        <SettingsProvider>
          <I18nProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
            <AppToaster />
          </I18nProvider>
        </SettingsProvider>
      </QueryProvider>
    </AuthProvider>
  );
}

function AppToaster() {
  const { isRtl } = useI18n();

  return <Toaster richColors position={isRtl ? "top-left" : "top-right"} />;
}
