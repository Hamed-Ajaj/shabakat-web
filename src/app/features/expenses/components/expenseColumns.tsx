import type { ColumnDef } from "@tanstack/react-table";
import type { ExpenseRow } from "../types";
import { ExpenseTypeBadge } from "./ExpenseTypeBadge";
import { ExpenseRowActions } from "./ExpenseRowActions";
import { formatCurrency } from "../utils";

interface CreateExpenseColumnsOptions {
  canManage: boolean;
  onDelete: (expense: ExpenseRow) => void;
  onEdit: (expense: ExpenseRow) => void;
  onView: (expense: ExpenseRow) => void;
}

export function createExpenseColumns({
  canManage,
  onDelete,
  onEdit,
  onView,
}: CreateExpenseColumnsOptions): ColumnDef<ExpenseRow>[] {
  return [
    {
      accessorKey: "expenseType",
      header: "Type",
      cell: ({ row }) => <ExpenseTypeBadge type={row.original.expenseType} />,
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <span className="font-semibold text-foreground">{formatCurrency(row.original.amount)}</span>
      ),
    },
    {
      accessorKey: "expenseDateLabel",
      header: "Expense Date",
      cell: ({ row }) => <span className="text-sm text-foreground">{row.original.expenseDateLabel}</span>,
    },
    {
      accessorKey: "label",
      header: "Label",
      cell: ({ row }) => (
        <span className="text-sm text-foreground">{row.original.label || "Not set"}</span>
      ),
    },
    {
      accessorKey: "notes",
      header: "Notes",
      cell: ({ row }) => (
        <span className="line-clamp-1 max-w-[280px] text-sm text-muted-foreground">
          {row.original.notes || "No notes"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <ExpenseRowActions
            canManage={canManage}
            onDelete={() => onDelete(row.original)}
            onEdit={() => onEdit(row.original)}
            onView={() => onView(row.original)}
          />
        </div>
      ),
    },
  ];
}
