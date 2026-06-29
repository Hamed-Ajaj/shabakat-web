import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { useI18n } from "../../../providers/I18nProvider";
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
  const { t } = useI18n();
  const customerValue = customerId || "all";
  const statusValue = invoiceStatus || "all";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-64 flex-1">
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("invoices.filters.customer")}</label>
          <Select value={customerValue} onValueChange={(value) => onCustomerChange(value === "all" ? "" : value)}>
            <SelectTrigger className="rounded-xl border-white/8 bg-card">
              <SelectValue placeholder={t("invoices.filters.allCustomers")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("invoices.filters.allCustomers")}</SelectItem>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-48">
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("invoices.filters.status")}</label>
          <Select value={statusValue} onValueChange={(value) => onStatusChange(value === "all" ? "" : (value as InvoiceStatus))}>
            <SelectTrigger className="rounded-xl border-white/8 bg-card">
              <SelectValue placeholder={t("invoices.filters.allStatuses")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("invoices.filters.allStatuses")}</SelectItem>
              <SelectItem value="Unpaid">{t("invoices.status.unpaid")}</SelectItem>
              <SelectItem value="PartiallyPaid">{t("invoices.status.partiallyPaid")}</SelectItem>
              <SelectItem value="Paid">{t("invoices.status.paid")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-44">
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("invoices.filters.issueDateFrom")}</label>
          <Input type="date" value={issueDateFrom} onChange={(event) => onIssueDateFromChange(event.target.value)} className="rounded-xl border-white/8 bg-card" />
        </div>

        <div className="min-w-44">
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("invoices.filters.issueDateTo")}</label>
          <Input type="date" value={issueDateTo} onChange={(event) => onIssueDateToChange(event.target.value)} className="rounded-xl border-white/8 bg-card" />
        </div>

        <Button type="button" variant="outline" onClick={onResetFilters}>
          {t("invoices.actions.reset")}
        </Button>

        {canBulkCreate ? (
          <Button type="button" variant="outline" onClick={onBulkCreateClick}>
            {t("invoices.actions.bulkGenerate")}
          </Button>
        ) : null}

        <Button type="button" onClick={onCreateClick} className="rounded-xl px-4 py-2.5 text-sm font-medium" style={{ boxShadow: "0 0 16px rgba(245,192,0,0.25)" }}>
          {t("invoices.actions.create")}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        {t(total === 1 ? "invoices.count" : "invoices.count_plural", { count: total })}
        {isFetching ? " · " + t("areas.refreshing") : ""}
      </p>
    </div>
  );
}
