import type { CompanyLanguage, PricingField, PricingTier, SettingThemeOption } from "./types";

export const themeOptions: SettingThemeOption[] = [
  { value: "light", label: "settings.theme.light", description: "settings.theme.description.light" },
  { value: "dark", label: "settings.theme.dark", description: "settings.theme.description.dark" },
  { value: "system", label: "settings.theme.system", description: "settings.theme.description.system" },
];

export const pricingFieldMeta: Record<
  string,
  { field: PricingField; label: string; suffix?: string; fallbackMessage: string }
> = {
  "price-per-kilowatt": {
    field: "pricePerKilowat",
    label: "settings.row.pricePerKilowatt",
    fallbackMessage: "settings.pricing.fallbackMessage",
  },
  "price-per-amp": {
    field: "pricePerAmp",
    label: "settings.row.pricePerAmp",
    fallbackMessage: "settings.pricing.fallbackMessage",
  },
  "fixed-charge": {
    field: "fixedCharge",
    label: "settings.row.fixedCharge",
    fallbackMessage: "settings.pricing.fallbackMessage",
  },
  "tva": {
    field: "tva",
    label: "settings.row.tva",
    suffix: "%",
    fallbackMessage: "settings.pricing.fallbackMessage",
  },
};

export const pricingTiers: Array<{ value: PricingTier; label: string }> = [
  { value: "base", label: "settings.pricing.tier.base" },
  { value: "residential", label: "settings.pricing.tier.residential" },
  { value: "commercial", label: "settings.pricing.tier.commercial" },
  { value: "industrial", label: "settings.pricing.tier.industrial" },
];

export const languageOptions: Array<{ value: CompanyLanguage; label: string }> = [
  { value: "en", label: "settings.language.en" },
  { value: "ar", label: "settings.language.ar" },
];

export function getLanguageLabel(language: CompanyLanguage) {
  return languageOptions.find((option) => option.value === language)?.label ?? language;
}
