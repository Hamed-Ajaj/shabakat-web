import { useNavigate } from "react-router-dom";
import { useSettings } from "../../../providers/SettingsProvider";
import { SettingsScaffold } from "../components/SettingsScaffold";

export default function TriggerMessagePage() {
  const navigate = useNavigate();
  const { preferences, updatePreference } = useSettings();

  return (
    <SettingsScaffold title="Trigger Message">
      <div className="space-y-4">
        <label className="space-y-2">
          <span className="block text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Message</span>
          <textarea
            rows={8}
            value={preferences.triggerMessage}
            onChange={(event) => updatePreference("triggerMessage", event.target.value)}
            className="w-full rounded-2xl border border-black/6 bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary dark:border-white/8"
          />
        </label>
        <p className="text-sm leading-6 text-muted-foreground">Keep this under 1000 characters to match backend validation.</p>
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
