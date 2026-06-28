import { ImageUp, Trash2 } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { useAuth } from "../../../providers/AuthProvider";
import { SettingsScaffold } from "../components/SettingsScaffold";
import { useRemoveCompanyLogoMutation, useUploadCompanyLogoMutation } from "../mutations";

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function CompanyLogoPage() {
  const { session } = useAuth();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const uploadLogo = useUploadCompanyLogoMutation();
  const removeLogo = useRemoveCompanyLogoMutation();
  const canManage = session?.role === "Owner" || session?.role === "Admin";
  const logoUrl = session?.logoUrl ?? null;
  const companyName = session?.companyName ?? "Company";

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setSelectedFileName("");
      return;
    }

    setSelectedFileName(file.name);

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Use a JPEG, PNG, or WebP image.");
      event.target.value = "";
      setSelectedFileName("");
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error("Logo size must be 2 MB or smaller.");
      event.target.value = "";
      setSelectedFileName("");
      return;
    }

    await uploadLogo.mutateAsync(file);
    toast.success("Company logo updated successfully.");
    event.target.value = "";
    setSelectedFileName("");
  }

  async function handleRemove() {
    await removeLogo.mutateAsync();
    toast.success("Company logo removed successfully.");
  }

  return (
    <SettingsScaffold title="Company Logo">
      <div className="space-y-5">
        <div className="rounded-3xl border border-black/6 bg-background/70 p-4 dark:border-white/8">
          <p className="text-sm font-medium text-foreground">Current Logo</p>
          <div className="mt-4 flex min-h-52 items-center justify-center rounded-2xl border border-dashed border-black/8 bg-card p-4 dark:border-white/10">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`${companyName} logo`}
                className="max-h-40 max-w-full rounded-2xl object-contain"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10 text-3xl font-semibold text-primary">
                {companyName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            This logo is used by the backend invoice template automatically.
          </p>
        </div>

        <div className="rounded-3xl border border-black/6 bg-background/70 p-4 dark:border-white/8">
          <p className="text-sm font-medium text-foreground">Upload New Logo</p>
          <p className="mt-1 text-xs text-muted-foreground">
            JPEG, PNG, or WebP. Maximum size 2 MB.
          </p>

          <Input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="mt-4"
            onChange={(event) => {
              void handleFileChange(event);
            }}
            disabled={!canManage || uploadLogo.isPending || removeLogo.isPending}
          />

          {selectedFileName ? (
            <p className="mt-2 text-xs text-muted-foreground">{selectedFileName}</p>
          ) : null}

          {!canManage ? (
            <p className="mt-4 text-sm text-muted-foreground">Only Owner and Admin can update the company logo.</p>
          ) : null}
          {uploadLogo.error instanceof Error ? (
            <p className="mt-4 text-sm text-red-300">{uploadLogo.error.message}</p>
          ) : null}
          {removeLogo.error instanceof Error ? (
            <p className="mt-4 text-sm text-red-300">{removeLogo.error.message}</p>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={!canManage || uploadLogo.isPending || removeLogo.isPending}
            >
              <ImageUp className="h-4 w-4" />
              {uploadLogo.isPending ? "Uploading..." : "Choose logo"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => void handleRemove()}
              disabled={!canManage || !logoUrl || uploadLogo.isPending || removeLogo.isPending}
            >
              <Trash2 className="h-4 w-4" />
              {removeLogo.isPending ? "Removing..." : "Remove logo"}
            </Button>
          </div>
        </div>
      </div>
    </SettingsScaffold>
  );
}
