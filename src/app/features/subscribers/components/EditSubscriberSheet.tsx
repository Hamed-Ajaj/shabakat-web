import { useMemo } from "react";
import { toast } from "sonner";
import { useI18n } from "../../../providers/I18nProvider";
import { useAreasQuery } from "../../areas/queries";
import { mapFormValuesToSubscriberPayload, mapSubscriberDetailToFormInput } from "../formMappers";
import { useSubscriberDetailQuery } from "../queries";
import { useUpdateSubscriberMutation } from "../mutations";
import { defaultSubscriberFormValues, type CreateSubscriberFormInput, type CreateSubscriberFormValues } from "../schema";
import { SubscriberFormSheet } from "./SubscriberFormSheet";

interface EditSubscriberSheetProps {
  open: boolean;
  subscriberId: string | null;
  onOpenChange: (open: boolean) => void;
}

export function EditSubscriberSheet({
  open,
  subscriberId,
  onOpenChange,
}: Readonly<EditSubscriberSheetProps>) {
  const { t } = useI18n();
  const detailQuery = useSubscriberDetailQuery(subscriberId ?? undefined);
  const areasQuery = useAreasQuery();
  const updateSubscriber = useUpdateSubscriberMutation(subscriberId ?? "");

  const initialValues = useMemo<CreateSubscriberFormInput>(() => {
    if (!detailQuery.data) {
      return defaultSubscriberFormValues;
    }

    return mapSubscriberDetailToFormInput(detailQuery.data, areasQuery.data ?? []);
  }, [areasQuery.data, detailQuery.data]);

  async function handleSubmit(values: CreateSubscriberFormValues) {
    await updateSubscriber.mutateAsync(mapFormValuesToSubscriberPayload(values));

    toast.success(t("subscribers.toast.updated"));
    onOpenChange(false);
  }

  const error =
    detailQuery.error instanceof Error
      ? detailQuery.error.message
      : updateSubscriber.error instanceof Error
        ? updateSubscriber.error.message
        : "";

  return (
    <SubscriberFormSheet
      description={t("subscribers.form.description.edit")}
      error={error}
      open={open}
      pending={detailQuery.isLoading || updateSubscriber.isPending}
      submitLabel={t("subscribers.actions.saveChanges")}
      title={t("subscribers.form.title.edit")}
      values={initialValues}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) {
          updateSubscriber.reset();
        }
      }}
      onSubmit={handleSubmit}
    />
  );
}
