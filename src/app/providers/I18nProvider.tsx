import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useCompanyPreferencesQuery } from "../features/settings/queries";
import type { CompanyLanguage } from "../features/settings/types";
import { messages, type Locale, type TranslationKey } from "../shared/i18n/messages";

type Direction = "ltr" | "rtl";

interface TranslateValues {
  [key: string]: number | string | undefined;
}

interface I18nContextValue {
  dir: Direction;
  isRtl: boolean;
  locale: Locale;
  setLocale: (locale: CompanyLanguage) => void;
  t: (key: TranslationKey, values?: TranslateValues) => string;
  formatCurrency: (value: number) => string;
  formatCompactCurrency: (value: number) => string;
  formatDate: (value: Date | string) => string;
  formatNumber: (value: number) => string;
}

const STORAGE_KEY = "shabakat-locale";
const I18nContext = createContext<I18nContextValue | null>(null);

function getDirection(locale: Locale): Direction {
  return locale === "ar" ? "rtl" : "ltr";
}

function getLocaleTag(locale: Locale) {
  return locale === "ar" ? "ar-LB" : "en-US";
}

function interpolate(template: string, values?: TranslateValues) {
  if (!values) {
    return template;
  }

  return Object.entries(values).reduce((result, [key, value]) => {
    return result.replaceAll(`{{${key}}}`, value == null ? "" : String(value));
  }, template);
}

export function I18nProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === "undefined") {
      return "en";
    }

    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved === "ar" ? "ar" : "en";
  });
  const preferencesQuery = useCompanyPreferencesQuery();

  useEffect(() => {
    if (preferencesQuery.data?.language && preferencesQuery.data.language !== locale) {
      setLocaleState(preferencesQuery.data.language);
    }
  }, [locale, preferencesQuery.data?.language]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = getDirection(locale);
  }, [locale]);

  const value = useMemo<I18nContextValue>(() => {
    const localeTag = getLocaleTag(locale);

    return {
      dir: getDirection(locale),
      isRtl: locale === "ar",
      locale,
      setLocale: (nextLocale) => setLocaleState(nextLocale),
      t: (key, values) => interpolate(messages[locale][key], values),
      formatCurrency: (amount) =>
        new Intl.NumberFormat(localeTag, {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(amount),
      formatCompactCurrency: (amount) =>
        new Intl.NumberFormat(localeTag, {
          style: "currency",
          currency: "USD",
          notation: "compact",
          maximumFractionDigits: 0,
        }).format(amount),
      formatDate: (value) =>
        new Intl.DateTimeFormat(locale === "ar" ? "ar-LB" : "en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(typeof value === "string" ? new Date(value) : value),
      formatNumber: (value) => new Intl.NumberFormat(localeTag).format(value),
    };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider.");
  }

  return context;
}
