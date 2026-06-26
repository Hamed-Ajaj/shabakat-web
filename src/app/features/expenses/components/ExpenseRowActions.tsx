import { Eye, MoreHorizontal, PencilLine, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

interface ExpenseRowActionsProps {
  canManage: boolean;
  onDelete: () => void;
  onEdit: () => void;
  onView: () => void;
}

export function ExpenseRowActions({
  canManage,
  onDelete,
  onEdit,
  onView,
}: Readonly<ExpenseRowActionsProps>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
          aria-label="Expense actions"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={onView}>
          <Eye className="h-4 w-4" />
          View expense
        </DropdownMenuItem>
        {canManage ? (
          <DropdownMenuItem onClick={onEdit}>
            <PencilLine className="h-4 w-4" />
            Edit expense
          </DropdownMenuItem>
        ) : null}
        {canManage ? (
          <DropdownMenuItem variant="destructive" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
            Delete expense
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
