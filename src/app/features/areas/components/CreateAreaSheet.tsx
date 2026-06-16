import { toast } from "sonner";
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
  const createArea = useCreateAreaMutation();

  async function handleSubmit(values: AreaFormOutput) {
    await createArea.mutateAsync({
      name: values.name,
    });

    toast.success("Area created successfully.");
    onOpenChange(false);
  }

  return (
    <AreaFormSheet
      description="Create an area to organize subscribers and reuse it across the billing workflow."
      error={createArea.error instanceof Error ? createArea.error.message : ""}
      open={open}
      pending={createArea.isPending}
      submitLabel="Create Area"
      title="Add Area"
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
