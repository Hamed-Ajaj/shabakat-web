import { Bell, CalendarDays, CirclePercent, Languages, MessageSquareText, Package, Settings2, SunMoon, Wallet, Zap } from "lucide-react";
import packageJson from "../../../../../package.json";
import { useSettings } from "../../../providers/SettingsProvider";
import { Skeleton } from "../../../components/ui/skeleton";
import { NotificationToggleRow } from "../components/NotificationToggleRow";
import { SettingRowLink } from "../components/SettingRowLink";
import { SettingsSection } from "../components/SettingsSection";
import { ThemeSelector } from "../components/ThemeSelector";
import { useCompanyPreferencesQuery } from "../queries";
import { getLanguageLabel } from "../settingsMeta";

export default function SettingsPage() {
  const { preferences, resolvedTheme, updateNotification } = useSettings();
  const preferencesQuery = useCompanyPreferencesQuery();
  const companyPreferences = preferencesQuery.data;
  const triggerDateLabel = companyPreferences ? `${companyPreferences.triggerDate}${getOrdinal(companyPreferences.triggerDate)} of month` : undefined;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <SettingsSection title="Appearance">
        <div className="px-4 pb-4 pt-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <SunMoon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Theme</p>
              <p className="text-xs capitalize text-muted-foreground">{preferences.theme} · applied as {resolvedTheme}</p>
            </div>
          </div>
          <ThemeSelector />
        </div>
      </SettingsSection>

      <SettingsSection title="Company Preferences">
        {preferencesQuery.isLoading ? (
          <SettingsLoadingRows />
        ) : preferencesQuery.error instanceof Error ? (
          <div className="px-4 py-4 text-sm text-red-300">{preferencesQuery.error.message}</div>
        ) : (
          <>
            <SettingRowLink to="/settings/pricing/price-per-kilowatt" icon={<Zap className="h-4 w-4" />} label="Price per Kilowatt" value={companyPreferences ? `${companyPreferences.pricing.pricePerKilowat.base}` : "Not configured"} />
            <SettingRowLink to="/settings/pricing/price-per-amp" icon={<Zap className="h-4 w-4" />} label="Price per Amp" value={companyPreferences ? `${companyPreferences.pricing.pricePerAmp.base}` : "Not configured"} />
            <SettingRowLink to="/settings/pricing/fixed-charge" icon={<Wallet className="h-4 w-4" />} label="Fixed Charge" value={companyPreferences ? `${companyPreferences.pricing.fixedCharge.base}` : "Not configured"} />
            <SettingRowLink to="/settings/pricing/tva" icon={<CirclePercent className="h-4 w-4" />} label="TVA (%)" value={companyPreferences ? `${companyPreferences.pricing.tva.base}%` : "Not configured"} />
            <SettingRowLink to="/settings/language" icon={<Languages className="h-4 w-4" />} label="Language" value={companyPreferences ? getLanguageLabel(companyPreferences.language) : "Not configured"} />
            <SettingRowLink to="/settings/trigger-date" icon={<CalendarDays className="h-4 w-4" />} label="Trigger Date" value={triggerDateLabel ?? "Not configured"} />
            <SettingRowLink to="/settings/trigger-message" icon={<MessageSquareText className="h-4 w-4" />} label="Trigger Message" value={companyPreferences?.triggerMessage || "Not set"} />
          </>
        )}
      </SettingsSection>

      <SettingsSection title="Notifications">
        <NotificationToggleRow
          icon={<Bell className="h-4 w-4" />}
          label="Payment Reminders"
          description="Notify when payments are due"
          checked={preferences.notifications.paymentReminders}
          onChange={(checked) => updateNotification("paymentReminders", checked)}
        />
        <NotificationToggleRow
          icon={<Settings2 className="h-4 w-4" />}
          label="New Subscribers"
          description="Alert when a subscriber joins"
          checked={preferences.notifications.newSubscribers}
          onChange={(checked) => updateNotification("newSubscribers", checked)}
        />
        <NotificationToggleRow
          icon={<Bell className="h-4 w-4" />}
          label="Overdue Alerts"
          description="Warn about overdue invoices"
          checked={preferences.notifications.overdueAlerts}
          onChange={(checked) => updateNotification("overdueAlerts", checked)}
        />
      </SettingsSection>

      <SettingsSection title="About">
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Package className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Version</p>
          </div>
          <span className="text-sm text-muted-foreground">{packageJson.version}</span>
        </div>
      </SettingsSection>
    </div>
  );
}

function SettingsLoadingRows() {
  return Array.from({ length: 7 }).map((_, index) => (
    <div key={index} className="flex items-center gap-3 border-b border-black/5 px-4 py-4 last:border-b-0 dark:border-white/8">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="min-w-0 flex-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-2 h-3 w-28" />
      </div>
      <Skeleton className="h-4 w-4" />
    </div>
  ));
}

function getOrdinal(day: number) {
  if (day >= 11 && day <= 13) return "th";
  const lastDigit = day % 10;
  if (lastDigit === 1) return "st";
  if (lastDigit === 2) return "nd";
  if (lastDigit === 3) return "rd";
  return "th";
}
