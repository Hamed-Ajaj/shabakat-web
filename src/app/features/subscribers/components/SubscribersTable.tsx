import { flexRender, getCoreRowModel, getSortedRowModel, type SortingState, useReactTable } from "@tanstack/react-table";
import { useState } from "react";
import { SectionCard } from "../../../shared/components/SectionCard";
import type { Subscriber } from "../../../shared/types/domain";
import { subscriberColumns } from "./subscriberColumns";

export interface SubscribersTableProps {
  data: Subscriber[];
}

export function SubscribersTable({ data }: Readonly<SubscribersTableProps>) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "amount", desc: true }]);

  const table = useReactTable({
    data,
    columns: subscriberColumns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <SectionCard className="overflow-hidden">
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
    </SectionCard>
  );
}
