import { toast } from "sonner";
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
  const createSubscriber = useCreateSubscriberMutation();

  async function handleSubmit(values: CreateSubscriberFormValues) {
    await createSubscriber.mutateAsync(mapFormValuesToSubscriberPayload(values));

    toast.success("Subscriber created successfully.");
    onOpenChange(false);
  }

  return (
    <SubscriberFormSheet
      description="Create a subscriber with plan, area, and optional custom pricing."
      error={createSubscriber.error instanceof Error ? createSubscriber.error.message : ""}
      open={open}
      pending={createSubscriber.isPending}
      submitLabel="Create Subscriber"
      title="Add Subscriber"
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
