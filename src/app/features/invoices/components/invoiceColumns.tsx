import { createColumnHelper } from "@tanstack/react-table";
import { InvoiceRowActions } from "./InvoiceRowActions";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";
import type { InvoiceRow } from "../types";

const columnHelper = createColumnHelper<InvoiceRow>();

interface InvoiceColumnsOptions {
  canDelete: boolean;
  formatCurrency: (value: number) => string;
  formatDate: (value: string) => string;
  onDelete: (invoice: InvoiceRow) => void;
  onPay: (invoice: InvoiceRow) => void;
  onPrint: (invoice: InvoiceRow) => void;
  t: (key: any, values?: Record<string, string | number>) => string;
  onView: (invoice: InvoiceRow) => void;
}

export function createInvoiceColumns({
  canDelete,
  formatCurrency,
  formatDate,
  onDelete,
  onPay,
  onPrint,
  t,
  onView,
}: InvoiceColumnsOptions) {
  return [
    columnHelper.accessor("invoiceNumber", {
      header: t("invoices.table.invoiceNumber"),
      cell: (info) => (
        <button
          type="button"
          className="font-mono text-sm font-semibold text-foreground transition hover:text-primary"
          onClick={() => onView(info.row.original)}
        >
          #{info.getValue()}
        </button>
      ),
    }),
    columnHelper.accessor("customerName", {
      header: t("invoices.table.customer"),
      cell: (info) => (
        <div>
          <p className="font-medium text-foreground">{info.getValue()}</p>
          <p className="text-xs text-muted-foreground">{t("invoices.table.issued", { date: formatDate(info.row.original.issueDate) })}</p>
        </div>
      ),
    }),
    columnHelper.accessor("invoiceStatus", {
      header: t("invoices.table.status"),
      cell: (info) => <InvoiceStatusBadge status={info.getValue()} />,
    }),
    columnHelper.accessor("dueDate", {
      header: t("invoices.table.dueDate"),
      cell: (info) => <span className="text-sm text-foreground">{formatDate(info.getValue())}</span>,
    }),
    columnHelper.accessor("totalAmount", {
      header: t("invoices.table.total"),
      cell: (info) => <span className="font-mono text-sm font-semibold text-foreground">{formatCurrency(info.getValue())}</span>,
    }),
    columnHelper.accessor("amountDue", {
      header: t("invoices.table.amountDue"),
      cell: (info) => <span className="font-mono text-sm font-semibold text-primary">{formatCurrency(info.getValue())}</span>,
    }),
    columnHelper.display({
      id: "actions",
      header: "",
      cell: (info) => (
        <div className="flex justify-end">
          <InvoiceRowActions
            canDelete={canDelete}
            onDelete={() => onDelete(info.row.original)}
            onPay={() => onPay(info.row.original)}
            onPrint={() => onPrint(info.row.original)}
            onView={() => onView(info.row.original)}
          />
        </div>
      ),
    }),
  ];
}
