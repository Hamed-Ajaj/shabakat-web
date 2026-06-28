import { useState } from "react";
import type { PaginationState } from "@tanstack/react-table";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "../../../providers/AuthProvider";
import { useI18n } from "../../../providers/I18nProvider";
import { useInvoicesQuery } from "../queries";
import { InvoiceDetailsSheet } from "../components/InvoiceDetailsSheet";
import { InvoicesTable } from "../components/InvoicesTable";
import { InvoicesToolbar } from "../components/InvoicesToolbar";
import { CreateInvoiceDialog } from "../components/CreateInvoiceDialog";
import { BulkCreateInvoicesDialog } from "../components/BulkCreateInvoicesDialog";
import { RecordPaymentDialog } from "../components/RecordPaymentDialog";
import { DeleteInvoiceDialog } from "../components/DeleteInvoiceDialog";
import type { InvoiceRow, InvoiceStatus } from "../types";
import { useInvoiceCustomerOptionsQuery, invoiceQueryKeys } from "../queries";
import { fetchPrintableInvoiceHtml } from "../invoicesApi";
import { printInvoiceHtml } from "../utils";

type InvoiceDialogMode = "bulk" | "create" | "delete" | "pay" | "view" | null;

export default function InvoicesPage() {
  const { session } = useAuth();
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [dialogMode, setDialogMode] = useState<InvoiceDialogMode>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRow | null>(null);
  const [customerId, setCustomerId] = useState("");
  const [invoiceStatus, setInvoiceStatus] = useState<"" | InvoiceStatus>("");
  const [issueDateFrom, setIssueDateFrom] = useState("");
  const [issueDateTo, setIssueDateTo] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const canManage = session?.role === "Owner" || session?.role === "Admin";
  const invoicesQuery = useInvoicesQuery({
    customerId,
    invoiceStatus,
    issueDateFrom,
    issueDateTo,
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });
  const customersQuery = useInvoiceCustomerOptionsQuery();

  const invoicesPage = invoicesQuery.data;
  const invoices = invoicesPage?.data ?? [];

  function openDialog(mode: Exclude<InvoiceDialogMode, null>, invoice: InvoiceRow | null = null) {
    setSelectedInvoice(invoice);
    setDialogMode(mode);
  }

  function closeDialog() {
    setDialogMode(null);
    setSelectedInvoice(null);
  }

  async function handlePrint(invoice: InvoiceRow) {
    try {
      if (!session?.token) {
        throw new Error(t("invoices.error.loginToPrint"));
      }

      const html = await queryClient.fetchQuery({
        queryKey: [...invoiceQueryKeys.detail(invoice.id), "print-html"],
        queryFn: () => fetchPrintableInvoiceHtml(invoice.id, session.token),
      });

      if (!html) {
        throw new Error(t("invoices.error.printUnavailable"));
      }

      printInvoiceHtml(html);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("invoices.error.printFailed"));
    }
  }

  function resetFilters() {
    setCustomerId("");
    setInvoiceStatus("");
    setIssueDateFrom("");
    setIssueDateTo("");
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  }

  return (
    <div className="space-y-4">
      <InvoicesToolbar
        canBulkCreate={canManage}
        customerId={customerId}
        customers={customersQuery.data ?? []}
        invoiceStatus={invoiceStatus}
        issueDateFrom={issueDateFrom}
        issueDateTo={issueDateTo}
        isFetching={invoicesQuery.isFetching}
        total={invoicesPage?.totalCount ?? 0}
        onBulkCreateClick={() => openDialog("bulk")}
        onCreateClick={() => openDialog("create")}
        onCustomerChange={(value) => {
          setCustomerId(value);
          setPagination((current) => ({ ...current, pageIndex: 0 }));
        }}
        onIssueDateFromChange={(value) => {
          setIssueDateFrom(value);
          setPagination((current) => ({ ...current, pageIndex: 0 }));
        }}
        onIssueDateToChange={(value) => {
          setIssueDateTo(value);
          setPagination((current) => ({ ...current, pageIndex: 0 }));
        }}
        onResetFilters={resetFilters}
        onStatusChange={(value) => {
          setInvoiceStatus(value);
          setPagination((current) => ({ ...current, pageIndex: 0 }));
        }}
      />

      <InvoicesTable
        canDelete={canManage}
        data={invoices}
        error={invoicesQuery.error instanceof Error ? invoicesQuery.error.message : ""}
        isFetching={invoicesQuery.isFetching}
        isLoading={invoicesQuery.isLoading}
        onDelete={(invoice) => openDialog("delete", invoice)}
        onPageSizeChange={(value) => setPagination({ pageIndex: 0, pageSize: value })}
        onPaginationChange={setPagination}
        onPay={(invoice) => openDialog("pay", invoice)}
        onPrint={handlePrint}
        onView={(invoice) => openDialog("view", invoice)}
        pagination={pagination}
        totalCount={invoicesPage?.totalCount ?? 0}
      />

      <CreateInvoiceDialog
        open={dialogMode === "create"}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
      />

      <BulkCreateInvoicesDialog
        open={dialogMode === "bulk"}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
      />

      <InvoiceDetailsSheet
        invoiceId={selectedInvoice?.id ?? null}
        open={dialogMode === "view"}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
        onPayClick={() => openDialog("pay", selectedInvoice)}
      />

      <RecordPaymentDialog
        invoiceId={selectedInvoice?.id ?? null}
        open={dialogMode === "pay"}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
      />

      <DeleteInvoiceDialog
        invoiceId={selectedInvoice?.id ?? null}
        invoiceNumber={selectedInvoice?.invoiceNumber ?? null}
        open={dialogMode === "delete"}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
      />
    </div>
  );
}
