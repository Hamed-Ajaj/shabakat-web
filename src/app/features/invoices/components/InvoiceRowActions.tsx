import { Eye, MoreHorizontal, Printer, Receipt, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useI18n } from "../../../providers/I18nProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

interface InvoiceRowActionsProps {
  canDelete: boolean;
  onDelete: () => void;
  onPay: () => void;
  onPrint: () => void;
  onView: () => void;
}

export function InvoiceRowActions({
  canDelete,
  onDelete,
  onPay,
  onPrint,
  onView,
}: Readonly<InvoiceRowActionsProps>) {
  const { isRtl, t } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
          aria-label={t("invoices.actions.more")}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRtl ? "start" : "end"} className="w-44">
        <DropdownMenuItem onClick={onView}>
          <Eye className="h-4 w-4" />
          {t("invoices.actions.view")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onPay}>
          <Receipt className="h-4 w-4" />
          {t("invoices.actions.recordPayment")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onPrint}>
          <Printer className="h-4 w-4" />
          {t("invoices.actions.printInvoice")}
        </DropdownMenuItem>
        {canDelete ? (
          <DropdownMenuItem variant="destructive" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
            {t("invoices.actions.delete")}
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
