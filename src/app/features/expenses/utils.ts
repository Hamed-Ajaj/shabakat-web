import type { ExpenseType } from "./types";

export const expenseTypeOptions: Array<{ value: ExpenseType; label: string }> = [
  { value: "Fuel", label: "Fuel" },
  { value: "Maintenance", label: "Maintenance" },
  { value: "Employees", label: "Employees" },
  { value: "Other", label: "Other" },
];

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatCurrency(value: number) {
  return `$${Math.round(value).toLocaleString()}`;
}

export function getExpenseTypeDescription(type: ExpenseType) {
  switch (type) {
    case "Fuel":
      return "Generator diesel, oil, and fuel logistics.";
    case "Maintenance":
      return "Servicing, repairs, and spare parts.";
    case "Employees":
      return "Payroll and operating staff costs.";
    case "Other":
      return "Custom operational expense with label.";
  }
}
