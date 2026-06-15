import { Bell, CalendarDays, CirclePercent, Languages, MessageSquareText, Package, Settings2, SunMoon, Wallet, Zap } from "lucide-react";
import packageJson from "../../../../../package.json";
import { useSettings } from "../../../providers/SettingsProvider";
import { NotificationToggleRow } from "../components/NotificationToggleRow";
import { SettingRowLink } from "../components/SettingRowLink";
import { SettingsSection } from "../components/SettingsSection";
import { ThemeSelector } from "../components/ThemeSelector";

export default function SettingsPage() {
  const { preferences, resolvedTheme, updateNotification } = useSettings();
  const triggerDateLabel = `${preferences.triggerDate}${getOrdinal(preferences.triggerDate)} of month`;

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
        <SettingRowLink to="/settings/pricing/price-per-kilowatt" icon={<Zap className="h-4 w-4" />} label="Price per Kilowatt" value={`${preferences.pricing.pricePerKilowat.base}`} />
        <SettingRowLink to="/settings/pricing/price-per-amp" icon={<Zap className="h-4 w-4" />} label="Price per Amp" value={`${preferences.pricing.pricePerAmp.base}`} />
        <SettingRowLink to="/settings/pricing/fixed-charge" icon={<Wallet className="h-4 w-4" />} label="Fixed Charge" value={`${preferences.pricing.fixedCharge.base}`} />
        <SettingRowLink to="/settings/pricing/tva" icon={<CirclePercent className="h-4 w-4" />} label="TVA (%)" value={`${preferences.pricing.tva.base}%`} />
        <SettingRowLink to="/settings/language" icon={<Languages className="h-4 w-4" />} label="Language" value={preferences.language} />
        <SettingRowLink to="/settings/trigger-date" icon={<CalendarDays className="h-4 w-4" />} label="Trigger Date" value={triggerDateLabel} />
        <SettingRowLink to="/settings/trigger-message" icon={<MessageSquareText className="h-4 w-4" />} label="Trigger Message" value={preferences.triggerMessage || "Not set"} />
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

function getOrdinal(day: number) {
  if (day >= 11 && day <= 13) return "th";
  const lastDigit = day % 10;
  if (lastDigit === 1) return "st";
  if (lastDigit === 2) return "nd";
  if (lastDigit === 3) return "rd";
  return "th";
}
