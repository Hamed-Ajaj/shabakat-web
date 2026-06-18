import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
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
import { useBulkCreateInvoicesMutation } from "../mutations";

interface BulkCreateInvoicesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BulkCreateInvoicesDialog({
  open,
  onOpenChange,
}: Readonly<BulkCreateInvoicesDialogProps>) {
  const bulkCreate = useBulkCreateInvoicesMutation();

  async function handleConfirm() {
    const result = await bulkCreate.mutateAsync();
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
          <AlertDialogTitle>Bulk Generate Invoices</AlertDialogTitle>
          <AlertDialogDescription>
            Create invoices for all eligible active customers for current billing period. This runs on backend billing rules.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {bulkCreate.error instanceof Error ? <p className="text-sm text-red-300">{bulkCreate.error.message}</p> : null}

        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button type="button" onClick={handleConfirm} disabled={bulkCreate.isPending}>
              {bulkCreate.isPending ? "Generating..." : "Generate"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
