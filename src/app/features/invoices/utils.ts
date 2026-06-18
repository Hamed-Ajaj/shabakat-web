import type { InvoiceDetail, InvoiceStatus } from "./types";

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

export function printInvoice(
  detail: InvoiceDetail,
  companyName: string,
) {
  const paymentRows = detail.payments.length
    ? detail.payments
        .map(
          (payment) => `
            <tr>
              <td>${payment.paymentDateLabel}</td>
              <td>${payment.paymentMethod}</td>
              <td>${escapeHtml(payment.notes || "-")}</td>
              <td style="text-align:right">${formatCurrency(payment.amount)}</td>
            </tr>
          `,
        )
        .join("")
    : `<tr><td colspan="4" style="text-align:center;color:#6b7280">No payments recorded.</td></tr>`;

  const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Invoice #${detail.invoiceNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #111827; margin: 32px; }
          h1,h2,h3,p { margin: 0; }
          .header { display:flex; justify-content:space-between; gap:24px; margin-bottom:32px; }
          .muted { color:#6b7280; font-size:12px; }
          .grid { display:grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap:16px; margin-bottom:24px; }
          .card { border:1px solid #e5e7eb; border-radius:16px; padding:16px; }
          .label { color:#6b7280; font-size:11px; text-transform:uppercase; letter-spacing:0.12em; margin-bottom:6px; }
          .value { font-weight:600; font-size:14px; }
          table { width:100%; border-collapse:collapse; margin-top:12px; }
          th, td { padding:12px; border-bottom:1px solid #e5e7eb; font-size:13px; text-align:left; }
          th { color:#6b7280; text-transform:uppercase; font-size:11px; letter-spacing:0.12em; }
          .totals { width:320px; margin-left:auto; margin-top:24px; }
          .totals-row { display:flex; justify-content:space-between; padding:8px 0; }
          .totals-row strong { font-size:16px; }
          @media print { body { margin: 18px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>${escapeHtml(companyName)}</h1>
            <p class="muted">Generator billing statement</p>
          </div>
          <div style="text-align:right">
            <h2>Invoice #${detail.invoiceNumber}</h2>
            <p class="muted">${detail.invoiceStatus}</p>
          </div>
        </div>

        <div class="grid">
          <div class="card">
            <div class="label">Customer</div>
            <div class="value">${escapeHtml(detail.customerName)}</div>
          </div>
          <div class="card">
            <div class="label">Issue Date</div>
            <div class="value">${detail.issueDateLabel}</div>
          </div>
          <div class="card">
            <div class="label">Due Date</div>
            <div class="value">${detail.dueDateLabel}</div>
          </div>
        </div>

        <div class="card">
          <div class="label">Invoice Summary</div>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align:right">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Fixed Charge</td><td style="text-align:right">${formatCurrency(detail.fixedCharge)}</td></tr>
              <tr><td>TVA</td><td style="text-align:right">${detail.tva}%</td></tr>
              <tr><td>Total Amount</td><td style="text-align:right">${formatCurrency(detail.totalAmount)}</td></tr>
              <tr><td>Paid Amount</td><td style="text-align:right">${formatCurrency(detail.paidAmount)}</td></tr>
              <tr><td>Outstanding</td><td style="text-align:right">${formatCurrency(detail.amountDue)}</td></tr>
            </tbody>
          </table>
        </div>

        <div class="card" style="margin-top:24px">
          <div class="label">Payments</div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Method</th>
                <th>Notes</th>
                <th style="text-align:right">Amount</th>
              </tr>
            </thead>
            <tbody>${paymentRows}</tbody>
          </table>
        </div>

        <div class="totals">
          <div class="totals-row"><span>Total Amount</span><span>${formatCurrency(detail.totalAmount)}</span></div>
          <div class="totals-row"><span>Paid Amount</span><span>${formatCurrency(detail.paidAmount)}</span></div>
          <div class="totals-row"><strong>Amount Due</strong><strong>${formatCurrency(detail.amountDue)}</strong></div>
        </div>
      </body>
    </html>
  `;

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

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
