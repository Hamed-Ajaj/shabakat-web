export type ExpenseType = "Fuel" | "Maintenance" | "Employees" | "Other";

export interface ExpenseRow {
  id: string;
  expenseType: ExpenseType;
  amount: number;
  expenseDate: string;
  expenseDateLabel: string;
  label: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseDetail extends ExpenseRow {
  createdAtLabel: string;
  updatedAtLabel: string;
}

export interface ExpensesQueryFilters {
  dateFrom: string;
  dateTo: string;
  expenseType: "" | ExpenseType;
  pageIndex: number;
  pageSize: number;
}

export interface ExpensesPageData {
  data: ExpenseRow[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  totalAmount: number;
}

export interface ExpensePayload {
  expenseType: ExpenseType;
  amount: number;
  expenseDate?: string;
  label?: string | null;
  notes?: string | null;
}
