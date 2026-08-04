import { type FormEvent, useState } from "react";
import { CheckCircle2, Gauge, LoaderCircle, Zap } from "lucide-react";
import { useI18n } from "../../../providers/I18nProvider";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { SectionCard } from "../../../shared/components/SectionCard";
import { calculateFixedKilowatt } from "../invoicesApi";
import type { FixedKilowattCalculation, InvoiceCustomerType } from "../types";
import { useAuth } from "../../../providers/AuthProvider";

type CalculationMode = "payment" | "kilowatt";

export default function FixedKilowattCalculatorPage() {
  const { formatNumber, t } = useI18n();
  const { session } = useAuth();
  const [customerType, setCustomerType] = useState<InvoiceCustomerType>("Residential");
  const [planValue, setPlanValue] = useState("");
  const [mode, setMode] = useState<CalculationMode>("kilowatt");
  const [amount, setAmount] = useState("100");
  const [result, setResult] = useState<FixedKilowattCalculation | null>(null);
  const [error, setError] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);

  async function handleCalculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const numericAmount = Number(amount);

    if (!session?.token || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError(t("calculator.amountError"));
      return;
    }

    const numericPlanValue = Number(planValue);
    setError("");
    setIsCalculating(true);

    try {
      setResult(await calculateFixedKilowatt({
        customerType,
        planValue: planValue.trim() && Number.isFinite(numericPlanValue) ? numericPlanValue : null,
        ...(mode === "payment" ? { paymentAmount: numericAmount } : { kilowattAmount: numericAmount }),
      }, session.token));
    } catch (calculationError) {
      setResult(null);
      setError(calculationError instanceof Error ? calculationError.message : t("calculator.failed"));
    } finally {
      setIsCalculating(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5 pb-6">
      <SectionCard className="p-5 sm:p-8">
        <form className="space-y-7" onSubmit={handleCalculate}>
          <div>
            <label className="mb-2 block text-base font-semibold text-foreground" htmlFor="calculator-customer-type">
              {t("calculator.customerType")}
            </label>
            <Select value={customerType} onValueChange={(value) => setCustomerType(value as InvoiceCustomerType)}>
              <SelectTrigger id="calculator-customer-type" className="h-14 rounded-2xl bg-card text-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Residential">{t("calculator.residential")}</SelectItem>
                <SelectItem value="Commercial">{t("calculator.commercial")}</SelectItem>
                <SelectItem value="Industrial">{t("calculator.industrial")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-2 block text-base font-semibold text-foreground" htmlFor="calculator-plan-value">
              {t("calculator.planValue")}
            </label>
            <div className="relative">
              <Gauge className="pointer-events-none absolute start-4 top-1/2 h-6 w-6 -translate-y-1/2 text-foreground" />
              <Input
                id="calculator-plan-value"
                className="h-14 rounded-2xl bg-secondary ps-14 text-lg"
                inputMode="decimal"
                min="0"
                onChange={(event) => setPlanValue(event.target.value)}
                placeholder={t("calculator.optional")}
                step="any"
                type="number"
                value={planValue}
              />
            </div>
          </div>

          <fieldset>
            <legend className="mb-3 text-base font-semibold text-foreground">{t("calculator.calculateFrom")}</legend>
            <div className="grid grid-cols-2 gap-2 rounded-2xl bg-secondary p-1">
              <ModeButton active={mode === "payment"} onClick={() => setMode("payment")}>
                {t("calculator.payment")}
              </ModeButton>
              <ModeButton active={mode === "kilowatt"} onClick={() => setMode("kilowatt")}>
                {t("calculator.kilowatt")}
              </ModeButton>
            </div>
          </fieldset>

          <div>
            <label className="mb-2 block text-base font-semibold text-foreground" htmlFor="calculator-amount">
              {mode === "payment" ? t("calculator.paymentAmount") : t("calculator.kilowattAmount")}
            </label>
            <div className="relative">
              <Zap className="pointer-events-none absolute start-4 top-1/2 h-6 w-6 -translate-y-1/2 text-foreground" />
              <Input
                id="calculator-amount"
                className="h-14 rounded-2xl bg-secondary ps-14 text-lg"
                inputMode="decimal"
                min="0.0001"
                onChange={(event) => setAmount(event.target.value)}
                step="any"
                type="number"
                value={amount}
              />
            </div>
          </div>

          {error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}

          <Button className="h-14 w-full rounded-2xl text-lg" disabled={isCalculating} type="submit">
            {isCalculating ? <LoaderCircle className="animate-spin" /> : null}
            {t("calculator.calculate")}
          </Button>
        </form>
      </SectionCard>

      {result ? (
        <SectionCard className="p-5 sm:p-8">
          <div className="mb-6 flex items-center gap-2 text-primary">
            <CheckCircle2 className="h-6 w-6" />
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">{t("calculator.result")}</h2>
          </div>
          <dl className="divide-y divide-border">
            <ResultRow label={t("calculator.paymentAmount")} value={formatNumber(result.paymentAmount)} />
            <ResultRow label={t("calculator.kilowattAmount")} value={`${formatNumber(result.kilowattAmount)} kWh`} />
            <ResultRow label={t("calculator.unitPrice")} value={formatNumber(result.unitPrice)} />
            <ResultRow label={t("calculator.fixedCharge")} value={formatNumber(result.fixedCharge)} />
            <ResultRow label={t("calculator.tva")} value={`${formatNumber(result.tva)}%`} />
            <ResultRow label={t("calculator.planValue")} value={formatNumber(result.planValue ?? 0)} />
            <ResultRow label={t("calculator.customerType")} value={t(`calculator.${result.customerType.toLowerCase()}` as "calculator.residential")} />
          </dl>
        </SectionCard>
      ) : null}
    </div>
  );
}

function ModeButton({ active, children, onClick }: Readonly<{ active: boolean; children: React.ReactNode; onClick: () => void }>) {
  return <button className={`h-11 rounded-xl text-sm font-semibold transition-colors ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`} onClick={onClick} type="button">{children}</button>;
}

function ResultRow({ label, value }: Readonly<{ label: string; value: string }>) {
  return <div className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"><dt className="text-muted-foreground">{label}</dt><dd className="text-right font-semibold tabular-nums text-foreground">{value}</dd></div>;
}
