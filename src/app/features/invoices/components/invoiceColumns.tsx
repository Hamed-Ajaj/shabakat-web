import { createColumnHelper } from "@tanstack/react-table";
import { InvoiceRowActions } from "./InvoiceRowActions";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";
import type { InvoiceRow } from "../types";
import { formatCurrency } from "../utils";

const columnHelper = createColumnHelper<InvoiceRow>();

interface InvoiceColumnsOptions {
  canDelete: boolean;
  onDelete: (invoice: InvoiceRow) => void;
  onPay: (invoice: InvoiceRow) => void;
  onPrint: (invoice: InvoiceRow) => void;
  onView: (invoice: InvoiceRow) => void;
}

export function createInvoiceColumns({
  canDelete,
  onDelete,
  onPay,
  onPrint,
  onView,
}: InvoiceColumnsOptions) {
  return [
    columnHelper.accessor("invoiceNumber", {
      header: "Invoice #",
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
      header: "Customer",
      cell: (info) => (
        <div>
          <p className="font-medium text-foreground">{info.getValue()}</p>
          <p className="text-xs text-muted-foreground">Issued {info.row.original.issueDateLabel}</p>
        </div>
      ),
    }),
    columnHelper.accessor("invoiceStatus", {
      header: "Status",
      cell: (info) => <InvoiceStatusBadge status={info.getValue()} />,
    }),
    columnHelper.accessor("dueDateLabel", {
      header: "Due Date",
      cell: (info) => <span className="text-sm text-foreground">{info.getValue()}</span>,
    }),
    columnHelper.accessor("totalAmount", {
      header: "Total",
      cell: (info) => <span className="font-mono text-sm font-semibold text-foreground">{formatCurrency(info.getValue())}</span>,
    }),
    columnHelper.accessor("amountDue", {
      header: "Amount Due",
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
