import { apiRequest } from "../../shared/api/client";
import type { CompanyPreferences, CompanyPreferencesPayload } from "./types";

interface GetPreferencesResponse {
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
  language: "en" | "ar";
  triggerDate: number;
  triggerMessage: string | null;
}

interface NotConfiguredResponse {
  configured: false;
  message: string;
}

interface SavePreferencesResponse {
  message: string;
}

export async function fetchCompanyPreferences(token: string): Promise<CompanyPreferences | null> {
  const response = await apiRequest<GetPreferencesResponse | NotConfiguredResponse>(
    "/api/v1/company/preferences",
    undefined,
    token,
  );

  if ("configured" in response) {
    return null;
  }

  return mapPreferencesResponse(response);
}

export function saveCompanyPreferences(payload: CompanyPreferencesPayload, token: string) {
  return apiRequest<SavePreferencesResponse>(
    "/api/v1/company/preferences",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
    token,
  );
}

export function mapPreferencesToPayload(preferences: CompanyPreferences): CompanyPreferencesPayload {
  return {
    pricePerKilowat: preferences.pricing.pricePerKilowat.base,
    pricePerAmp: preferences.pricing.pricePerAmp.base,
    fixedCharge: preferences.pricing.fixedCharge.base,
    tva: preferences.pricing.tva.base,
    residentialPricePerAmp: preferences.pricing.pricePerAmp.residential,
    residentialPricePerKilowat: preferences.pricing.pricePerKilowat.residential,
    residentialFixedCharge: preferences.pricing.fixedCharge.residential,
    residentialTVA: preferences.pricing.tva.residential,
    commercialPricePerAmp: preferences.pricing.pricePerAmp.commercial,
    commercialPricePerKilowat: preferences.pricing.pricePerKilowat.commercial,
    commercialFixedCharge: preferences.pricing.fixedCharge.commercial,
    commercialTVA: preferences.pricing.tva.commercial,
    industrialPricePerAmp: preferences.pricing.pricePerAmp.industrial,
    industrialPricePerKilowat: preferences.pricing.pricePerKilowat.industrial,
    industrialFixedCharge: preferences.pricing.fixedCharge.industrial,
    industrialTVA: preferences.pricing.tva.industrial,
    language: preferences.language,
    triggerDate: preferences.triggerDate,
    triggerMessage: preferences.triggerMessage.trim() ? preferences.triggerMessage.trim() : null,
  };
}

export function mapPreferencesResponse(response: GetPreferencesResponse): CompanyPreferences {
  return {
    language: response.language,
    triggerDate: response.triggerDate,
    triggerMessage: response.triggerMessage ?? "",
    pricing: {
      pricePerKilowat: {
        base: response.pricePerKilowat,
        residential: response.residentialPricePerKilowat,
        commercial: response.commercialPricePerKilowat,
        industrial: response.industrialPricePerKilowat,
      },
      pricePerAmp: {
        base: response.pricePerAmp,
        residential: response.residentialPricePerAmp,
        commercial: response.commercialPricePerAmp,
        industrial: response.industrialPricePerAmp,
      },
      fixedCharge: {
        base: response.fixedCharge,
        residential: response.residentialFixedCharge,
        commercial: response.commercialFixedCharge,
        industrial: response.industrialFixedCharge,
      },
      tva: {
        base: response.tva,
        residential: response.residentialTVA,
        commercial: response.commercialTVA,
        industrial: response.industrialTVA,
      },
    },
  };
}
