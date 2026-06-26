import { Calendar, CircleDollarSign, FileText, HandCoins, NotebookText } from "lucide-react";
import { Skeleton } from "../../../components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet";
import { SectionCard } from "../../../shared/components/SectionCard";
import { useExpenseDetailQuery } from "../queries";
import { formatCurrency } from "../utils";
import { ExpenseTypeBadge } from "./ExpenseTypeBadge";

interface ExpenseDetailsSheetProps {
  expenseId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExpenseDetailsSheet({
  expenseId,
  open,
  onOpenChange,
}: Readonly<ExpenseDetailsSheetProps>) {
  const detailQuery = useExpenseDetailQuery(expenseId ?? undefined);
  const expense = detailQuery.data;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto border-white/8 bg-background p-0 sm:max-w-xl">
        <SheetHeader className="border-b border-white/8 px-6 py-5">
          <SheetTitle className="text-xl text-foreground">{expense?.label || "Expense Details"}</SheetTitle>
          <SheetDescription>
            Review expense amount, category, notes, and audit timestamps.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-6 py-5">
          {detailQuery.isLoading ? <ExpenseDetailsSkeleton /> : null}
          {detailQuery.error instanceof Error ? <p className="text-sm text-red-300">{detailQuery.error.message}</p> : null}

          {expense ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <MetricCard label="Amount" value={formatCurrency(expense.amount)} />
                <MetricCard label="Type" value={expense.expenseType} />
              </div>

              <SectionCard className="space-y-4 p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg border border-white/8 bg-white/[0.03] p-2 text-primary">
                    <HandCoins className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Category</p>
                    <div className="mt-1">
                      <ExpenseTypeBadge type={expense.expenseType} />
                    </div>
                  </div>
                </div>
                <DetailRow icon={CircleDollarSign} label="Amount" value={formatCurrency(expense.amount)} />
                <DetailRow icon={Calendar} label="Expense Date" value={expense.expenseDateLabel} />
                <DetailRow icon={FileText} label="Label" value={expense.label || "Not set"} />
                <DetailRow icon={NotebookText} label="Notes" value={expense.notes || "No notes"} />
                <DetailRow icon={Calendar} label="Created" value={expense.createdAtLabel} />
                <DetailRow icon={Calendar} label="Updated" value={expense.updatedAtLabel} />
              </SectionCard>
            </>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function ExpenseDetailsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <SectionCard className="p-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="mt-3 h-8 w-24" />
        </SectionCard>
        <SectionCard className="p-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="mt-3 h-8 w-24" />
        </SectionCard>
      </div>
      <SectionCard className="space-y-4 p-5">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex items-start gap-3">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        ))}
      </SectionCard>
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
}: Readonly<{ icon: typeof Calendar; label: string; value: string }>) {
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
