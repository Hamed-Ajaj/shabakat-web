import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../../providers/AuthProvider";
import { useI18n } from "../../../providers/I18nProvider";
import { SettingsScaffold } from "../components/SettingsScaffold";
import { useSaveCompanyPreferencesMutation } from "../mutations";
import { useCompanyPreferencesQuery } from "../queries";
import { languageOptions } from "../settingsMeta";
import { languageSchema } from "../schema";
import { defaultCompanyPreferences } from "../values";

export default function LanguageSettingPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { setLocale, t } = useI18n();
  const [language, setLanguage] = useState<"en" | "ar">("en");
  const preferencesQuery = useCompanyPreferencesQuery();
  const savePreferences = useSaveCompanyPreferencesMutation();
  const canManage = session?.role === "Owner" || session?.role === "Admin";
  const companyPreferences = preferencesQuery.data ?? defaultCompanyPreferences;

  useEffect(() => {
    setLanguage(companyPreferences.language);
  }, [companyPreferences.language]);

  async function handleSave() {
    const parsed = languageSchema.safeParse(language);

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? t("settings.language.invalid"));
      return;
    }

    await savePreferences.mutateAsync({
      ...companyPreferences,
      language: parsed.data,
    });
    setLocale(parsed.data);
    toast.success(t("settings.language.saved"));
    navigate("/settings");
  }

  return (
    <SettingsScaffold title={t("settings.title.language")}>
      <div className="space-y-3">
        {preferencesQuery.isLoading ? <p className="text-sm text-muted-foreground">{t("common.labels.loadingCompanyPreferences")}</p> : null}
        {preferencesQuery.error instanceof Error ? <p className="text-sm text-red-300">{preferencesQuery.error.message}</p> : null}
        {languageOptions.map((option) => {
          const active = language === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setLanguage(option.value)}
              className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all ${
                active ? "border-primary bg-primary/8 text-foreground" : "border-black/6 bg-background text-foreground dark:border-white/8"
              }`}
            >
              <span className="text-sm font-medium">{t(option.label as "settings.language.en" | "settings.language.ar")}</span>
              {active ? <span className="text-xs font-semibold text-primary">{t("common.labels.selected")}</span> : null}
            </button>
          );
        })}
        {!canManage ? <p className="text-sm text-muted-foreground">{t("settings.language.onlyAdmin")}</p> : null}
        {savePreferences.error instanceof Error ? <p className="text-sm text-red-300">{savePreferences.error.message}</p> : null}
        <button
          type="button"
          onClick={handleSave}
          disabled={!canManage || preferencesQuery.isLoading || savePreferences.isPending}
          className="mt-6 w-full rounded-2xl bg-secondary px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary/80"
        >
          {savePreferences.isPending ? t("common.actions.saving") : t("common.actions.save")}
        </button>
      </div>
    </SettingsScaffold>
  );
}
