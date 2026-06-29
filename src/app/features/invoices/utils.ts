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
  return `$${Math.round(value).toLocaleString()}`;
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

export function mapInvoiceStatusToBadge(status: InvoiceStatus): "paid" | "unpaid" | "overdue" {
  if (status === "Paid") {
    return "paid";
  }

  if (status === "PartiallyPaid") {
    return "overdue";
  }

  return "unpaid";
}
