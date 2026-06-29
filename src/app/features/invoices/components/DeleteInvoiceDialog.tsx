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
import { useDeleteInvoiceMutation } from "../mutations";

interface DeleteInvoiceDialogProps {
  invoiceId: string | null;
  invoiceNumber: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteInvoiceDialog({
  invoiceId,
  invoiceNumber,
  open,
  onOpenChange,
}: Readonly<DeleteInvoiceDialogProps>) {
  const { t } = useI18n();
  const deleteInvoice = useDeleteInvoiceMutation();

  async function handleDelete() {
    if (!invoiceId) {
      return;
    }

    await deleteInvoice.mutateAsync(invoiceId);
    toast.success(t("invoices.delete.success"));
    onOpenChange(false);
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) {
          deleteInvoice.reset();
        }
      }}
    >
      <AlertDialogContent className="border-white/8 bg-background">
        <AlertDialogHeader>
          <AlertDialogTitle>{t("invoices.delete.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("invoices.delete.description", {
              number: invoiceNumber ? `#${invoiceNumber}` : t("invoices.delete.fallbackNumber"),
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {deleteInvoice.error instanceof Error ? <p className="text-sm text-red-300">{deleteInvoice.error.message}</p> : null}

        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button type="button" variant="outline">
              {t("invoices.actions.cancel")}
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button type="button" variant="destructive" disabled={deleteInvoice.isPending} onClick={handleDelete}>
              {deleteInvoice.isPending ? t("invoices.actions.deleting") : t("invoices.actions.delete")}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
