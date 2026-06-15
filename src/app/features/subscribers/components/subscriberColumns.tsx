import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Avatar } from "../../../shared/components/Avatar";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import type { Subscriber } from "../../../shared/types/domain";

const columnHelper = createColumnHelper<Subscriber>();

export const subscriberColumns = [
  columnHelper.accessor("name", {
    header: ({ column }) => (
      <button className="inline-flex items-center gap-1" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Name
        <ArrowUpDown className="h-3.5 w-3.5" />
      </button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar name={row.original.name} />
        <span className="whitespace-nowrap text-sm font-medium text-foreground">{row.original.name}</span>
      </div>
    ),
  }),
  columnHelper.accessor("phone", {
    header: "Phone Number",
    cell: (info) => <span className="font-mono text-sm text-muted-foreground">{info.getValue()}</span>,
  }),
  columnHelper.accessor("area", {
    header: "Area",
    cell: (info) => <span className="text-sm text-foreground">{info.getValue()}</span>,
  }),
  columnHelper.accessor("ampere", {
    header: "Ampere",
    cell: (info) => <span className="font-mono text-sm font-bold text-primary">{info.getValue()}</span>,
  }),
  columnHelper.accessor("subscriptionDate", {
    header: "Since",
    cell: (info) => <span className="whitespace-nowrap text-sm text-muted-foreground">{info.getValue()}</span>,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => <StatusBadge status={info.getValue()} />,
  }),
  columnHelper.accessor("amount", {
    header: ({ column }) => (
      <button className="inline-flex items-center gap-1" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Amount
        <ArrowUpDown className="h-3.5 w-3.5" />
      </button>
    ),
    cell: (info) => <span className="font-mono text-sm font-semibold text-foreground">${info.getValue()}</span>,
  }),
  columnHelper.display({
    id: "actions",
    header: "",
    cell: () => (
      <button className="rounded-lg p-1 text-muted-foreground transition-colors hover:text-foreground" aria-label="More actions">
        <MoreHorizontal className="h-4 w-4" />
      </button>
    ),
  }),
];
