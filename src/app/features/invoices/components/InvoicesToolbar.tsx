import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import type { InvoiceCustomerOption, InvoiceStatus } from "../types";

interface InvoicesToolbarProps {
  canBulkCreate: boolean;
  customerId: string;
  customers: InvoiceCustomerOption[];
  invoiceStatus: "" | InvoiceStatus;
  issueDateFrom: string;
  issueDateTo: string;
  isFetching: boolean;
  total: number;
  onBulkCreateClick: () => void;
  onCreateClick: () => void;
  onCustomerChange: (value: string) => void;
  onIssueDateFromChange: (value: string) => void;
  onIssueDateToChange: (value: string) => void;
  onResetFilters: () => void;
  onStatusChange: (value: "" | InvoiceStatus) => void;
}

export function InvoicesToolbar({
  canBulkCreate,
  customerId,
  customers,
  invoiceStatus,
  issueDateFrom,
  issueDateTo,
  isFetching,
  total,
  onBulkCreateClick,
  onCreateClick,
  onCustomerChange,
  onIssueDateFromChange,
  onIssueDateToChange,
  onResetFilters,
  onStatusChange,
}: Readonly<InvoicesToolbarProps>) {
  const customerValue = customerId || "all";
  const statusValue = invoiceStatus || "all";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-64 flex-1">
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Customer</label>
          <Select value={customerValue} onValueChange={(value) => onCustomerChange(value === "all" ? "" : value)}>
            <SelectTrigger className="rounded-xl border-white/8 bg-card">
              <SelectValue placeholder="All customers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All customers</SelectItem>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-48">
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Status</label>
          <Select value={statusValue} onValueChange={(value) => onStatusChange(value === "all" ? "" : (value as InvoiceStatus))}>
            <SelectTrigger className="rounded-xl border-white/8 bg-card">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Unpaid">Unpaid</SelectItem>
              <SelectItem value="PartiallyPaid">Partially paid</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-44">
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Issue Date From</label>
          <Input type="date" value={issueDateFrom} onChange={(event) => onIssueDateFromChange(event.target.value)} className="rounded-xl border-white/8 bg-card" />
        </div>

        <div className="min-w-44">
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Issue Date To</label>
          <Input type="date" value={issueDateTo} onChange={(event) => onIssueDateToChange(event.target.value)} className="rounded-xl border-white/8 bg-card" />
        </div>

        <Button type="button" variant="outline" onClick={onResetFilters}>
          Reset
        </Button>

        {canBulkCreate ? (
          <Button type="button" variant="outline" onClick={onBulkCreateClick}>
            Bulk Generate
          </Button>
        ) : null}

        <Button type="button" onClick={onCreateClick} className="rounded-xl px-4 py-2.5 text-sm font-medium" style={{ boxShadow: "0 0 16px rgba(245,192,0,0.25)" }}>
          Create Invoice
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        {total} invoice{total === 1 ? "" : "s"}
        {isFetching ? " · Refreshing..." : ""}
      </p>
    </div>
  );
}
