import { useNavigate } from "react-router-dom";
import { useSettings } from "../../../providers/SettingsProvider";
import { SettingsScaffold } from "../components/SettingsScaffold";

const languages = ["English", "Arabic", "French"];

export default function LanguageSettingPage() {
  const navigate = useNavigate();
  const { preferences, updatePreference } = useSettings();

  return (
    <SettingsScaffold title="Language">
      <div className="space-y-3">
        {languages.map((language) => {
          const active = preferences.language === language;
          return (
            <button
              key={language}
              type="button"
              onClick={() => updatePreference("language", language)}
              className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all ${
                active ? "border-primary bg-primary/8 text-foreground" : "border-black/6 bg-background text-foreground dark:border-white/8"
              }`}
            >
              <span className="text-sm font-medium">{language}</span>
              {active ? <span className="text-xs font-semibold text-primary">Selected</span> : null}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => navigate("/settings")}
          className="mt-6 w-full rounded-2xl bg-secondary px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary/80"
        >
          Save
        </button>
      </div>
    </SettingsScaffold>
  );
}
