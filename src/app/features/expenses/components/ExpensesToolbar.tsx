import { Button } from "../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import type { ExpenseType } from "../types";
import { expenseTypeOptions } from "../utils";

interface ExpensesToolbarProps {
  canManage: boolean;
  dateFrom: string;
  dateTo: string;
  expenseType: "" | ExpenseType;
  isFetching: boolean;
  total: number;
  totalAmount: string;
  onCreateClick: () => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onExpenseTypeChange: (value: "" | ExpenseType) => void;
  onResetFilters: () => void;
}

export function ExpensesToolbar({
  canManage,
  dateFrom,
  dateTo,
  expenseType,
  isFetching,
  total,
  totalAmount,
  onCreateClick,
  onDateFromChange,
  onDateToChange,
  onExpenseTypeChange,
  onResetFilters,
}: Readonly<ExpensesToolbarProps>) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <label className="w-full sm:w-56">
          <span className="sr-only">Expense type</span>
          <Select value={expenseType || "all"} onValueChange={(value) => onExpenseTypeChange(value === "all" ? "" : (value as ExpenseType))}>
            <SelectTrigger className="h-11 w-full rounded-xl border-white/8 bg-card">
              <SelectValue placeholder="All expense types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All expense types</SelectItem>
              {expenseTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
          <label className="min-w-40">
            <span className="sr-only">Date from</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(event) => onDateFromChange(event.target.value)}
              className="h-11 w-full rounded-xl border border-white/8 bg-card px-4 text-sm text-foreground outline-none transition focus:border-primary"
            />
          </label>

          <label className="min-w-40">
            <span className="sr-only">Date to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(event) => onDateToChange(event.target.value)}
              className="h-11 w-full rounded-xl border border-white/8 bg-card px-4 text-sm text-foreground outline-none transition focus:border-primary"
            />
          </label>

          <Button type="button" variant="outline" onClick={onResetFilters}>
            Reset
          </Button>

          {canManage ? (
            <Button type="button" onClick={onCreateClick} className="rounded-xl px-4 py-2.5 text-sm font-medium" style={{ boxShadow: "0 0 16px rgba(245,192,0,0.25)" }}>
              Add Expense
            </Button>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span>{total} matching expense{total === 1 ? "" : "s"}</span>
        <span>Total spend {totalAmount}</span>
        {isFetching ? <span>Refreshing...</span> : null}
      </div>
    </div>
  );
}
