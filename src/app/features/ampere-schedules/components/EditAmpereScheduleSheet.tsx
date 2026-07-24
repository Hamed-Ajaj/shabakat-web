import { useMemo } from "react";
import { toast } from "sonner";
import { useI18n } from "../../../providers/I18nProvider";
import type { AmpereScheduleFormInput, AmpereScheduleFormOutput } from "../schema";
import type { AmpereScheduleRecord } from "../types";
import { useUpdateAmpereScheduleMutation } from "../mutations";
import { AmpereScheduleFormSheet } from "./AmpereScheduleFormSheet";

interface EditAmpereScheduleSheetProps {
  open: boolean;
  schedule: AmpereScheduleRecord | null;
  onOpenChange: (open: boolean) => void;
}

export function EditAmpereScheduleSheet({
  open,
  schedule,
  onOpenChange,
}: Readonly<EditAmpereScheduleSheetProps>) {
  const { t } = useI18n();
  const updateAmpereSchedule = useUpdateAmpereScheduleMutation(schedule?.id ?? "");

  const initialValues = useMemo<AmpereScheduleFormInput>(() => {
    if (!schedule) {
      return {
        name: "",
        hoursPerDay: 14,
        pricePerAmp: 0,
        residentialPricePerAmp: 0,
        commercialPricePerAmp: 0,
        industrialPricePerAmp: 0,
      };
    }
    return {
      name: schedule.name,
      hoursPerDay: schedule.hoursPerDay,
      pricePerAmp: schedule.pricePerAmp,
      residentialPricePerAmp: schedule.residentialPricePerAmp,
      commercialPricePerAmp: schedule.commercialPricePerAmp,
      industrialPricePerAmp: schedule.industrialPricePerAmp,
    };
  }, [schedule]);

  async function handleSubmit(values: AmpereScheduleFormOutput) {
    if (!schedule) return;
    await updateAmpereSchedule.mutateAsync(values);
    toast.success(t("ampereSchedules.toast.updated"));
    onOpenChange(false);
  }

  return (
    <AmpereScheduleFormSheet
      description={t("ampereSchedules.form.description.edit")}
      error={updateAmpereSchedule.error instanceof Error ? updateAmpereSchedule.error.message : ""}
      open={open}
      pending={updateAmpereSchedule.isPending}
      submitLabel={t("ampereSchedules.actions.saveChanges")}
      title={t("ampereSchedules.form.title.edit")}
      values={initialValues}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) updateAmpereSchedule.reset();
      }}
      onSubmit={handleSubmit}
    />
  );
}
