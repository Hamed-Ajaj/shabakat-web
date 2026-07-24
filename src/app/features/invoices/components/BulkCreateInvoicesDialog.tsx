import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
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

  async function handleConfirm() {
    const result = await bulkCreate.mutateAsync(planType === "all" ? undefined : planType);
    toast.success(result.message);
    onOpenChange(false);
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) {
          bulkCreate.reset();
        }
      }}
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
            <Button type="button" onClick={handleConfirm} disabled={bulkCreate.isPending}>
              {bulkCreate.isPending ? t("invoices.actions.generating") : t("invoices.actions.generate")}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
