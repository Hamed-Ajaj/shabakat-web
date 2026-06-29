import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Avatar } from "../../../shared/components/Avatar";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import type { SubscriberRow } from "../types";
import { SubscriberRowActions } from "./SubscriberRowActions";

const columnHelper = createColumnHelper<SubscriberRow>();

interface SubscriberColumnsOptions {
  canDelete: boolean;
  formatDate: (value: string) => string;
  onDelete: (subscriber: SubscriberRow) => void;
  onEdit: (subscriber: SubscriberRow) => void;
  onView: (subscriber: SubscriberRow) => void;
  t: (key: any, values?: Record<string, string | number>) => string;
}

export function createSubscriberColumns({
  canDelete,
  formatDate,
  onDelete,
  onEdit,
  onView,
  t,
}: Readonly<SubscriberColumnsOptions>) {
  return [
  columnHelper.accessor("name", {
    header: ({ column }) => (
      <button className="inline-flex items-center gap-1" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        {t("subscribers.table.name")}
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
    header: t("subscribers.table.phoneNumber"),
    cell: (info) => <span className="font-mono text-sm text-muted-foreground">{info.getValue() ?? t("subscribers.notSet")}</span>,
  }),
  columnHelper.accessor("area", {
    header: t("subscribers.table.area"),
    cell: (info) => <span className="text-sm text-foreground">{info.getValue() ?? t("subscribers.unassigned")}</span>,
  }),
  columnHelper.accessor("planValue", {
    id: "plan",
    header: t("subscribers.table.plan"),
    cell: ({ row }) => (
      <span className="font-mono text-sm font-bold text-primary">
        {row.original.plan === "Ampere"
          ? `${formatNumberEn(row.original.planValue)} A`
          : row.original.plan === "FixedKilowatt"
            ? `${formatNumberEn(row.original.planValue)} kW prepaid`
            : `${formatNumberEn(row.original.planValue)} kW`}
      </span>
    ),
  }),
  columnHelper.accessor("subscriptionDate", {
    header: t("subscribers.table.since"),
    cell: (info) => <span className="whitespace-nowrap text-sm text-muted-foreground">{formatDate(info.getValue())}</span>,
  }),
  columnHelper.accessor("status", {
    header: t("subscribers.table.status"),
    cell: (info) => <StatusBadge status={info.getValue()} />,
  }),
  columnHelper.accessor("amountDue", {
    header: ({ column }) => (
      <button className="inline-flex items-center gap-1" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        {t("subscribers.table.amountDue")}
        <ArrowUpDown className="h-3.5 w-3.5" />
      </button>
    ),
    cell: (info) => <span className="font-mono text-sm font-semibold text-foreground">{formatCurrencyEn(info.getValue())}</span>,
  }),
  columnHelper.display({
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <SubscriberRowActions
        canDelete={canDelete}
        onDelete={() => onDelete(row.original)}
        onEdit={() => onEdit(row.original)}
        onView={() => onView(row.original)}
      />
    ),
  }),
];
}

function formatCurrencyEn(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumberEn(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}
