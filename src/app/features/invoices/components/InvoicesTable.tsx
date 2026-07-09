import {
  flexRender,
  getCoreRowModel,
  type OnChangeFn,
  type PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { Button } from "../../../components/ui/button";
import { Skeleton } from "../../../components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { useI18n } from "../../../providers/I18nProvider";
import { SectionCard } from "../../../shared/components/SectionCard";
import type { InvoiceRow } from "../types";
import { formatCurrency } from "../utils";
import { createInvoiceColumns } from "./invoiceColumns";

interface InvoicesTableProps {
  canDelete: boolean;
  data: InvoiceRow[];
  error: string;
  isFetching: boolean;
  isLoading: boolean;
  onDelete: (invoice: InvoiceRow) => void;
  onPageSizeChange: (value: number) => void;
  onPaginationChange: OnChangeFn<PaginationState>;
  onPay: (invoice: InvoiceRow) => void;
  onPrint: (invoice: InvoiceRow) => void;
  onView: (invoice: InvoiceRow) => void;
  pagination: PaginationState;
  totalCount: number;
}

export function InvoicesTable({
  canDelete,
  data,
  error,
  isFetching,
  isLoading,
  onDelete,
  onPageSizeChange,
  onPaginationChange,
  onPay,
  onPrint,
  onView,
  pagination,
  totalCount,
}: Readonly<InvoicesTableProps>) {
  const { formatDate, t } = useI18n();
  const columns = useMemo(
    () => createInvoiceColumns({ canDelete, formatCurrency, formatDate, onDelete, onPay, onPrint, onView, t }),
    [canDelete, formatDate, onDelete, onPay, onPrint, onView, t],
  );

  const table = useReactTable({
    data,
    columns,
    state: { pagination },
    manualPagination: true,
    onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    rowCount: totalCount,
  });

  return (
    <SectionCard className="overflow-hidden">
      {isLoading ? <InvoicesTableSkeleton /> : null}
      {!isLoading && error ? <div className="px-4 py-10 text-sm text-red-300">{error}</div> : null}
      {!isLoading && !error && data.length === 0 ? (
        <div className="px-4 py-10 text-sm text-muted-foreground">{t("invoices.empty")}</div>
      ) : null}

      {!isLoading && !error && data.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[840px]">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b border-white/8">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3.5 text-start text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                      >
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b border-white/8 transition-colors hover:bg-white/[0.03]">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3.5 align-middle">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-white/8 px-4 py-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
            <div>
              {t(isFetching ? "invoices.pageInfoUpdating" : "invoices.pageInfo", {
                from: pagination.pageIndex * pagination.pageSize + 1,
                to: pagination.pageIndex * pagination.pageSize + data.length,
                total: totalCount,
              })}
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              <Select value={String(pagination.pageSize)} onValueChange={(value) => onPageSizeChange(Number(value))}>
                <SelectTrigger className="h-9 w-28 rounded-xl border-white/8 bg-card">
                  <SelectValue placeholder={t("invoices.pageSizePlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 50].map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {t("invoices.pageSize", { size })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button type="button" variant="outline" disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}>
                {t("invoices.actions.previous")}
              </Button>
              <span className="min-w-24 text-center">
                {t("invoices.pageNumber", { page: table.getState().pagination.pageIndex + 1, count: table.getPageCount() })}
              </span>
              <Button type="button" variant="outline" disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>
                {t("invoices.actions.next")}
              </Button>
            </div>
          </div>
        </>
      ) : null}
    </SectionCard>
  );
}

function InvoicesTableSkeleton() {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[840px]">
          <thead>
            <tr className="border-b border-white/8">
              {Array.from({ length: 6 }).map((_, index) => (
                <th key={index} className="px-4 py-3.5">
                  <Skeleton className="h-4 w-24" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b border-white/8">
                {Array.from({ length: 6 }).map((__, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-3.5">
                    <Skeleton className="h-4 w-full" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-white/8 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <Skeleton className="h-4 w-40" />
        <div className="flex items-center gap-2 self-end md:self-auto">
          <Skeleton className="h-9 w-28 rounded-xl" />
          <Skeleton className="h-9 w-24 rounded-xl" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-24 rounded-xl" />
        </div>
      </div>
    </>
  );
}
