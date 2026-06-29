import { toast } from "sonner";
import { useMemo } from "react";
import { useI18n } from "../../../providers/I18nProvider";
import { useUpdateAreaMutation } from "../mutations";
import type { AreaFormInput, AreaFormOutput } from "../schema";
import type { AreaRecord } from "../types";
import { AreaFormSheet } from "./AreaFormSheet";

interface EditAreaSheetProps {
  area: AreaRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditAreaSheet({
  area,
  open,
  onOpenChange,
}: Readonly<EditAreaSheetProps>) {
  const { t } = useI18n();
  const updateArea = useUpdateAreaMutation(area?.id ?? "");

  const values = useMemo<AreaFormInput>(
    () => ({
      name: area?.name ?? "",
    }),
    [area?.name],
  );

  async function handleSubmit(values: AreaFormOutput) {
    if (!area) {
      return;
    }

    await updateArea.mutateAsync({
      name: values.name,
    });

    toast.success(t("areas.toast.updated"));
    onOpenChange(false);
  }

  return (
    <AreaFormSheet
      description={t("areas.form.description.edit")}
      error={updateArea.error instanceof Error ? updateArea.error.message : ""}
      open={open}
      pending={updateArea.isPending}
      submitLabel={t("areas.actions.saveChanges")}
      title={t("areas.form.title.edit")}
      values={values}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) {
          updateArea.reset();
        }
      }}
      onSubmit={handleSubmit}
    />
  );
}
