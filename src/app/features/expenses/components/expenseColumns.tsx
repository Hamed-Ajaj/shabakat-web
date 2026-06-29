import type { ColumnDef } from "@tanstack/react-table";
import type { ExpenseRow } from "../types";
import { ExpenseTypeBadge } from "./ExpenseTypeBadge";
import { ExpenseRowActions } from "./ExpenseRowActions";
import type { TranslationKey } from "../../../shared/i18n/messages";

interface CreateExpenseColumnsOptions {
  canManage: boolean;
  formatDate: (value: string) => string;
  formatCurrency: (value: number) => string;
  onDelete: (expense: ExpenseRow) => void;
  onEdit: (expense: ExpenseRow) => void;
  onView: (expense: ExpenseRow) => void;
  t: (key: TranslationKey) => string;
}

export function createExpenseColumns({
  canManage,
  formatCurrency,
  formatDate,
  onDelete,
  onEdit,
  onView,
  t,
}: CreateExpenseColumnsOptions): ColumnDef<ExpenseRow>[] {
  return [
    {
      accessorKey: "expenseType",
      header: t("expenses.table.type"),
      cell: ({ row }) => <ExpenseTypeBadge type={row.original.expenseType} />,
    },
    {
      accessorKey: "amount",
      header: t("expenses.table.amount"),
      cell: ({ row }) => (
        <span className="font-semibold text-foreground">{formatCurrency(row.original.amount)}</span>
      ),
    },
    {
      accessorKey: "expenseDate",
      header: t("expenses.table.expenseDate"),
      cell: ({ row }) => <span className="text-sm text-foreground">{formatDate(row.original.expenseDate)}</span>,
    },
    {
      accessorKey: "label",
      header: t("expenses.table.label"),
      cell: ({ row }) => (
        <span className="text-sm text-foreground">{row.original.label || t("common.labels.notSet")}</span>
      ),
    },
    {
      accessorKey: "notes",
      header: t("expenses.table.notes"),
      cell: ({ row }) => (
        <span className="line-clamp-1 max-w-[280px] text-sm text-muted-foreground">
          {row.original.notes || t("expenses.notesEmpty")}
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
