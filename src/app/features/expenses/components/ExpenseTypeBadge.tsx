import { Badge } from "../../../components/ui/badge";
import { useI18n } from "../../../providers/I18nProvider";
import type { ExpenseType } from "../types";
import { getExpenseTypeLabel } from "../expenseLabels";

const variantMap: Record<ExpenseType, string> = {
  Fuel: "bg-amber-500/12 text-amber-300 border-amber-500/20",
  Maintenance: "bg-sky-500/12 text-sky-300 border-sky-500/20",
  Employees: "bg-emerald-500/12 text-emerald-300 border-emerald-500/20",
  Other: "bg-violet-500/12 text-violet-300 border-violet-500/20",
};

export function ExpenseTypeBadge({ type }: Readonly<{ type: ExpenseType }>) {
  const { t } = useI18n();

  return (
    <Badge className={`border ${variantMap[type]}`}>
      {getExpenseTypeLabel(type, t)}
    </Badge>
  );
}
