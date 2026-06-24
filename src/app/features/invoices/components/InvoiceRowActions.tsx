import { Eye, MoreHorizontal, Printer, Receipt, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
          aria-label="More actions"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={onView}>
          <Eye className="h-4 w-4" />
          View invoice
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onPay}>
          <Receipt className="h-4 w-4" />
          Record payment
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onPrint}>
          <Printer className="h-4 w-4" />
          Print invoice
        </DropdownMenuItem>
        {canDelete ? (
          <DropdownMenuItem variant="destructive" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
            Delete invoice
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
