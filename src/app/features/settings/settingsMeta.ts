import type { PricingField, PricingTier, ThemeMode } from "../../providers/SettingsProvider";

export const themeOptions: Array<{ value: ThemeMode; label: string; description: string }> = [
  { value: "light", label: "Light", description: "Bright surfaces for daytime work" },
  { value: "dark", label: "Dark", description: "Lower glare for night operations" },
  { value: "system", label: "System", description: "Follow the device preference" },
];

export const pricingFieldMeta: Record<
  string,
  { field: PricingField; label: string; suffix?: string; fallbackMessage: string }
> = {
  "price-per-kilowatt": {
    field: "pricePerKilowat",
    label: "Price per Kilowatt",
    fallbackMessage: "Used as the fallback for all customer types when no specific configuration is set.",
  },
  "price-per-amp": {
    field: "pricePerAmp",
    label: "Price per Amp",
    fallbackMessage: "Used as the fallback for all customer types when no specific configuration is set.",
  },
  "fixed-charge": {
    field: "fixedCharge",
    label: "Fixed Charge",
    fallbackMessage: "Used as the fallback for all customer types when no specific configuration is set.",
  },
  "tva": {
    field: "tva",
    label: "TVA (%)",
    suffix: "%",
    fallbackMessage: "Used as the fallback for all customer types when no specific configuration is set.",
  },
};

export const pricingTiers: Array<{ value: PricingTier; label: string }> = [
  { value: "base", label: "Base" },
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "industrial", label: "Industrial" },
];
