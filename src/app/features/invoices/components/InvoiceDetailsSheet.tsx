import { Calendar, CircleDollarSign, CreditCard, ReceiptText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import { Skeleton } from "../../../components/ui/skeleton";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../../../components/ui/sheet";
import { SectionCard } from "../../../shared/components/SectionCard";
import { useAuth } from "../../../providers/AuthProvider";
import { useQueryClient } from "@tanstack/react-query";
import { fetchPrintableInvoiceHtml } from "../invoicesApi";
import { invoiceQueryKeys, useInvoiceDetailQuery } from "../queries";
import { formatCurrency, printInvoiceHtml } from "../utils";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";

interface InvoiceDetailsSheetProps {
  invoiceId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPayClick: () => void;
}

export function InvoiceDetailsSheet({
  invoiceId,
  open,
  onOpenChange,
  onPayClick,
}: Readonly<InvoiceDetailsSheetProps>) {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const detailQuery = useInvoiceDetailQuery(invoiceId ?? undefined);
  const invoice = detailQuery.data;

  async function handlePrint() {
    if (!invoice || !session?.token) {
      return;
    }

    try {
      const html = await queryClient.fetchQuery({
        queryKey: [...invoiceQueryKeys.detail(invoice.id), "print-html"],
        queryFn: () => fetchPrintableInvoiceHtml(invoice.id, session.token),
      });

      if (!html) {
        throw new Error("Printable invoice HTML is unavailable.");
      }

      printInvoiceHtml(html);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to print invoice.");
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto border-white/8 bg-background p-0 sm:max-w-2xl">
        <SheetHeader className="border-b border-white/8 px-6 py-5">
          <SheetTitle className="text-xl text-foreground">
            {invoice ? `Invoice #${invoice.invoiceNumber}` : "Invoice Details"}
          </SheetTitle>
          <SheetDescription>
            Review billing totals, payment history, and print server-backed invoice data.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-6 py-5">
          {detailQuery.isLoading ? <InvoiceDetailsSkeleton /> : null}
          {detailQuery.error instanceof Error ? <p className="text-sm text-red-300">{detailQuery.error.message}</p> : null}

          {invoice ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-foreground">{invoice.customerName}</p>
                  <p className="text-sm text-muted-foreground">Created {invoice.createdAtLabel}</p>
                </div>
                <div className="flex items-center gap-2">
                  <InvoiceStatusBadge status={invoice.invoiceStatus} />
                  <Button type="button" variant="outline" onClick={handlePrint}>
                    Print
                  </Button>
                  {invoice.invoiceStatus !== "Paid" ? (
                    <Button type="button" onClick={onPayClick}>
                      Record Payment
                    </Button>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <MetricCard label="Total Amount" value={formatCurrency(invoice.totalAmount)} />
                <MetricCard label="Paid Amount" value={formatCurrency(invoice.paidAmount)} />
                <MetricCard label="Amount Due" value={formatCurrency(invoice.amountDue)} />
              </div>

              <SectionCard className="space-y-4 p-5">
                <DetailRow icon={ReceiptText} label="Invoice Number" value={`#${invoice.invoiceNumber}`} />
                <DetailRow icon={Calendar} label="Issue Date" value={invoice.issueDateLabel} />
                <DetailRow icon={Calendar} label="Due Date" value={invoice.dueDateLabel} />
                <DetailRow icon={CircleDollarSign} label="Fixed Charge" value={formatCurrency(invoice.fixedCharge)} />
                <DetailRow icon={ReceiptText} label="TVA" value={`${invoice.tva}%`} />
                <DetailRow icon={Calendar} label="Last Updated" value={invoice.updatedAtLabel} />
              </SectionCard>

              <SectionCard className="space-y-4 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Payments</h3>
                  <span className="text-xs text-muted-foreground">{invoice.payments.length} payment{invoice.payments.length === 1 ? "" : "s"}</span>
                </div>

                {invoice.payments.length === 0 ? (
                  <p className="rounded-xl border border-white/8 bg-white/[0.02] px-3 py-6 text-sm text-muted-foreground">
                    No payments recorded yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {invoice.payments.map((payment) => (
                      <div key={payment.id} className="rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="font-medium text-foreground">{formatCurrency(payment.amount)}</p>
                            <p className="text-xs text-muted-foreground">{payment.paymentDateLabel}</p>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CreditCard className="h-4 w-4 text-primary" />
                            {payment.paymentMethod}
                          </div>
                        </div>
                        {payment.notes ? <p className="mt-2 text-sm text-muted-foreground">{payment.notes}</p> : null}
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>
            </>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function InvoiceDetailsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-7 w-44" />
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <SectionCard key={index} className="p-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-3 h-7 w-24" />
          </SectionCard>
        ))}
      </div>
      <Skeleton className="h-48 w-full rounded-2xl" />
      <Skeleton className="h-48 w-full rounded-2xl" />
    </div>
  );
}

function MetricCard({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <SectionCard className="p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-xl font-semibold text-foreground">{value}</p>
    </SectionCard>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: Readonly<{ icon: typeof ReceiptText; label: string; value: string }>) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-lg border border-white/8 bg-white/[0.03] p-2 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
        <p className="mt-1 text-sm text-foreground">{value}</p>
      </div>
    </div>
  );
}
