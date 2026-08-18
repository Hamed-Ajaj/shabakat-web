import type { TranslationKey } from "../../shared/i18n/messages";
import type { AuditLog } from "./types";

const MESSAGE_KEYS: Record<string, TranslationKey> = {
  "audit.customer.created": "audit.customer.created",
  "audit.customer.updated": "audit.customer.updated",
  "audit.customer.deleted": "audit.customer.deleted",
  "audit.expense.created": "audit.expense.created",
  "audit.expense.updated": "audit.expense.updated",
  "audit.expense.deleted": "audit.expense.deleted",
  "audit.invoice.created": "audit.invoice.created",
  "audit.invoice.bulk_created": "audit.invoice.bulk_created",
  "audit.invoice.payment_recorded": "audit.invoice.payment_recorded",
  "audit.invoice.fixed_kilowatt_charge": "audit.invoice.fixed_kilowatt_charge",
};

type Translate = (key: TranslationKey, values?: Record<string, string | number | undefined>) => string;

export const AUDIT_ACTION_LABEL_KEYS: Record<string, TranslationKey> = {
  CustomerCreated: "audit.action.customerCreated",
  CustomerUpdated: "audit.action.customerUpdated",
  CustomerDeleted: "audit.action.customerDeleted",
  InvoiceCreated: "audit.action.invoiceCreated",
  InvoiceBulkCreated: "audit.action.invoiceBulkCreated",
  InvoicePaymentRecorded: "audit.action.invoicePaymentRecorded",
  InvoiceFixedKilowattCharge: "audit.action.invoiceFixedKilowattCharge",
  ExpenseCreated: "audit.action.expenseCreated",
  ExpenseUpdated: "audit.action.expenseUpdated",
  ExpenseDeleted: "audit.action.expenseDeleted",
};

export const AUDIT_PARAM_LABEL_KEYS: Record<string, TranslationKey> = {
  name: "audit.field.name",
  plan: "audit.field.plan",
  phone: "audit.field.phone",
  customerType: "audit.field.customerType",
  expenseType: "audit.field.expenseType",
  amount: "audit.field.amount",
  expenseDate: "audit.field.expenseDate",
  label: "audit.field.label",
  invoiceNumber: "audit.field.invoiceNumber",
  customerName: "audit.field.customerName",
  totalAmount: "audit.field.totalAmount",
  consumptionStart: "audit.field.consumptionStart",
  consumptionEnd: "audit.field.consumptionEnd",
  created: "audit.field.created",
  skipped: "audit.field.skipped",
  paymentMethod: "audit.field.paymentMethod",
  paidAmount: "audit.field.paidAmount",
  paymentAmount: "audit.field.paymentAmount",
  billedConsumption: "audit.field.billedConsumption",
};

export function getAuditActionLabel(action: string, t: Translate) {
  const key = AUDIT_ACTION_LABEL_KEYS[action];
  return key ? t(key) : readableLabel(action);
}

export function getAuditParamLabel(param: string, t: Translate) {
  const key = AUDIT_PARAM_LABEL_KEYS[param];
  return key ? t(key) : readableLabel(param);
}

export const AUDIT_ENTITY_LABEL_KEYS: Record<string, TranslationKey> = {
  Customer: "audit.entity.customer",
  Invoice: "audit.entity.invoice",
  Payment: "audit.entity.payment",
  Expense: "audit.entity.expense",
};

export function getAuditEntityLabel(entityType: string | null, t: Translate) {
  if (!entityType) return "";
  const key = AUDIT_ENTITY_LABEL_KEYS[entityType];
  return key ? t(key) : readableLabel(entityType);
}

export function getAuditSummary(log: AuditLog, t: Translate) {
  const messageKey = MESSAGE_KEYS[log.messageKey];
  if (messageKey) {
    return t(messageKey, Object.fromEntries(
      Object.entries(log.parameters).flatMap(([key, value]) =>
        typeof value === "string" || typeof value === "number" ? [[key, value]] : [],
      ),
    ));
  }

  return stringValue(log.parameters.legacySummary) || readableLabel(log.action);
}

export function readableLabel(value: string) {
  return value.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[._-]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value : "";
}
