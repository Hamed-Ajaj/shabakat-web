import { toast } from "sonner";
import { useMemo } from "react";
import { useUpdateAreaMutation } from "../mutations";
import type { AreaFormInput, AreaFormOutput } from "../schema";
import type { AreaRecord } from "../types";
import { AreaFormSheet } from "./AreaFormSheet";

interface EditAreaSheetProps {
  area: AreaRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditAreaSheet({
  area,
  open,
  onOpenChange,
}: Readonly<EditAreaSheetProps>) {
  const updateArea = useUpdateAreaMutation(area?.id ?? "");

  const values = useMemo<AreaFormInput>(
    () => ({
      name: area?.name ?? "",
    }),
    [area?.name],
  );

  async function handleSubmit(values: AreaFormOutput) {
    if (!area) {
      return;
    }

    await updateArea.mutateAsync({
      name: values.name,
    });

    toast.success("Area updated successfully.");
    onOpenChange(false);
  }

  return (
    <AreaFormSheet
      description="Rename the area and keep it available for subscriber assignment."
      error={updateArea.error instanceof Error ? updateArea.error.message : ""}
      open={open}
      pending={updateArea.isPending}
      submitLabel="Save Changes"
      title="Edit Area"
      values={values}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) {
          updateArea.reset();
        }
      }}
      onSubmit={handleSubmit}
    />
  );
}
