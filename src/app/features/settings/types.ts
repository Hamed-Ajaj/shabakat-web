import type { TranslationKey } from "../../shared/i18n/messages";
import type { ThemeMode } from "../../providers/SettingsProvider";

export type PricingTier = "base" | "residential" | "commercial" | "industrial";
export type PricingField = "pricePerKilowat" | "pricePerAmp" | "fixedCharge" | "tva";
export type CompanyLanguage = "en" | "ar";

export interface PricingValues {
  base: number;
  residential: number;
  commercial: number;
  industrial: number;
}

export interface CompanyPreferences {
  ampereSchedulePricingEnabled: boolean;
  ampereProrateByDaysEnabled: boolean;
  language: CompanyLanguage;
  dueDate: number;
  triggerDate: number;
  triggerMessage: string;
  pricing: Record<PricingField, PricingValues>;
}

export interface CompanyProfile {
  name: string;
  logoUrl: string | null;
}

export interface CompanyPreferencesPayload {
  pricePerKilowat: number;
  pricePerAmp: number;
  fixedCharge: number;
  tva: number;
  residentialPricePerAmp: number;
  residentialPricePerKilowat: number;
  residentialFixedCharge: number;
  residentialTVA: number;
  commercialPricePerAmp: number;
  commercialPricePerKilowat: number;
  commercialFixedCharge: number;
  commercialTVA: number;
  industrialPricePerAmp: number;
  industrialPricePerKilowat: number;
  industrialFixedCharge: number;
  industrialTVA: number;
  ampereSchedulePricingEnabled: boolean;
  ampereProrateByDaysEnabled: boolean;
  language: CompanyLanguage;
  dueDate: number;
  triggerDate: number;
  triggerMessage: string | null;
}

export interface SettingThemeOption {
  value: ThemeMode;
  label: TranslationKey;
  description: TranslationKey;
}
