import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
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
import { Textarea } from "../../../components/ui/textarea";
import { useRecordInvoicePaymentMutation } from "../mutations";
import { recordPaymentSchema, type RecordPaymentFormInput, type RecordPaymentFormValues } from "../schema";
import { useInvoiceDetailQuery } from "../queries";
import { formatCurrency } from "../utils";

interface RecordPaymentDialogProps {
  invoiceId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RecordPaymentDialog({
  invoiceId,
  open,
  onOpenChange,
}: Readonly<RecordPaymentDialogProps>) {
  const { t } = useI18n();
  const detailQuery = useInvoiceDetailQuery(invoiceId ?? undefined);
  const recordPayment = useRecordInvoicePaymentMutation(invoiceId ?? "");
  const form = useForm<RecordPaymentFormInput, undefined, RecordPaymentFormValues>({
    resolver: standardSchemaResolver(recordPaymentSchema),
    defaultValues: {
      amount: 0,
      paymentMethod: "Cash",
      notes: "",
    },
  });

  useEffect(() => {
    if (open && detailQuery.data?.amountDue) {
      form.reset({
        amount: detailQuery.data.amountDue,
        paymentMethod: "Cash",
        notes: "",
      });
    }
  }, [detailQuery.data?.amountDue, form, open]);

  async function handleSubmit(values: RecordPaymentFormValues) {
    if (!invoiceId) {
      return;
    }

    await recordPayment.mutateAsync(values);
    toast.success(t("invoices.payment.success"));
    onOpenChange(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) {
          recordPayment.reset();
        }
      }}
    >
      <DialogContent className="border-white/8 bg-background sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("invoices.payment.title")}</DialogTitle>
          <DialogDescription>
            {detailQuery.data ? t("invoices.payment.descriptionWithNumber", { number: `#${detailQuery.data.invoiceNumber}` }) : t("invoices.payment.description")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
            {detailQuery.data ? (
              <div className="rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3 text-sm text-muted-foreground">
                {t("invoices.payment.remaining", { amount: formatCurrency(detailQuery.data.amountDue) })}
              </div>
            ) : null}

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("invoices.payment.amount")}</label>
              <Input type="number" step="0.01" min="0" {...form.register("amount")} className="rounded-xl border-white/8 bg-card" />
              {form.formState.errors.amount ? <p className="mt-2 text-sm text-red-300">{form.formState.errors.amount.message}</p> : null}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("invoices.payment.method")}</label>
              <Select value={form.watch("paymentMethod")} onValueChange={(value) => form.setValue("paymentMethod", value as "Cash" | "Wish", { shouldValidate: true })}>
                <SelectTrigger className="rounded-xl border-white/8 bg-card">
                  <SelectValue placeholder={t("invoices.create.paymentMethodPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">{t("invoices.paymentMethod.cash")}</SelectItem>
                  <SelectItem value="Wish">{t("invoices.paymentMethod.wish")}</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.paymentMethod ? <p className="mt-2 text-sm text-red-300">{form.formState.errors.paymentMethod.message}</p> : null}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("invoices.payment.notes")}</label>
              <Textarea rows={4} {...form.register("notes")} className="rounded-xl border-white/8 bg-card" placeholder={t("invoices.payment.notesPlaceholder")} />
              {form.formState.errors.notes ? <p className="mt-2 text-sm text-red-300">{form.formState.errors.notes.message}</p> : null}
            </div>

            {recordPayment.error instanceof Error ? <p className="text-sm text-red-300">{recordPayment.error.message}</p> : null}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t("invoices.actions.cancel")}
              </Button>
              <Button type="submit" disabled={recordPayment.isPending || detailQuery.isLoading}>
                {recordPayment.isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                {t("invoices.actions.recordPayment")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
