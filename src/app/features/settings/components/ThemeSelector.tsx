import { Laptop, Moon, Sun } from "lucide-react";
import { useI18n } from "../../../providers/I18nProvider";
import { useSettings } from "../../../providers/SettingsProvider";
import { themeOptions } from "../settingsMeta";

const icons = {
  light: Sun,
  dark: Moon,
  system: Laptop,
};

export function ThemeSelector() {
  const { preferences, setTheme } = useSettings();
  const { t } = useI18n();

  return (
    <div className="grid grid-cols-3 gap-3">
      {themeOptions.map((option) => {
        const active = preferences.theme === option.value;
        const Icon = icons[option.value];

        return (
          <button
            key={option.value}
            onClick={() => setTheme(option.value)}
            className={`rounded-2xl border px-3 py-3 text-center transition-all ${
              active
                ? "border-primary bg-primary/8 text-primary shadow-[0_0_0_1px_rgba(245,192,0,0.25)]"
                : "border-black/6 bg-background text-muted-foreground hover:text-foreground dark:border-white/8"
            }`}
            >
            <Icon className="mx-auto h-4 w-4" />
            <span className="mt-2 block text-xs font-medium">{t(option.label)}</span>
          </button>
        );
      })}
    </div>
  );
}
