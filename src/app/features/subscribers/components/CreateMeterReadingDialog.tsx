import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Form } from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { useCreateMeterReadingMutation } from "../mutations";
import {
  createMeterReadingSchema,
  type CreateMeterReadingFormInput,
  type CreateMeterReadingFormValues,
} from "../meterReadingsSchema";

interface CreateMeterReadingDialogProps {
  customerId: string;
  customerName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateMeterReadingDialog({
  customerId,
  customerName,
  open,
  onOpenChange,
}: Readonly<CreateMeterReadingDialogProps>) {
  const createReading = useCreateMeterReadingMutation(customerId);
  const form = useForm<
    CreateMeterReadingFormInput,
    undefined,
    CreateMeterReadingFormValues
  >({
    resolver: standardSchemaResolver(createMeterReadingSchema),
    defaultValues: {
      readingDate: "",
      readingValue: 0,
    },
  });

  async function handleSubmit(values: CreateMeterReadingFormValues) {
    await createReading.mutateAsync(values);
    toast.success("Meter reading created successfully.");
    onOpenChange(false);
    form.reset({
      readingDate: "",
      readingValue: 0,
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) {
          createReading.reset();
          form.reset({
            readingDate: "",
            readingValue: 0,
          });
        }
      }}
    >
      <DialogContent className="border-white/8 bg-background sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Meter Reading</DialogTitle>
          <DialogDescription>
            Record one monthly meter reading for {customerName || "this subscriber"}.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Reading Value</label>
              <Input
                inputMode="decimal"
                step="0.01"
                type="number"
                {...form.register("readingValue")}
              />
              {form.formState.errors.readingValue ? (
                <p className="mt-2 text-sm text-red-300">
                  {form.formState.errors.readingValue.message}
                </p>
              ) : null}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Reading Date</label>
              <Input type="date" {...form.register("readingDate")} />
              <p className="mt-2 text-xs text-muted-foreground">
                Optional. Backend defaults to today and blocks duplicate calendar months.
              </p>
            </div>

            {createReading.error instanceof Error ? (
              <p className="text-sm text-red-300">{createReading.error.message}</p>
            ) : null}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createReading.isPending}>
                {createReading.isPending ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : null}
                Save Reading
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
