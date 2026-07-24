import type { CompanyPreferences } from "./types";

export const defaultCompanyPreferences: CompanyPreferences = {
  ampereSchedulePricingEnabled: false,
  ampereProrateByDaysEnabled: false,
  language: "en",
  dueDate: 31,
  triggerDate: 1,
  triggerMessage: "",
  pricing: {
    pricePerKilowat: { base: 0, residential: 0, commercial: 0, industrial: 0 },
    pricePerAmp: { base: 0, residential: 0, commercial: 0, industrial: 0 },
    fixedCharge: { base: 0, residential: 0, commercial: 0, industrial: 0 },
    tva: { base: 11, residential: 11, commercial: 11, industrial: 11 },
  },
};
