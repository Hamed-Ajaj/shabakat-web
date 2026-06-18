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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { useCreateInvoiceMutation } from "../mutations";
import { useInvoiceCustomerOptionsQuery } from "../queries";
import { createInvoiceSchema, type CreateInvoiceFormInput, type CreateInvoiceFormValues } from "../schema";

interface CreateInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateInvoiceDialog({
  open,
  onOpenChange,
}: Readonly<CreateInvoiceDialogProps>) {
  const createInvoice = useCreateInvoiceMutation();
  const customersQuery = useInvoiceCustomerOptionsQuery();
  const form = useForm<CreateInvoiceFormInput, undefined, CreateInvoiceFormValues>({
    resolver: standardSchemaResolver(createInvoiceSchema),
    defaultValues: {
      customerId: "",
    },
  });

  async function handleSubmit(values: CreateInvoiceFormValues) {
    await createInvoice.mutateAsync(values.customerId);
    toast.success("Invoice created successfully.");
    onOpenChange(false);
    form.reset({ customerId: "" });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) {
          createInvoice.reset();
          form.reset({ customerId: "" });
        }
      }}
    >
      <DialogContent className="border-white/8 bg-background sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Invoice</DialogTitle>
          <DialogDescription>
            Generate one invoice from backend billing rules for a selected customer.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Customer</label>
              <Select value={form.watch("customerId") || undefined} onValueChange={(value) => form.setValue("customerId", value, { shouldValidate: true })}>
                <SelectTrigger className="rounded-xl border-white/8 bg-card">
                  <SelectValue placeholder={customersQuery.isLoading ? "Loading customers..." : "Select customer"} />
                </SelectTrigger>
                <SelectContent>
                  {(customersQuery.data ?? []).map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.customerId ? <p className="mt-2 text-sm text-red-300">{form.formState.errors.customerId.message}</p> : null}
            </div>

            {customersQuery.error instanceof Error ? (
              <p className="text-sm text-red-300">{customersQuery.error.message}</p>
            ) : null}
            {createInvoice.error instanceof Error ? (
              <p className="text-sm text-red-300">{createInvoice.error.message}</p>
            ) : null}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createInvoice.isPending || customersQuery.isLoading}>
                {createInvoice.isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                Create Invoice
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
