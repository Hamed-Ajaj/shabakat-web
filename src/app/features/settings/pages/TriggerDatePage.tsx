import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../../providers/AuthProvider";
import { useI18n } from "../../../providers/I18nProvider";
import { SettingsScaffold } from "../components/SettingsScaffold";
import { useSaveCompanyPreferencesMutation } from "../mutations";
import { useCompanyPreferencesQuery } from "../queries";
import { triggerDateSchema } from "../schema";
import { defaultCompanyPreferences } from "../values";

export default function TriggerDatePage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { t } = useI18n();
  const [triggerDate, setTriggerDate] = useState("1");
  const preferencesQuery = useCompanyPreferencesQuery();
  const savePreferences = useSaveCompanyPreferencesMutation();
  const canManage = session?.role === "Owner" || session?.role === "Admin";
  const companyPreferences = preferencesQuery.data ?? defaultCompanyPreferences;

  useEffect(() => {
    setTriggerDate(String(companyPreferences.triggerDate));
  }, [companyPreferences.triggerDate]);

  async function handleSave() {
    const parsed = triggerDateSchema.safeParse(triggerDate);

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? t("settings.triggerDate.invalid"));
      return;
    }

    await savePreferences.mutateAsync({
      ...companyPreferences,
      triggerDate: parsed.data,
    });
    toast.success(t("settings.preferences.saved"));
    navigate("/settings");
  }

  return (
    <SettingsScaffold title={t("settings.title.triggerDate")}>
      <div className="space-y-4">
        {preferencesQuery.isLoading ? <p className="text-sm text-muted-foreground">{t("common.labels.loadingCompanyPreferences")}</p> : null}
        {preferencesQuery.error instanceof Error ? <p className="text-sm text-red-300">{preferencesQuery.error.message}</p> : null}
        <label className="space-y-2">
          <span className="block text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{t("settings.triggerDate.dayOfMonth")}</span>
          <input
            type="number"
            min={1}
            max={28}
            value={triggerDate}
            onChange={(event) => setTriggerDate(event.target.value)}
            className="w-full rounded-2xl border border-black/6 bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary dark:border-white/8"
          />
        </label>
        <p className="text-sm leading-6 text-muted-foreground">{t("settings.triggerDate.helper")}</p>
        {!canManage ? <p className="text-sm text-muted-foreground">{t("settings.permissions.onlyAdmin")}</p> : null}
        {savePreferences.error instanceof Error ? <p className="text-sm text-red-300">{savePreferences.error.message}</p> : null}
        <button
          type="button"
          onClick={handleSave}
          disabled={!canManage || preferencesQuery.isLoading || savePreferences.isPending}
          className="w-full rounded-2xl bg-secondary px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary/80"
        >
          {savePreferences.isPending ? t("common.actions.saving") : t("common.actions.save")}
        </button>
      </div>
    </SettingsScaffold>
  );
}
