import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSettings, type PricingTier } from "../../../providers/SettingsProvider";
import { SettingsScaffold } from "../components/SettingsScaffold";
import { pricingFieldMeta, pricingTiers } from "../settingsMeta";

export default function PricingSettingPage() {
  const navigate = useNavigate();
  const { field: fieldParam = "" } = useParams();
  const { preferences, updatePricingValue } = useSettings();
  const fieldMeta = pricingFieldMeta[fieldParam];
  const [tier, setTier] = useState<PricingTier>("base");

  if (!fieldMeta) {
    navigate("/settings", { replace: true });
    return null;
  }

  const value = preferences.pricing[fieldMeta.field][tier];

  return (
    <SettingsScaffold title={fieldMeta.label}>
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-[180px_1fr]">
          <label className="space-y-1">
            <span className="block text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Customer type</span>
            <select
              value={tier}
              onChange={(event) => setTier(event.target.value as PricingTier)}
              className="w-full rounded-2xl border border-black/6 bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary dark:border-white/8"
            >
              {pricingTiers.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className="space-y-1">
            <span className="block text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Price</span>
            <input
              type="number"
              step="0.01"
              value={value}
              onChange={(event) => updatePricingValue(fieldMeta.field, tier, Number(event.target.value || 0))}
              className="w-full rounded-2xl border border-black/6 bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary dark:border-white/8"
            />
          </label>
        </div>

        <p className="max-w-md text-sm leading-6 text-muted-foreground">{fieldMeta.fallbackMessage}</p>

        <div className="pt-6">
          <button
            type="button"
            onClick={() => navigate("/settings")}
            className="w-full rounded-2xl bg-secondary px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary/80"
          >
            Save
          </button>
        </div>
      </div>
    </SettingsScaffold>
  );
}
