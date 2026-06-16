import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type OnChangeFn,
  type PaginationState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { SectionCard } from "../../../shared/components/SectionCard";
import type { SubscriberRow } from "../types";
import { createSubscriberColumns } from "./subscriberColumns";

export interface SubscribersTableProps {
  canDelete: boolean;
  data: SubscriberRow[];
  error: string;
  isFetching: boolean;
  isLoading: boolean;
  onDelete: (subscriber: SubscriberRow) => void;
  onEdit: (subscriber: SubscriberRow) => void;
  onPaginationChange: OnChangeFn<PaginationState>;
  onPageSizeChange: (value: number) => void;
  onView: (subscriber: SubscriberRow) => void;
  pagination: PaginationState;
  totalCount: number;
}

export function SubscribersTable({
  data,
  error,
  isFetching,
  isLoading,
  canDelete,
  onDelete,
  onEdit,
  onPaginationChange,
  onPageSizeChange,
  onView,
  pagination,
  totalCount,
}: Readonly<SubscribersTableProps>) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "amountDue", desc: true }]);
  const columns = useMemo(
    () => createSubscriberColumns({ canDelete, onDelete, onEdit, onView }),
    [canDelete, onDelete, onEdit, onView],
  );

  const table = useReactTable({
    data,
    columns,
    state: { pagination, sorting },
    manualPagination: true,
    onPaginationChange,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    rowCount: totalCount,
  });

  return (
    <SectionCard className="overflow-hidden">
      {isLoading ? (
        <div className="px-4 py-10 text-sm text-muted-foreground">Loading subscribers...</div>
      ) : null}

      {!isLoading && error ? (
        <div className="px-4 py-10 text-sm text-red-300">{error}</div>
      ) : null}

      {!isLoading && !error && data.length === 0 ? (
        <div className="px-4 py-10 text-sm text-muted-foreground">No subscribers matched the current filters.</div>
      ) : null}

      {!isLoading && !error && data.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px]">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b border-white/8">
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
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
              {isFetching ? " · Updating..." : ""}
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              <Select
                value={String(pagination.pageSize)}
                onValueChange={(value) => onPageSizeChange(Number(value))}
              >
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
              <Button
                type="button"
                variant="outline"
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.previousPage()}
              >
                Previous
              </Button>
              <span className="min-w-24 text-center">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </span>
              <Button
                type="button"
                variant="outline"
                disabled={!table.getCanNextPage()}
                onClick={() => table.nextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      ) : null}
    </SectionCard>
  );
}
