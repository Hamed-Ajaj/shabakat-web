import { useMemo } from "react";
import { toast } from "sonner";
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

    toast.success("Subscriber updated successfully.");
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
      description="Update subscriber information, plan, and optional custom pricing."
      error={error}
      open={open}
      pending={detailQuery.isLoading || updateSubscriber.isPending}
      submitLabel="Save Changes"
      title="Edit Subscriber"
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
