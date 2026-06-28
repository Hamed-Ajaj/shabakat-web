import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import { useI18n } from "../../../providers/I18nProvider";
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
  const { t } = useI18n();
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
    toast.success(t("invoices.create.success"));
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
          <DialogTitle>{t("invoices.create.title")}</DialogTitle>
          <DialogDescription>
            {t("invoices.create.description")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("invoices.create.customer")}</label>
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
                  <SelectValue placeholder={customersQuery.isLoading ? t("invoices.create.loadingCustomers") : t("invoices.create.customerPlaceholder")} />
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
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("invoices.create.paymentAmount")}</label>
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
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("invoices.create.paymentMethod")}</label>
                  <Select
                    value={form.watch("paymentMethod")}
                    onValueChange={(value) =>
                      form.setValue("paymentMethod", value as "Cash" | "Wish", {
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger className="rounded-xl border-white/8 bg-card">
                      <SelectValue placeholder={t("invoices.create.paymentMethodPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">{t("invoices.paymentMethod.cash")}</SelectItem>
                      <SelectItem value="Wish">{t("invoices.paymentMethod.wish")}</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.paymentMethod ? (
                    <p className="mt-2 text-sm text-red-300">
                      {form.formState.errors.paymentMethod.message}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("invoices.create.notes")}</label>
                  <Input
                    placeholder={t("invoices.create.notesPlaceholder")}
                    {...form.register("notes")}
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    {t("invoices.create.fixedKilowattHelp")}
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
                {t("invoices.actions.cancel")}
              </Button>
              <Button type="submit" disabled={createInvoice.isPending || customersQuery.isLoading}>
                {createInvoice.isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                {t("invoices.actions.create")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
