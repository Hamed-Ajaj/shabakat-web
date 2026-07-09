import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Switch } from "../../../components/ui/switch";
import { useAuth } from "../../../providers/AuthProvider";
import { useI18n } from "../../../providers/I18nProvider";
import { useAmpereSchedulesQuery } from "../../ampere-schedules/queries";
import { SettingsScaffold } from "../components/SettingsScaffold";
import { useSaveCompanyPreferencesMutation } from "../mutations";
import { useCompanyPreferencesQuery } from "../queries";
import { defaultCompanyPreferences } from "../values";

export default function AmpereSchedulePricingPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { t } = useI18n();
  const [enabled, setEnabled] = useState(false);
  const preferencesQuery = useCompanyPreferencesQuery();
  const schedulesQuery = useAmpereSchedulesQuery();
  const savePreferences = useSaveCompanyPreferencesMutation();
  const canManage = session?.role === "Owner" || session?.role === "Admin";
  const companyPreferences = preferencesQuery.data ?? defaultCompanyPreferences;
  const hasSchedules = (schedulesQuery.data?.length ?? 0) > 0;

  useEffect(() => {
    setEnabled(companyPreferences.ampereSchedulePricingEnabled);
  }, [companyPreferences.ampereSchedulePricingEnabled]);

  async function handleSave() {
    if (enabled && !hasSchedules) {
      toast.error(t("settings.ampereSchedulePricing.noSchedules"));
      return;
    }

    await savePreferences.mutateAsync({
      ...companyPreferences,
      ampereSchedulePricingEnabled: enabled,
    });

    toast.success(t("settings.preferences.saved"));
    navigate("/settings");
  }

  return (
    <SettingsScaffold title={t("settings.title.ampereSchedulePricing")}>
      <div className="space-y-4">
        {preferencesQuery.isLoading ? <p className="text-sm text-muted-foreground">{t("common.labels.loadingCompanyPreferences")}</p> : null}
        {preferencesQuery.error instanceof Error ? <p className="text-sm text-red-300">{preferencesQuery.error.message}</p> : null}
        {schedulesQuery.error instanceof Error ? <p className="text-sm text-red-300">{schedulesQuery.error.message}</p> : null}

        <div className="rounded-2xl border border-black/6 bg-background px-4 py-4 dark:border-white/8">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">{t("settings.row.ampereSchedulePricing")}</p>
              <p className="text-sm text-muted-foreground">{t("settings.ampereSchedulePricing.helper")}</p>
            </div>
            <Switch
              checked={enabled}
              onCheckedChange={setEnabled}
              disabled={
                !canManage ||
                preferencesQuery.isLoading ||
                schedulesQuery.isLoading ||
                savePreferences.isPending ||
                (!companyPreferences.ampereSchedulePricingEnabled && !hasSchedules)
              }
            />
          </div>
        </div>

        <p className="text-sm leading-6 text-muted-foreground">{t("settings.ampereSchedulePricing.description")}</p>
        {!hasSchedules && !companyPreferences.ampereSchedulePricingEnabled ? (
          <p className="text-sm text-amber-300">{t("settings.ampereSchedulePricing.noSchedules")}</p>
        ) : null}
        {!canManage ? <p className="text-sm text-muted-foreground">{t("settings.permissions.onlyAdmin")}</p> : null}
        {savePreferences.error instanceof Error ? <p className="text-sm text-red-300">{savePreferences.error.message}</p> : null}
        <button
          type="button"
          onClick={handleSave}
          disabled={!canManage || preferencesQuery.isLoading || schedulesQuery.isLoading || savePreferences.isPending}
          className="w-full rounded-2xl bg-secondary px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary/80"
        >
          {savePreferences.isPending ? t("common.actions.saving") : t("common.actions.save")}
        </button>
      </div>
    </SettingsScaffold>
  );
}
