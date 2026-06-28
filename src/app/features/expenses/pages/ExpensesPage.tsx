import { Suspense, lazy, useMemo, useState } from "react";
import type { PaginationState } from "@tanstack/react-table";
import { useAuth } from "../../../providers/AuthProvider";
import { useI18n } from "../../../providers/I18nProvider";
import { ExpenseSummaryCards } from "../components/ExpenseSummaryCards";
import { ExpensesTable } from "../components/ExpensesTable";
import { ExpensesToolbar } from "../components/ExpensesToolbar";
import { useExpensesQuery } from "../queries";
import type { ExpenseRow, ExpenseType, ExpensesQueryFilters } from "../types";
import { formatCurrency } from "../utils";

type ExpenseDialogMode = "create" | "delete" | "edit" | "view" | null;
const EMPTY_EXPENSES: ExpenseRow[] = [];

const CreateExpenseSheet = lazy(() =>
  import("../components/CreateExpenseSheet").then((module) => ({ default: module.CreateExpenseSheet })),
);
const EditExpenseSheet = lazy(() =>
  import("../components/EditExpenseSheet").then((module) => ({ default: module.EditExpenseSheet })),
);
const ExpenseDetailsSheet = lazy(() =>
  import("../components/ExpenseDetailsSheet").then((module) => ({ default: module.ExpenseDetailsSheet })),
);
const DeleteExpenseDialog = lazy(() =>
  import("../components/DeleteExpenseDialog").then((module) => ({ default: module.DeleteExpenseDialog })),
);

export default function ExpensesPage() {
  const { session } = useAuth();
  const { t } = useI18n();
  const [dialogMode, setDialogMode] = useState<ExpenseDialogMode>(null);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseRow | null>(null);
  const [expenseType, setExpenseType] = useState<"" | ExpenseType>("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const filters = useMemo<ExpensesQueryFilters>(
    () => ({
      dateFrom,
      dateTo,
      expenseType,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
    }),
    [dateFrom, dateTo, expenseType, pagination.pageIndex, pagination.pageSize],
  );
  const expensesQuery = useExpensesQuery(filters);
  const canManage = session?.role === "Owner" || session?.role === "Admin";
  const expensesPage = expensesQuery.data;
  const expenses = expensesPage?.data ?? EMPTY_EXPENSES;
  const pageAmount = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses],
  );

  function goToFirstPage() {
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  }

  function openDialog(mode: Exclude<ExpenseDialogMode, null>, expense: ExpenseRow | null = null) {
    setSelectedExpense(expense);
    setDialogMode(mode);
  }

  function closeDialog() {
    setDialogMode(null);
    setSelectedExpense(null);
  }

  function resetFilters() {
    setExpenseType("");
    setDateFrom("");
    setDateTo("");
    goToFirstPage();
  }

  function handleDialogOpenChange(open: boolean) {
    if (!open) {
      closeDialog();
    }
  }

  return (
    <div className="space-y-4">
      <ExpenseSummaryCards
        currentPageCount={expenses.length}
        isLoading={expensesQuery.isLoading}
        pageAmount={formatCurrency(pageAmount)}
        totalAmount={formatCurrency(expensesPage?.totalAmount ?? 0)}
        totalCount={expensesPage?.totalCount ?? 0}
      />

      <ExpensesToolbar
        canManage={canManage}
        dateFrom={dateFrom}
        dateTo={dateTo}
        expenseType={expenseType}
        isFetching={expensesQuery.isFetching}
        total={expensesPage?.totalCount ?? 0}
        totalAmount={formatCurrency(expensesPage?.totalAmount ?? 0)}
        onCreateClick={() => openDialog("create")}
        onDateFromChange={(value) => {
          setDateFrom(value);
          goToFirstPage();
        }}
        onDateToChange={(value) => {
          setDateTo(value);
          goToFirstPage();
        }}
        onExpenseTypeChange={(value) => {
          setExpenseType(value);
          goToFirstPage();
        }}
        onResetFilters={resetFilters}
      />

      <ExpensesTable
        canManage={canManage}
        data={expenses}
        error={expensesQuery.error instanceof Error ? expensesQuery.error.message : ""}
        isFetching={expensesQuery.isFetching}
        isLoading={expensesQuery.isLoading}
        onDelete={(expense) => openDialog("delete", expense)}
        onEdit={(expense) => openDialog("edit", expense)}
        onPageSizeChange={(value) => setPagination({ pageIndex: 0, pageSize: value })}
        onPaginationChange={setPagination}
        onView={(expense) => openDialog("view", expense)}
        pagination={pagination}
        totalCount={expensesPage?.totalCount ?? 0}
      />

      <Suspense fallback={null}>
        <CreateExpenseSheet
          open={dialogMode === "create"}
          onOpenChange={handleDialogOpenChange}
        />
        <EditExpenseSheet
          expenseId={selectedExpense?.id ?? null}
          open={dialogMode === "edit"}
          onOpenChange={handleDialogOpenChange}
        />
        <ExpenseDetailsSheet
          expenseId={selectedExpense?.id ?? null}
          open={dialogMode === "view"}
          onOpenChange={handleDialogOpenChange}
        />
        <DeleteExpenseDialog
          expenseId={selectedExpense?.id ?? null}
          expenseLabel={selectedExpense?.label || (selectedExpense ? t("expenses.delete.fallbackName") : "")}
          open={dialogMode === "delete"}
          onOpenChange={handleDialogOpenChange}
        />
      </Suspense>
    </div>
  );
}
