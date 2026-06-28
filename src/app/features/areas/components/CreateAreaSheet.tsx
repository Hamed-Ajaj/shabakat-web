import { toast } from "sonner";
import { useI18n } from "../../../providers/I18nProvider";
import { useCreateAreaMutation } from "../mutations";
import type { AreaFormOutput } from "../schema";
import { AreaFormSheet } from "./AreaFormSheet";

interface CreateAreaSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateAreaSheet({
  open,
  onOpenChange,
}: Readonly<CreateAreaSheetProps>) {
  const { t } = useI18n();
  const createArea = useCreateAreaMutation();

  async function handleSubmit(values: AreaFormOutput) {
    await createArea.mutateAsync({
      name: values.name,
    });

    toast.success(t("areas.toast.created"));
    onOpenChange(false);
  }

  return (
    <AreaFormSheet
      description={t("areas.form.description.create")}
      error={createArea.error instanceof Error ? createArea.error.message : ""}
      open={open}
      pending={createArea.isPending}
      submitLabel={t("areas.actions.create")}
      title={t("areas.form.title.create")}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) {
          createArea.reset();
        }
      }}
      onSubmit={handleSubmit}
    />
  );
}
