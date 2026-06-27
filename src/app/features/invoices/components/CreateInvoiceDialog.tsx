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
      customerPlan: undefined,
      notes: "",
      paymentAmount: Number.NaN,
      paymentMethod: undefined,
    },
  });
  const isFixedKilowatt = form.watch("customerPlan") === "FixedKilowatt";

  async function handleSubmit(values: CreateInvoiceFormValues) {
    await createInvoice.mutateAsync({
      customerId: values.customerId,
      notes: values.notes || undefined,
      paymentAmount:
        values.customerPlan === "FixedKilowatt"
          ? values.paymentAmount
          : undefined,
      paymentMethod:
        values.customerPlan === "FixedKilowatt"
          ? values.paymentMethod
          : undefined,
    });
    toast.success("Invoice created successfully.");
    onOpenChange(false);
    form.reset({
      customerId: "",
      customerPlan: undefined,
      notes: "",
      paymentAmount: Number.NaN,
      paymentMethod: undefined,
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) {
          createInvoice.reset();
          form.reset({
            customerId: "",
            customerPlan: undefined,
            notes: "",
            paymentAmount: Number.NaN,
            paymentMethod: undefined,
          });
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
              <Select
                value={form.watch("customerId") || undefined}
                onValueChange={(value) => {
                  const customer = (customersQuery.data ?? []).find(
                    (item) => item.id === value,
                  );

                  form.setValue("customerId", value, { shouldValidate: true });
                  form.setValue("customerPlan", customer?.plan, {
                    shouldValidate: true,
                  });

                  if (customer?.plan !== "FixedKilowatt") {
                    form.setValue("paymentAmount", Number.NaN);
                    form.setValue("paymentMethod", undefined);
                    form.setValue("notes", "");
                  }
                }}
              >
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

            {isFixedKilowatt ? (
              <>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Payment Amount</label>
                  <Input
                    inputMode="decimal"
                    step="0.01"
                    type="number"
                    {...form.register("paymentAmount")}
                  />
                  {form.formState.errors.paymentAmount ? (
                    <p className="mt-2 text-sm text-red-300">
                      {form.formState.errors.paymentAmount.message}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Payment Method</label>
                  <Select
                    value={form.watch("paymentMethod")}
                    onValueChange={(value) =>
                      form.setValue("paymentMethod", value as "Cash" | "Wish", {
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger className="rounded-xl border-white/8 bg-card">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Wish">Wish</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.paymentMethod ? (
                    <p className="mt-2 text-sm text-red-300">
                      {form.formState.errors.paymentMethod.message}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Notes</label>
                  <Input
                    placeholder="Counter payment"
                    {...form.register("notes")}
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    FixedKilowatt creates a paid invoice and credits kWh immediately.
                  </p>
                </div>
              </>
            ) : null}

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
