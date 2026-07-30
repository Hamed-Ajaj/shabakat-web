import type { InvoiceStatus } from "./types";

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
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function printInvoiceHtml(html: string) {
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.setAttribute("aria-hidden", "true");
  document.body.appendChild(iframe);

  const printWindow = iframe.contentWindow;

  if (!printWindow) {
    document.body.removeChild(iframe);
    throw new Error("Unable to prepare print view.");
  }

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  const cleanup = () => {
    window.setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 1000);
  };

  printWindow.addEventListener("afterprint", cleanup, { once: true });
  window.setTimeout(() => {
    printWindow.focus();
    printWindow.print();
    cleanup();
  }, 150);
}

export function mapInvoiceStatusToBadge(status: InvoiceStatus): "paid" | "unpaid" | "overdue" | "partiallyPaid" {
  if (status === "Paid") {
    return "paid";
  }

  if (status === "PartiallyPaid") {
    return "partiallyPaid";
  }

  return "unpaid";
}

export interface InvoiceBreakdown {
  charge: number;
  fixedCharge: number;
  tvaAmount: number;
  tvaRate: number;
}

export interface BreakdownCustomer {
  plan: "Ampere" | "Kilowatt" | "FixedKilowatt";
  planValue: number | null;
}

export interface BreakdownSibling {
  id: string;
  invoiceNumber: number;
  issueDate: string;
  createdAt: string;
}

function isEarlierSibling(a: BreakdownSibling, b: BreakdownSibling): boolean {
  if (a.invoiceNumber !== b.invoiceNumber) {
    return a.invoiceNumber < b.invoiceNumber;
  }
  return a.createdAt < b.createdAt;
}

export function computeInvoiceBreakdown(
  totalAmount: number,
  fixedCharge: number,
  tva: number,
  customer: BreakdownCustomer | null,
  currentInvoiceId: string,
  currentInvoiceNumber: number,
  currentInvoiceCreatedAt: string,
  currentIssueDate: string,
  siblingInvoices: BreakdownSibling[],
): InvoiceBreakdown {
  let includePlanValue = false;

  if (customer) {
    if (customer.plan === "Kilowatt") {
      includePlanValue = true;
    } else if (customer.plan === "FixedKilowatt") {
      const currentSibling: BreakdownSibling = {
        id: currentInvoiceId,
        invoiceNumber: currentInvoiceNumber,
        issueDate: currentIssueDate,
        createdAt: currentInvoiceCreatedAt,
      };

      const issueDate = new Date(currentIssueDate);
      const yearMonth = `${issueDate.getFullYear()}-${issueDate.getMonth()}`;

      const hasEarlier = siblingInvoices.some((s) => {
        if (s.id === currentInvoiceId) return false;
        const sDate = new Date(s.issueDate);
        if (`${sDate.getFullYear()}-${sDate.getMonth()}` !== yearMonth) return false;
        return isEarlierSibling(s, currentSibling);
      });

      includePlanValue = !hasEarlier;
    }
  }

  const planValue = includePlanValue ? (customer?.planValue ?? 0) : 0;
  const taxableTotal = totalAmount - planValue;

  let charge: number;
  let tvaAmount: number;

  if (tva <= 0) {
    charge = taxableTotal - fixedCharge;
    tvaAmount = 0;
  } else {
    const rate = tva / 100;
    const subtotal = taxableTotal / (1 + rate);
    charge = subtotal - fixedCharge;
    tvaAmount = subtotal * rate;
  }

  return {
    charge: charge + planValue,
    fixedCharge,
    tvaAmount,
    tvaRate: tva,
  };
}
