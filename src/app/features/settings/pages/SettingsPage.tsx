import { Bell, CalendarDays, CirclePercent, Clock3, Image, Languages, MessageCircle, MessageSquareText, Package, Settings2, SunMoon, Wallet, Zap } from "lucide-react";
import { useAuth } from "../../../providers/AuthProvider";
import packageJson from "../../../../../package.json";
import { useI18n } from "../../../providers/I18nProvider";
import { useSettings } from "../../../providers/SettingsProvider";
import { Skeleton } from "../../../components/ui/skeleton";
import { NotificationToggleRow } from "../components/NotificationToggleRow";
import { SettingRowLink } from "../components/SettingRowLink";
import { SettingsSection } from "../components/SettingsSection";
import { ThemeSelector } from "../components/ThemeSelector";
import { useCompanyPreferencesQuery } from "../queries";
import { getLanguageLabel } from "../settingsMeta";

export default function SettingsPage() {
  const { session } = useAuth();
  const { preferences, resolvedTheme, updateNotification } = useSettings();
  const { t } = useI18n();
  const preferencesQuery = useCompanyPreferencesQuery();
  const companyPreferences = preferencesQuery.data;
  const dueDateLabel = companyPreferences ? t("settings.row.dueDateValue", { day: companyPreferences.dueDate }) : undefined;
  const triggerDateLabel = companyPreferences ? t("settings.row.triggerDateValue", { day: companyPreferences.triggerDate }) : undefined;
  const notConfiguredLabel = t("common.labels.notConfigured");
  const notSetLabel = t("common.labels.notSet");
  const languageValue = companyPreferences
    ? t(getLanguageLabel(companyPreferences.language) as "settings.language.en" | "settings.language.ar")
    : notConfiguredLabel;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <SettingsSection title={t("settings.appearance")}>
        <div className="px-4 pb-4 pt-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <SunMoon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{t("settings.row.theme")}</p>
              <p className="text-xs capitalize text-muted-foreground">
                {t("settings.subtitle.theme", {
                  theme: t(`settings.theme.${preferences.theme}` as "settings.theme.dark" | "settings.theme.light" | "settings.theme.system"),
                  resolvedTheme: t(`settings.theme.${resolvedTheme}` as "settings.theme.dark" | "settings.theme.light"),
                })}
              </p>
            </div>
          </div>
          <ThemeSelector />
        </div>
      </SettingsSection>

      <SettingsSection title={t("settings.companyPreferences")}>
        {preferencesQuery.isLoading ? (
          <SettingsLoadingRows />
        ) : preferencesQuery.error instanceof Error ? (
          <div className="px-4 py-4 text-sm text-red-300">{preferencesQuery.error.message}</div>
        ) : (
          <>
            <SettingRowLink
              to="/settings/pricing/price-per-kilowatt"
              icon={<Zap className="h-4 w-4" />}
              label={t("settings.row.pricePerKilowatt")}
              value={companyPreferences ? `${companyPreferences.pricing.pricePerKilowat.base}` : notConfiguredLabel}
            />
            <SettingRowLink
              to="/settings/pricing/price-per-amp"
              icon={<Zap className="h-4 w-4" />}
              label={t("settings.row.pricePerAmp")}
              value={companyPreferences ? `${companyPreferences.pricing.pricePerAmp.base}` : notConfiguredLabel}
            />
            <SettingRowLink
              to="/settings/pricing/fixed-charge"
              icon={<Wallet className="h-4 w-4" />}
              label={t("settings.row.fixedCharge")}
              value={companyPreferences ? `${companyPreferences.pricing.fixedCharge.base}` : notConfiguredLabel}
            />
            <SettingRowLink
              to="/settings/pricing/tva"
              icon={<CirclePercent className="h-4 w-4" />}
              label={t("settings.row.tva")}
              value={companyPreferences ? `${companyPreferences.pricing.tva.base}%` : notConfiguredLabel}
            />
            <SettingRowLink
              to="/settings/language"
              icon={<Languages className="h-4 w-4" />}
              label={t("settings.row.language")}
              value={languageValue}
            />
            <SettingRowLink
              to="/settings/due-date"
              icon={<CalendarDays className="h-4 w-4" />}
              label={t("settings.row.dueDate")}
              value={dueDateLabel ?? notConfiguredLabel}
            />
            <SettingRowLink
              to="/settings/trigger-date"
              icon={<CalendarDays className="h-4 w-4" />}
              label={t("settings.row.triggerDate")}
              value={triggerDateLabel ?? notConfiguredLabel}
            />
            <SettingRowLink
              to="/settings/trigger-message"
              icon={<MessageSquareText className="h-4 w-4" />}
              label={t("settings.row.triggerMessage")}
              value={companyPreferences?.triggerMessage || notSetLabel}
            />
            <SettingRowLink
              to="/settings/ampere-schedule-pricing"
              icon={<Zap className="h-4 w-4" />}
              label={t("settings.row.ampereSchedulePricing")}
              value={t(
                companyPreferences?.ampereSchedulePricingEnabled
                  ? "settings.row.ampereSchedulePricingEnabled"
                  : "settings.row.ampereSchedulePricingDisabled",
              )}
            />
            <SettingRowLink
              to="/ampere-schedules"
              icon={<Clock3 className="h-4 w-4" />}
              label={t("settings.row.ampereSchedules")}
              value={t("settings.row.ampereSchedulesValue")}
            />
            <SettingRowLink
              to="/settings/company-logo"
              icon={<Image className="h-4 w-4" />}
              label={t("settings.row.companyLogo")}
              value={session?.logoUrl ? t("settings.row.companyLogoConfigured") : t("settings.row.companyLogoMissing")}
            />
            <SettingRowLink
              to="/settings/whatsapp"
              icon={<MessageCircle className="h-4 w-4" />}
              label={t("settings.row.whatsapp")}
              value={t("settings.row.whatsappValue")}
            />
          </>
        )}
      </SettingsSection>

      <SettingsSection title={t("settings.notifications")}>
        <NotificationToggleRow
          icon={<Bell className="h-4 w-4" />}
          label={t("settings.row.paymentReminders")}
          description={t("settings.row.paymentRemindersDescription")}
          checked={preferences.notifications.paymentReminders}
          onChange={(checked) => updateNotification("paymentReminders", checked)}
        />
        <NotificationToggleRow
          icon={<Settings2 className="h-4 w-4" />}
          label={t("settings.row.newSubscribers")}
          description={t("settings.row.newSubscribersDescription")}
          checked={preferences.notifications.newSubscribers}
          onChange={(checked) => updateNotification("newSubscribers", checked)}
        />
        <NotificationToggleRow
          icon={<Bell className="h-4 w-4" />}
          label={t("settings.row.overdueAlerts")}
          description={t("settings.row.overdueAlertsDescription")}
          checked={preferences.notifications.overdueAlerts}
          onChange={(checked) => updateNotification("overdueAlerts", checked)}
        />
      </SettingsSection>

      <SettingsSection title={t("settings.about")}>
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Package className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{t("settings.row.version")}</p>
          </div>
          <span className="text-sm text-muted-foreground">{packageJson.version}</span>
        </div>
      </SettingsSection>
    </div>
  );
}

function SettingsLoadingRows() {
  return Array.from({ length: 9 }).map((_, index) => (
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
