import { apiRequest } from "../../shared/api/client";
import type { CompanyPreferences, CompanyPreferencesPayload, CompanyProfile } from "./types";

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
  ampereSchedulePricingEnabled: boolean;
  ampereProrateByDaysEnabled: boolean;
  language: "en" | "ar";
  dueDate: number;
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

interface UpdateProfileResponse {
  name: string;
  logoUrl: string | null;
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

export function uploadCompanyLogo(file: File, token: string) {
  const formData = new FormData();
  formData.append("file", file);

  return apiRequest<UpdateProfileResponse>(
    "/api/v1/company/profile",
    {
      method: "PUT",
      body: formData,
    },
    token,
  );
}

export function removeCompanyLogo(name: string, token: string) {
  return apiRequest<UpdateProfileResponse>(
    "/api/v1/company/profile",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        logoUrl: null,
      }),
    },
    token,
  );
}

export function mapProfileResponse(response: UpdateProfileResponse): CompanyProfile {
  return {
    name: response.name,
    logoUrl: response.logoUrl,
  };
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
    ampereSchedulePricingEnabled: preferences.ampereSchedulePricingEnabled,
    ampereProrateByDaysEnabled: preferences.ampereProrateByDaysEnabled,
    language: preferences.language,
    dueDate: preferences.dueDate,
    triggerDate: preferences.triggerDate,
    triggerMessage: preferences.triggerMessage.trim() ? preferences.triggerMessage.trim() : null,
  };
}

export function mapPreferencesResponse(response: GetPreferencesResponse): CompanyPreferences {
  return {
    ampereSchedulePricingEnabled: response.ampereSchedulePricingEnabled,
    ampereProrateByDaysEnabled: response.ampereProrateByDaysEnabled,
    language: response.language,
    dueDate: response.dueDate,
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
