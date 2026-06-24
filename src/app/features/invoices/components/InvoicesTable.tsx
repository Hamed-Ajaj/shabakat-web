import {
  flexRender,
  getCoreRowModel,
  type OnChangeFn,
  type PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { Button } from "../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { SectionCard } from "../../../shared/components/SectionCard";
import type { InvoiceRow } from "../types";
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
  const columns = useMemo(
    () => createInvoiceColumns({ canDelete, onDelete, onPay, onPrint, onView }),
    [canDelete, onDelete, onPay, onPrint, onView],
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
      {isLoading ? <div className="px-4 py-10 text-sm text-muted-foreground">Loading invoices...</div> : null}
      {!isLoading && error ? <div className="px-4 py-10 text-sm text-red-300">{error}</div> : null}
      {!isLoading && !error && data.length === 0 ? (
        <div className="px-4 py-10 text-sm text-muted-foreground">No invoices matched the current filters.</div>
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
                        className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
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
              Showing {pagination.pageIndex * pagination.pageSize + 1}
              {" - "}
              {pagination.pageIndex * pagination.pageSize + data.length}
              {" of "}
              {totalCount}
              {isFetching ? " · Refreshing..." : ""}
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              <Select value={String(pagination.pageSize)} onValueChange={(value) => onPageSizeChange(Number(value))}>
                <SelectTrigger className="h-9 w-28 rounded-xl border-white/8 bg-card">
                  <SelectValue placeholder="Page size" />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 50].map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size} / page
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button type="button" variant="outline" disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}>
                Previous
              </Button>
              <span className="min-w-24 text-center">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </span>
              <Button type="button" variant="outline" disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>
                Next
              </Button>
            </div>
          </div>
        </>
      ) : null}
    </SectionCard>
  );
}
