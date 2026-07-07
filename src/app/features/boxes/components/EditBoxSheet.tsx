import { useMemo } from "react";
import { toast } from "sonner";
import { useI18n } from "../../../providers/I18nProvider";
import { useAreasQuery } from "../../areas/queries";
import { useUpdateBoxMutation } from "../mutations";
import type { BoxFormInput, BoxFormOutput } from "../schema";
import type { BoxRecord } from "../types";
import { BoxFormSheet } from "./BoxFormSheet";

interface EditBoxSheetProps {
  box: BoxRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditBoxSheet({
  box,
  open,
  onOpenChange,
}: Readonly<EditBoxSheetProps>) {
  const { t } = useI18n();
  const areasQuery = useAreasQuery();
  const updateBox = useUpdateBoxMutation(box?.id ?? "");

  const initialValues = useMemo<BoxFormInput>(() => {
    if (!box) {
      return {
        name: "",
        areaId: "",
        locationNote: "",
        notes: "",
      };
    }

    return {
      name: box.name,
      areaId: box.areaId,
      locationNote: box.locationNote ?? "",
      notes: box.notes ?? "",
    };
  }, [box]);

  async function handleSubmit(values: BoxFormOutput) {
    if (!box) {
      return;
    }

    await updateBox.mutateAsync({
      name: values.name,
      areaId: values.areaId,
      locationNote: values.locationNote || undefined,
      notes: values.notes || undefined,
    });

    toast.success(t("boxes.toast.updated"));
    onOpenChange(false);
  }

  return (
    <BoxFormSheet
      areas={areasQuery.data ?? []}
      description={t("boxes.form.description.edit")}
      error={
        areasQuery.error instanceof Error
          ? areasQuery.error.message
          : updateBox.error instanceof Error
            ? updateBox.error.message
            : ""
      }
      open={open}
      pending={areasQuery.isLoading || updateBox.isPending}
      submitLabel={t("boxes.actions.saveChanges")}
      title={t("boxes.form.title.edit")}
      values={initialValues}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) {
          updateBox.reset();
        }
      }}
      onSubmit={handleSubmit}
    />
  );
}

