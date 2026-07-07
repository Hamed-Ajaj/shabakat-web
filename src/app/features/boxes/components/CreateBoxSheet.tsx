import { toast } from "sonner";
import { useI18n } from "../../../providers/I18nProvider";
import { useAreasQuery } from "../../areas/queries";
import { useCreateBoxMutation } from "../mutations";
import type { BoxFormOutput } from "../schema";
import { BoxFormSheet } from "./BoxFormSheet";

interface CreateBoxSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateBoxSheet({
  open,
  onOpenChange,
}: Readonly<CreateBoxSheetProps>) {
  const { t } = useI18n();
  const areasQuery = useAreasQuery();
  const createBox = useCreateBoxMutation();

  async function handleSubmit(values: BoxFormOutput) {
    await createBox.mutateAsync({
      name: values.name,
      areaId: values.areaId,
      locationNote: values.locationNote || undefined,
      notes: values.notes || undefined,
    });

    toast.success(t("boxes.toast.created"));
    onOpenChange(false);
  }

  return (
    <BoxFormSheet
      areas={areasQuery.data ?? []}
      description={t("boxes.form.description.create")}
      error={
        areasQuery.error instanceof Error
          ? areasQuery.error.message
          : createBox.error instanceof Error
            ? createBox.error.message
            : ""
      }
      open={open}
      pending={areasQuery.isLoading || createBox.isPending}
      submitLabel={t("boxes.actions.create")}
      title={t("boxes.form.title.create")}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) {
          createBox.reset();
        }
      }}
      onSubmit={handleSubmit}
    />
  );
}

