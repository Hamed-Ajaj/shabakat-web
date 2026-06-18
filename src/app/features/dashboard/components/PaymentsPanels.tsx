import { Link } from "react-router-dom";
import { Skeleton } from "../../../components/ui/skeleton";
import { Avatar } from "../../../shared/components/Avatar";
import { SectionCard } from "../../../shared/components/SectionCard";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import type { DashboardInvoiceItem } from "../types";

interface InvoicePanelProps {
  items: DashboardInvoiceItem[];
  loading?: boolean;
  error?: string;
}

export function RecentPaymentsPanel({ items, loading, error }: Readonly<InvoicePanelProps>) {
  if (loading) {
    return <PanelSkeleton className="lg:col-span-3" title="Recently Paid Invoices" />;
  }

  return (
    <SectionCard className="p-5 lg:col-span-3">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Recently Paid Invoices</h2>
        <Link to="/subscribers" className="text-xs font-medium text-primary transition-opacity hover:opacity-75">
          View all
        </Link>
      </div>

      {error ? (
        <PanelError message={error} />
      ) : items.length === 0 ? (
        <PanelEmpty message="No paid invoices yet for current dataset." />
      ) : (
        <div>
          {items.map((invoice) => (
            <div key={invoice.id} className="flex items-center gap-3 border-b border-white/8 py-3 last:border-b-0">
              <Avatar name={invoice.customerName} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{invoice.customerName}</p>
                <p className="text-xs text-muted-foreground">Invoice #{invoice.invoiceNumber} · Issued {formatDate(invoice.issueDate)}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-semibold text-foreground">{formatCurrency(invoice.paidAmount || invoice.totalAmount)}</p>
                <p className="text-xs text-muted-foreground">{formatDate(invoice.createdAt)}</p>
              </div>
              <StatusBadge status="paid" />
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

export function UpcomingDuePanel({ items, loading, error }: Readonly<InvoicePanelProps>) {
  if (loading) {
    return <PanelSkeleton className="lg:col-span-2" title="Upcoming Due" />;
  }

  return (
    <SectionCard className="p-5 lg:col-span-2">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Upcoming Due</h2>
        <span className="rounded-full border border-red-400/20 bg-red-400/10 px-2 py-0.5 text-xs font-medium text-red-400">
          {items.length} pending
        </span>
      </div>

      {error ? (
        <PanelError message={error} />
      ) : items.length === 0 ? (
        <PanelEmpty message="No unpaid or partially paid invoices found." />
      ) : (
        <div>
          {items.map((invoice) => (
            <div key={invoice.id} className="flex items-center gap-3 border-b border-white/8 py-3 last:border-b-0">
              <Avatar name={invoice.customerName} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{invoice.customerName}</p>
                <p className="text-xs text-muted-foreground">Due {formatDate(invoice.dueDate)}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-semibold text-foreground">{formatCurrency(invoice.amountDue)}</span>
                <StatusBadge status={resolveInvoiceStatus(invoice.dueDate)} />
              </div>
            </div>
          ))}
        </div>
      )}

      <LinkButton to="/subscribers">Review balances</LinkButton>
    </SectionCard>
  );
}

function PanelSkeleton({ className, title }: Readonly<{ className?: string; title: string }>) {
  return (
    <SectionCard className={`p-5 ${className ?? ""}`.trim()}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3 border-b border-white/8 py-3 last:border-b-0">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="min-w-0 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-2 h-3 w-24" />
            </div>
            <div className="text-right">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="mt-2 h-3 w-16" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function PanelError({ message }: Readonly<{ message: string }>) {
  return <p className="rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-300">{message}</p>;
}

function PanelEmpty({ message }: Readonly<{ message: string }>) {
  return <p className="rounded-xl border border-white/8 bg-white/[0.02] px-3 py-6 text-sm text-muted-foreground">{message}</p>;
}

function formatCurrency(value: number) {
  return `$${Math.round(value).toLocaleString()}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function resolveInvoiceStatus(dueDate: string) {
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return due < today ? "overdue" : "unpaid";
}

function LinkButton({ to, children }: Readonly<{ to: string; children: React.ReactNode }>) {
  return (
    <Link
      to={to}
      className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
      style={{ boxShadow: "0 0 16px rgba(245,192,0,0.2)" }}
    >
      {children}
    </Link>
  );
}
