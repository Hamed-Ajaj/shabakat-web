import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../../providers/AuthProvider";
import { SettingsScaffold } from "../components/SettingsScaffold";
import { useSaveCompanyPreferencesMutation } from "../mutations";
import { useCompanyPreferencesQuery } from "../queries";
import { triggerMessageSchema } from "../schema";
import { defaultCompanyPreferences } from "../values";

export default function TriggerMessagePage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [triggerMessage, setTriggerMessage] = useState("");
  const preferencesQuery = useCompanyPreferencesQuery();
  const savePreferences = useSaveCompanyPreferencesMutation();
  const canManage = session?.role === "Owner" || session?.role === "Admin";
  const companyPreferences = preferencesQuery.data ?? defaultCompanyPreferences;

  useEffect(() => {
    setTriggerMessage(companyPreferences.triggerMessage);
  }, [companyPreferences.triggerMessage]);

  async function handleSave() {
    const parsed = triggerMessageSchema.safeParse(triggerMessage);

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid trigger message.");
      return;
    }

    await savePreferences.mutateAsync({
      ...companyPreferences,
      triggerMessage: parsed.data,
    });
    toast.success("Company preferences saved successfully.");
    navigate("/settings");
  }

  return (
    <SettingsScaffold title="Trigger Message">
      <div className="space-y-4">
        {preferencesQuery.isLoading ? <p className="text-sm text-muted-foreground">Loading company preferences...</p> : null}
        {preferencesQuery.error instanceof Error ? <p className="text-sm text-red-300">{preferencesQuery.error.message}</p> : null}
        <label className="space-y-2">
          <span className="block text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Message</span>
          <textarea
            rows={8}
            value={triggerMessage}
            onChange={(event) => setTriggerMessage(event.target.value)}
            className="w-full rounded-2xl border border-black/6 bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary dark:border-white/8"
          />
        </label>
        <p className="text-sm leading-6 text-muted-foreground">Keep this under 1000 characters to match backend validation.</p>
        {!canManage ? <p className="text-sm text-muted-foreground">Only Owner and Admin can update company preferences.</p> : null}
        {savePreferences.error instanceof Error ? <p className="text-sm text-red-300">{savePreferences.error.message}</p> : null}
        <button
          type="button"
          onClick={handleSave}
          disabled={!canManage || preferencesQuery.isLoading || savePreferences.isPending}
          className="w-full rounded-2xl bg-secondary px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary/80"
        >
          {savePreferences.isPending ? "Saving..." : "Save"}
        </button>
      </div>
    </SettingsScaffold>
  );
}
