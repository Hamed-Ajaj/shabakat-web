import { toast } from "sonner";
import { useI18n } from "../../../providers/I18nProvider";
import type { AmpereScheduleFormOutput } from "../schema";
import { useCreateAmpereScheduleMutation } from "../mutations";
import { AmpereScheduleFormSheet } from "./AmpereScheduleFormSheet";

interface CreateAmpereScheduleSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateAmpereScheduleSheet({
  open,
  onOpenChange,
}: Readonly<CreateAmpereScheduleSheetProps>) {
  const { t } = useI18n();
  const createAmpereSchedule = useCreateAmpereScheduleMutation();

  async function handleSubmit(values: AmpereScheduleFormOutput) {
    await createAmpereSchedule.mutateAsync(values);
    toast.success(t("ampereSchedules.toast.created"));
    onOpenChange(false);
  }

  return (
    <AmpereScheduleFormSheet
      description={t("ampereSchedules.form.description.create")}
      error={createAmpereSchedule.error instanceof Error ? createAmpereSchedule.error.message : ""}
      open={open}
      pending={createAmpereSchedule.isPending}
      submitLabel={t("ampereSchedules.actions.create")}
      title={t("ampereSchedules.form.title.create")}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) {
          createAmpereSchedule.reset();
        }
      }}
      onSubmit={handleSubmit}
    />
  );
}
