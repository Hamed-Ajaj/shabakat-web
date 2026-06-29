import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useDebouncedValue } from "../../../../hooks/use-debounced-value";
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
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { SectionCard } from "../../../shared/components/SectionCard";
import { useCreateInvoiceMutation } from "../mutations";
import { useFixedKilowattCalculationQuery, useInvoiceCustomerOptionsQuery } from "../queries";
import { createInvoiceSchema, type CreateInvoiceFormInput, type CreateInvoiceFormValues } from "../schema";
import { formatCurrency } from "../utils";

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
      fixedKilowattMode: "payment",
      notes: "",
      paymentAmount: Number.NaN,
      kilowattAmount: Number.NaN,
      paymentMethod: undefined,
    },
  });
  const customerId = form.watch("customerId");
  const fixedKilowattMode = form.watch("fixedKilowattMode");
  const paymentAmount = toFiniteNumber(form.watch("paymentAmount"));
  const kilowattAmount = toFiniteNumber(form.watch("kilowattAmount"));
  const selectedCustomer = (customersQuery.data ?? []).find((item) => item.id === customerId);
  const isFixedKilowatt = selectedCustomer?.plan === "FixedKilowatt";
  const debouncedPaymentAmount = useDebouncedValue(paymentAmount, 350);
  const debouncedKilowattAmount = useDebouncedValue(kilowattAmount, 350);
  const fixedKilowattCalculationPayload =
    isFixedKilowatt && selectedCustomer
      ? fixedKilowattMode === "payment"
        ? debouncedPaymentAmount !== undefined && debouncedPaymentAmount > 0
          ? {
              customerType: selectedCustomer.customerType,
              planValue: selectedCustomer.planValue,
              paymentAmount: debouncedPaymentAmount,
            }
          : undefined
        : debouncedKilowattAmount !== undefined && debouncedKilowattAmount > 0
          ? {
              customerType: selectedCustomer.customerType,
              planValue: selectedCustomer.planValue,
              kilowattAmount: debouncedKilowattAmount,
            }
          : undefined
      : undefined;
  const calculationQuery = useFixedKilowattCalculationQuery(
    fixedKilowattCalculationPayload,
  );

  async function handleSubmit(values: CreateInvoiceFormValues) {
    await createInvoice.mutateAsync({
      customerId: values.customerId,
      notes: values.notes || undefined,
      paymentAmount:
        selectedCustomer?.plan === "FixedKilowatt" && values.fixedKilowattMode === "payment"
          ? values.paymentAmount
          : undefined,
      kilowattAmount:
        selectedCustomer?.plan === "FixedKilowatt" && values.fixedKilowattMode === "kilowatt"
          ? values.kilowattAmount
          : undefined,
      paymentMethod:
        selectedCustomer?.plan === "FixedKilowatt"
          ? values.paymentMethod
          : undefined,
    });
    toast.success(t("invoices.create.success"));
    onOpenChange(false);
    form.reset({
      customerId: "",
      customerPlan: undefined,
      fixedKilowattMode: "payment",
      notes: "",
      paymentAmount: Number.NaN,
      kilowattAmount: Number.NaN,
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
            fixedKilowattMode: "payment",
            notes: "",
            paymentAmount: Number.NaN,
            kilowattAmount: Number.NaN,
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
                    form.setValue("kilowattAmount", Number.NaN);
                    form.setValue("paymentMethod", undefined);
                    form.setValue("notes", "");
                    form.setValue("fixedKilowattMode", "payment");
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
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-muted-foreground">Charge Mode</label>
                  <Tabs
                    value={fixedKilowattMode}
                    onValueChange={(value) => {
                      const nextMode = value as "payment" | "kilowatt";
                      form.setValue("fixedKilowattMode", nextMode, {
                        shouldValidate: true,
                      });
                      if (nextMode === "payment") {
                        form.setValue("kilowattAmount", Number.NaN);
                      } else {
                        form.setValue("paymentAmount", Number.NaN);
                      }
                    }}
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="payment">By payment</TabsTrigger>
                      <TabsTrigger value="kilowatt">By kWh</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    {fixedKilowattMode === "payment" ? "Payment Amount" : "Kilowatt Amount"}
                  </label>
                  {fixedKilowattMode === "payment" ? (
                    <>
                      <Input
                        inputMode="decimal"
                        step="0.01"
                        type="number"
                        {...form.register("paymentAmount", { valueAsNumber: true })}
                      />
                      {form.formState.errors.paymentAmount ? (
                        <p className="mt-2 text-sm text-red-300">
                          {form.formState.errors.paymentAmount.message}
                        </p>
                      ) : null}
                    </>
                  ) : (
                    <>
                      <Input
                        inputMode="decimal"
                        step="0.01"
                        type="number"
                        {...form.register("kilowattAmount", { valueAsNumber: true })}
                      />
                      {form.formState.errors.kilowattAmount ? (
                        <p className="mt-2 text-sm text-red-300">
                          {form.formState.errors.kilowattAmount.message}
                        </p>
                      ) : null}
                    </>
                  )}
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

                <SectionCard className="space-y-3 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">Server Calculation Preview</p>
                    {calculationQuery.isFetching ? (
                      <span className="text-xs text-muted-foreground">Calculating...</span>
                    ) : null}
                  </div>

                  {calculationQuery.data ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <PreviewMetric label="Payment" value={formatCurrency(calculationQuery.data.paymentAmount)} />
                      <PreviewMetric label="kWh Credit" value={`${calculationQuery.data.kilowattAmount}`} />
                      <PreviewMetric label="Unit Price" value={formatCurrency(calculationQuery.data.unitPrice)} />
                      <PreviewMetric label="Fixed Charge" value={formatCurrency(calculationQuery.data.fixedCharge)} />
                      <PreviewMetric label="TVA" value={`${calculationQuery.data.tva}%`} />
                      <PreviewMetric label="Plan Value" value={`${calculationQuery.data.planValue}`} />
                    </div>
                  ) : calculationQuery.isSuccess ? (
                    <p className="text-sm text-muted-foreground">
                      Preview is unavailable on the current backend build. You can still create the prepaid invoice normally.
                    </p>
                  ) : calculationQuery.error instanceof Error ? (
                    <p className="text-sm text-red-300">{calculationQuery.error.message}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Enter a payment or kWh amount to preview the exact backend calculation before creating the paid invoice.
                    </p>
                  )}
                </SectionCard>
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

function PreviewMetric({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function toFiniteNumber(value: unknown) {
  const numericValue = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numericValue) ? numericValue : undefined;
}
