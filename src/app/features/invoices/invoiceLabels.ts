import type { TranslationKey } from "../../shared/i18n/messages";
import type { InvoiceStatus, PaymentMethod } from "./types";

export function getInvoiceStatusLabel(status: InvoiceStatus): TranslationKey {
  if (status === "Paid") return "invoices.status.paid";
  if (status === "PartiallyPaid") return "invoices.status.partiallyPaid";
  return "invoices.status.unpaid";
}

export function getPaymentMethodLabel(method: PaymentMethod): TranslationKey {
  return method === "Wish" ? "invoices.paymentMethod.wish" : "invoices.paymentMethod.cash";
}
