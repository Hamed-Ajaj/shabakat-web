import { apiRequest } from "../../shared/api/client";
import type {
  ExpenseDetail,
  ExpensePayload,
  ExpensesPageData,
  ExpensesQueryFilters,
  ExpenseRow,
  ExpenseType,
} from "./types";
import { formatCurrency, formatDate, formatDateTime } from "./utils";

interface ExpenseResponse {
  id: string;
  expenseType: ExpenseType;
  amount: number;
  expenseDate: string;
  label: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ExpenseListResponse {
  data: ExpenseResponse[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  totalAmount: number;
}

export async function fetchExpenses(filters: ExpensesQueryFilters, token: string): Promise<ExpensesPageData> {
  const params = new URLSearchParams({
    pageNumber: String(filters.pageIndex + 1),
    pageSize: String(filters.pageSize),
  });

  if (filters.dateFrom) {
    params.set("dateFrom", filters.dateFrom);
  }

  if (filters.dateTo) {
    params.set("dateTo", filters.dateTo);
  }

  if (filters.expenseType) {
    params.set("expenseType", filters.expenseType);
  }

  const response = await apiRequest<ExpenseListResponse>(`/api/v1/expenses?${params.toString()}`, undefined, token);

  return {
    data: response.data.map(mapExpenseRow),
    totalCount: response.totalCount,
    pageNumber: response.pageNumber,
    pageSize: response.pageSize,
    pageCount: response.totalPages,
    hasPreviousPage: response.hasPreviousPage,
    hasNextPage: response.hasNextPage,
    totalAmount: response.totalAmount,
  };
}

export async function fetchExpenseDetail(id: string, token: string): Promise<ExpenseDetail> {
  const response = await apiRequest<ExpenseResponse>(`/api/v1/expenses/${id}`, undefined, token);

  return {
    ...mapExpenseRow(response),
    createdAtLabel: formatDateTime(response.createdAt),
    updatedAtLabel: formatDateTime(response.updatedAt),
  };
}

export function createExpense(payload: ExpensePayload, token: string) {
  return apiRequest<ExpenseResponse>(
    "/api/v1/expenses",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
    token,
  );
}

export function updateExpense(id: string, payload: ExpensePayload, token: string) {
  return apiRequest<ExpenseResponse>(
    `/api/v1/expenses/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
    token,
  );
}

export function deleteExpense(id: string, token: string) {
  return apiRequest(
    `/api/v1/expenses/${id}`,
    {
      method: "DELETE",
    },
    token,
  );
}

function mapExpenseRow(response: ExpenseResponse): ExpenseRow {
  return {
    id: response.id,
    expenseType: response.expenseType,
    amount: response.amount,
    expenseDate: response.expenseDate,
    expenseDateLabel: formatDate(response.expenseDate),
    label: response.label ?? "",
    notes: response.notes ?? "",
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
  };
}

export { formatCurrency };
