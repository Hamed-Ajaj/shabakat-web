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
