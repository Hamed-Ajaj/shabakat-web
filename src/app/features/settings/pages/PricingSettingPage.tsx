import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../../providers/AuthProvider";
import { useI18n } from "../../../providers/I18nProvider";
import { SettingsScaffold } from "../components/SettingsScaffold";
import { pricingFieldMeta, pricingTiers } from "../settingsMeta";
import { useSaveCompanyPreferencesMutation } from "../mutations";
import { useCompanyPreferencesQuery } from "../queries";
import { pricingValueSchema, tvaValueSchema } from "../schema";
import type { PricingTier } from "../types";
import { defaultCompanyPreferences } from "../values";

export default function PricingSettingPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { t } = useI18n();
  const { field: fieldParam = "" } = useParams();
  const fieldMeta = pricingFieldMeta[fieldParam];
  const [tier, setTier] = useState<PricingTier>("base");
  const [value, setValue] = useState("0");
  const preferencesQuery = useCompanyPreferencesQuery();
  const savePreferences = useSaveCompanyPreferencesMutation();
  const canManage = session?.role === "Owner" || session?.role === "Admin";
  const companyPreferences = preferencesQuery.data ?? defaultCompanyPreferences;

  useEffect(() => {
    if (!fieldMeta) {
      navigate("/settings", { replace: true });
      return;
    }

    setValue(String(companyPreferences.pricing[fieldMeta.field][tier]));
  }, [companyPreferences, fieldMeta, navigate, tier]);

  if (!fieldMeta) {
    return null;
  }

  async function handleSave() {
    const schema = fieldMeta.field === "tva" ? tvaValueSchema : pricingValueSchema;
    const parsed = schema.safeParse(value);

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? t("settings.validation.invalidValue"));
      return;
    }

    const nextPreferences = {
      ...companyPreferences,
      pricing: {
        ...companyPreferences.pricing,
        [fieldMeta.field]: {
          ...companyPreferences.pricing[fieldMeta.field],
          [tier]: parsed.data,
        },
      },
    };

    await savePreferences.mutateAsync(nextPreferences);
    toast.success(t("settings.preferences.saved"));
    navigate("/settings");
  }

  return (
    <SettingsScaffold title={t(fieldMeta.label as never)}>
      <div className="space-y-4">
        {preferencesQuery.isLoading ? <p className="text-sm text-muted-foreground">{t("common.labels.loadingCompanyPreferences")}</p> : null}
        {preferencesQuery.error instanceof Error ? <p className="text-sm text-red-300">{preferencesQuery.error.message}</p> : null}
        <div className="grid gap-3 sm:grid-cols-[180px_1fr]">
          <label className="space-y-1">
            <span className="block text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{t("settings.pricing.customerType")}</span>
            <select
              value={tier}
              onChange={(event) => setTier(event.target.value as PricingTier)}
              className="w-full rounded-2xl border border-black/6 bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary dark:border-white/8"
            >
              {pricingTiers.map((option) => (
                <option key={option.value} value={option.value}>{t(option.label as never)}</option>
              ))}
            </select>
          </label>

          <label className="space-y-1">
            <span className="block text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{t("settings.pricing.value")}</span>
            <input
              type="number"
              step="0.01"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              className="w-full rounded-2xl border border-black/6 bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary dark:border-white/8"
            />
          </label>
        </div>

        <p className="max-w-md text-sm leading-6 text-muted-foreground">{t(fieldMeta.fallbackMessage as never)}</p>
        {!canManage ? <p className="text-sm text-muted-foreground">{t("settings.permissions.onlyAdmin")}</p> : null}
        {savePreferences.error instanceof Error ? <p className="text-sm text-red-300">{savePreferences.error.message}</p> : null}

        <div className="pt-6">
          <button
            type="button"
            onClick={handleSave}
            disabled={!canManage || preferencesQuery.isLoading || savePreferences.isPending}
            className="w-full rounded-2xl bg-secondary px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary/80"
          >
            {savePreferences.isPending ? t("common.actions.saving") : t("common.actions.save")}
          </button>
        </div>
      </div>
    </SettingsScaffold>
  );
}
