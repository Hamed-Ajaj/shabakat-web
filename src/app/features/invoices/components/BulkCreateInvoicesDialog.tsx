import { useState } from "react";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { useI18n } from "../../../providers/I18nProvider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { useBulkCreateInvoicesMutation } from "../mutations";
import { useSkippedInvoiceCustomersQuery } from "../queries";
import { formatDateTime } from "../utils";
import type { BulkCreatePlanType } from "../types";

interface BulkCreateInvoicesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BulkCreateInvoicesDialog({
  open,
  onOpenChange,
}: Readonly<BulkCreateInvoicesDialogProps>) {
  const { t } = useI18n();
  const bulkCreate = useBulkCreateInvoicesMutation();
  const [planType, setPlanType] = useState<BulkCreatePlanType | "all">("all");
  const [result, setResult] = useState<{ created: number; skipped: number } | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const skippedCustomersQuery = useSkippedInvoiceCustomersQuery(showDetails);

  async function handleConfirm() {
    try {
      const response = await bulkCreate.mutateAsync(planType === "all" ? undefined : planType);
      setResult(response);
    } catch {
      // The mutation state renders the server error in this dialog.
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      bulkCreate.reset();
      setResult(null);
      setShowDetails(false);
    }
  }

  if (result) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="border-white/8 bg-background sm:max-w-md">
          <DialogHeader className="items-center text-center">
            <CheckCircle2 className="size-14 text-emerald-400" />
            <DialogTitle>{t("invoices.bulk.resultTitle")}</DialogTitle>
            <DialogDescription>{t("invoices.bulk.resultDescription")}</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3 text-center">
            <ResultCount label={t("invoices.bulk.created")} value={result.created} className="text-emerald-400" />
            <ResultCount label={t("invoices.bulk.skipped")} value={result.skipped} className="text-amber-400" />
          </div>

          {showDetails ? (
            <div className="max-h-72 space-y-2 overflow-y-auto rounded-xl border border-white/8 p-3">
              {skippedCustomersQuery.isLoading ? <LoaderCircle className="mx-auto size-5 animate-spin text-muted-foreground" /> : null}
              {skippedCustomersQuery.error instanceof Error ? <p className="text-sm text-red-300">{skippedCustomersQuery.error.message}</p> : null}
              {(skippedCustomersQuery.data ?? []).map((customer) => (
                <div key={customer.customerId} className="rounded-lg bg-card p-3">
                  <p className="font-medium">{customer.customerName}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{customer.reason}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(customer.skippedAt)}</p>
                </div>
              ))}
            </div>
          ) : null}

          <DialogFooter>
            {result.skipped > 0 ? (
              <Button type="button" variant="outline" onClick={() => setShowDetails(true)}>
                {t("invoices.bulk.viewSkipped")}
              </Button>
            ) : null}
            <Button type="button" onClick={() => handleOpenChange(false)}>{t("invoices.actions.done")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <AlertDialogContent className="border-white/8 bg-background">
        <AlertDialogHeader>
          <AlertDialogTitle>{t("invoices.bulk.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("invoices.bulk.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">{t("invoices.bulk.planType")}</label>
          <Select value={planType} onValueChange={(value) => setPlanType(value as BulkCreatePlanType | "all")}>
            <SelectTrigger className="rounded-xl border-white/8 bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("invoices.bulk.planTypeAll")}</SelectItem>
              <SelectItem value="Ampere">{t("invoices.bulk.planTypeAmpere")}</SelectItem>
              <SelectItem value="Kilowatt">{t("invoices.bulk.planTypeKilowatt")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {bulkCreate.error instanceof Error ? <p className="text-sm text-red-300">{bulkCreate.error.message}</p> : null}

        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button type="button" variant="outline">
              {t("invoices.actions.cancel")}
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button type="button" onClick={(event) => { event.preventDefault(); void handleConfirm(); }} disabled={bulkCreate.isPending}>
              {bulkCreate.isPending ? t("invoices.actions.generating") : t("invoices.actions.generate")}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function ResultCount({ className, label, value }: Readonly<{ className: string; label: string; value: number }>) {
  return (
    <div className="rounded-xl border border-white/8 bg-card p-4">
      <p className={`text-3xl font-semibold ${className}`}>{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
