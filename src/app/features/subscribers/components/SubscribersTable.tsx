import { flexRender, getCoreRowModel, getSortedRowModel, type SortingState, useReactTable } from "@tanstack/react-table";
import { useState } from "react";
import { SectionCard } from "../../../shared/components/SectionCard";
import type { SubscriberRow } from "../types";
import { createSubscriberColumns } from "./subscriberColumns";

export interface SubscribersTableProps {
  data: SubscriberRow[];
  error: string;
  isLoading: boolean;
  canDelete: boolean;
  onDelete: (subscriber: SubscriberRow) => void;
  onEdit: (subscriber: SubscriberRow) => void;
  onView: (subscriber: SubscriberRow) => void;
}

export function SubscribersTable({
  data,
  error,
  isLoading,
  canDelete,
  onDelete,
  onEdit,
  onView,
}: Readonly<SubscribersTableProps>) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "amountDue", desc: true }]);
  const columns = createSubscriberColumns({ canDelete, onDelete, onEdit, onView });

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
      ) : null}
    </SectionCard>
  );
}
