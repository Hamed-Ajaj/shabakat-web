import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ThemeMode = "light" | "dark" | "system";
export type PricingTier = "base" | "residential" | "commercial" | "industrial";
export type PricingField = "pricePerKilowat" | "pricePerAmp" | "fixedCharge" | "tva";

export interface PricingValues {
  base: number;
  residential: number;
  commercial: number;
  industrial: number;
}

export interface NotificationSettings {
  paymentReminders: boolean;
  newSubscribers: boolean;
  overdueAlerts: boolean;
}

export interface CompanyPreferencesState {
  theme: ThemeMode;
  language: string;
  triggerDate: number;
  triggerMessage: string;
  notifications: NotificationSettings;
  pricing: Record<PricingField, PricingValues>;
}

interface SettingsContextValue {
  preferences: CompanyPreferencesState;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: ThemeMode) => void;
  updatePreference: <K extends keyof CompanyPreferencesState>(key: K, value: CompanyPreferencesState[K]) => void;
  updatePricingValue: (field: PricingField, tier: PricingTier, value: number) => void;
  updateNotification: (key: keyof NotificationSettings, value: boolean) => void;
}

const STORAGE_KEY = "shabakat-settings";

const defaultPreferences: CompanyPreferencesState = {
  theme: "light",
  language: "English",
  triggerDate: 5,
  triggerMessage: "Your monthly generator subscription is due soon. Please arrange payment before the trigger date.",
  notifications: {
    paymentReminders: false,
    newSubscribers: false,
    overdueAlerts: false,
  },
  pricing: {
    pricePerKilowat: { base: 0.8, residential: 0, commercial: 0, industrial: 0 },
    pricePerAmp: { base: 15, residential: 0, commercial: 0, industrial: 0 },
    fixedCharge: { base: 10, residential: 0, commercial: 0, industrial: 0 },
    tva: { base: 11, residential: 0, commercial: 0, industrial: 0 },
  },
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

function resolveSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function SettingsProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [preferences, setPreferences] = useState<CompanyPreferencesState>(() => {
    if (typeof window === "undefined") {
      return defaultPreferences;
    }

    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return defaultPreferences;
    }

    try {
      return { ...defaultPreferences, ...JSON.parse(saved) };
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      return defaultPreferences;
    }
  });
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const nextTheme = preferences.theme === "system" ? resolveSystemTheme() : preferences.theme;
      document.documentElement.dataset.theme = nextTheme;
      setResolvedTheme(nextTheme);
    };

    applyTheme();
    mediaQuery.addEventListener("change", applyTheme);

    return () => mediaQuery.removeEventListener("change", applyTheme);
  }, [preferences.theme]);

  function setTheme(theme: ThemeMode) {
    setPreferences((current) => ({ ...current, theme }));
  }

  function updatePreference<K extends keyof CompanyPreferencesState>(key: K, value: CompanyPreferencesState[K]) {
    setPreferences((current) => ({ ...current, [key]: value }));
  }

  function updatePricingValue(field: PricingField, tier: PricingTier, value: number) {
    setPreferences((current) => ({
      ...current,
      pricing: {
        ...current.pricing,
        [field]: {
          ...current.pricing[field],
          [tier]: value,
        },
      },
    }));
  }

  function updateNotification(key: keyof NotificationSettings, value: boolean) {
    setPreferences((current) => ({
      ...current,
      notifications: {
        ...current.notifications,
        [key]: value,
      },
    }));
  }

  const contextValue = useMemo(
    () => ({
      preferences,
      resolvedTheme,
      setTheme,
      updatePreference,
      updatePricingValue,
      updateNotification,
    }),
    [preferences, resolvedTheme],
  );

  return <SettingsContext.Provider value={contextValue}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used inside SettingsProvider.");
  }
  return context;
}
