import type { TranslationKey } from "../../shared/i18n/messages";
import type { ExpenseType } from "./types";

const expenseTypeLabelKeys: Record<ExpenseType, TranslationKey> = {
  Fuel: "expenses.type.fuel",
  Maintenance: "expenses.type.maintenance",
  Employees: "expenses.type.employees",
  Other: "expenses.type.other",
};

const expenseTypeDescriptionKeys: Record<ExpenseType, TranslationKey> = {
  Fuel: "expenses.typeDescription.fuel",
  Maintenance: "expenses.typeDescription.maintenance",
  Employees: "expenses.typeDescription.employees",
  Other: "expenses.typeDescription.other",
};

export function getExpenseTypeLabel(type: ExpenseType, t: (key: TranslationKey) => string) {
  return t(expenseTypeLabelKeys[type]);
}

export function getExpenseTypeDescription(type: ExpenseType, t: (key: TranslationKey) => string) {
  return t(expenseTypeDescriptionKeys[type]);
}

export const expenseTypes: ExpenseType[] = ["Fuel", "Maintenance", "Employees", "Other"];
