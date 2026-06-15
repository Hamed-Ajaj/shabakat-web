import { useNavigate } from "react-router-dom";
import { useSettings } from "../../../providers/SettingsProvider";
import { SettingsScaffold } from "../components/SettingsScaffold";

export default function TriggerDatePage() {
  const navigate = useNavigate();
  const { preferences, updatePreference } = useSettings();

  return (
    <SettingsScaffold title="Trigger Date">
      <div className="space-y-4">
        <label className="space-y-2">
          <span className="block text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Day of month</span>
          <input
            type="number"
            min={1}
            max={28}
            value={preferences.triggerDate}
            onChange={(event) => updatePreference("triggerDate", Number(event.target.value || 1))}
            className="w-full rounded-2xl border border-black/6 bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary dark:border-white/8"
          />
        </label>
        <p className="text-sm leading-6 text-muted-foreground">Backend validation allows trigger dates between 1 and 28.</p>
        <button
          type="button"
          onClick={() => navigate("/settings")}
          className="w-full rounded-2xl bg-secondary px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary/80"
        >
          Save
        </button>
      </div>
    </SettingsScaffold>
  );
}
