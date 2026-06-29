import { toast } from "sonner";
import { useI18n } from "../../../providers/I18nProvider";
import { useCreateSubscriberMutation } from "../mutations";
import { mapFormValuesToSubscriberPayload } from "../formMappers";
import type { CreateSubscriberFormValues } from "../schema";
import { SubscriberFormSheet } from "./SubscriberFormSheet";

interface CreateSubscriberSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateSubscriberSheet({
  open,
  onOpenChange,
}: Readonly<CreateSubscriberSheetProps>) {
  const { t } = useI18n();
  const createSubscriber = useCreateSubscriberMutation();

  async function handleSubmit(values: CreateSubscriberFormValues) {
    await createSubscriber.mutateAsync(mapFormValuesToSubscriberPayload(values));

    toast.success(t("subscribers.toast.created"));
    onOpenChange(false);
  }

  return (
    <SubscriberFormSheet
      description={t("subscribers.form.description.create")}
      error={createSubscriber.error instanceof Error ? createSubscriber.error.message : ""}
      open={open}
      pending={createSubscriber.isPending}
      submitLabel={t("subscribers.actions.create")}
      title={t("subscribers.form.title.create")}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) {
          createSubscriber.reset();
        }
      }}
      onSubmit={handleSubmit}
    />
  );
}
