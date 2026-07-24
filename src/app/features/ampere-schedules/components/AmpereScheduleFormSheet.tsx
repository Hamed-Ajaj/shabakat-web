import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Clock3, LoaderCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../../components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet";
import { useI18n } from "../../../providers/I18nProvider";
import {
  ampereScheduleSchema,
  defaultAmpereScheduleFormValues,
  type AmpereScheduleFormInput,
  type AmpereScheduleFormOutput,
} from "../schema";

const PRICING_TIERS = [
  { value: "base" as const, labelKey: "ampereSchedules.form.pricingTierBase" },
  { value: "residential" as const, labelKey: "ampereSchedules.form.pricingTierResidential" },
  { value: "commercial" as const, labelKey: "ampereSchedules.form.pricingTierCommercial" },
  { value: "industrial" as const, labelKey: "ampereSchedules.form.pricingTierIndustrial" },
];

type PricingTierKey = (typeof PRICING_TIERS)[number]["value"];

const TIER_FIELD_MAP: Record<PricingTierKey, keyof AmpereScheduleFormInput> = {
  base: "pricePerAmp",
  residential: "residentialPricePerAmp",
  commercial: "commercialPricePerAmp",
  industrial: "industrialPricePerAmp",
};

interface AmpereScheduleFormSheetProps {
  description: string;
  error: string;
  open: boolean;
  pending: boolean;
  submitLabel: string;
  title: string;
  values?: AmpereScheduleFormInput;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: AmpereScheduleFormOutput) => Promise<void>;
}

export function AmpereScheduleFormSheet({
  description,
  error,
  open,
  pending,
  submitLabel,
  title,
  values,
  onOpenChange,
  onSubmit,
}: Readonly<AmpereScheduleFormSheetProps>) {
  const { isRtl, t } = useI18n();
  const initialValues = useMemo(() => values ?? defaultAmpereScheduleFormValues, [values]);
  const [selectedTier, setSelectedTier] = useState<PricingTierKey>("base");

  const form = useForm<AmpereScheduleFormInput, undefined, AmpereScheduleFormOutput>({
    resolver: standardSchemaResolver(ampereScheduleSchema),
    values: initialValues,
  });

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      form.reset(initialValues);
      setSelectedTier("base");
    }
  }

  const selectedField = TIER_FIELD_MAP[selectedTier];

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side={isRtl ? "right" : "left"}
        className="w-full overflow-y-auto border-white/8 bg-background p-0 sm:max-w-xl"
      >
        <SheetHeader className="border-b border-white/8 px-6 py-5">
          <SheetTitle className="flex items-center gap-2 text-xl text-foreground">
            <Clock3 className="h-5 w-5 text-primary" />
            {title}
          </SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        <div className="px-6 py-5">
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("ampereSchedules.form.name")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("ampereSchedules.form.namePlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hoursPerDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("ampereSchedules.form.hoursPerDay")}</FormLabel>
                    <FormControl>
                      <Input
                        inputMode="numeric"
                        min={1}
                        max={24}
                        step="1"
                        type="number"
                        value={
                          (typeof field.value === "number" && Number.isFinite(field.value)) ||
                          typeof field.value === "string"
                            ? field.value
                            : ""
                        }
                        onChange={(event) => field.onChange(event.target.value)}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormDescription>{t("ampereSchedules.form.hoursPerDayHelp")}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4 rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                <p className="text-sm font-medium text-foreground">{t("ampereSchedules.form.pricingTitle")}</p>
                <p className="text-xs text-muted-foreground">{t("ampereSchedules.form.pricingDescription")}</p>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{t("ampereSchedules.form.pricingTierLabel")}</p>

                <div className="flex items-start gap-3">
                  <Select
                    value={selectedTier}
                    onValueChange={(value) => setSelectedTier(value as PricingTierKey)}
                  >
                    <SelectTrigger className="w-40 rounded-xl border-white/8 bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRICING_TIERS.map((tier) => (
                        <SelectItem key={tier.value} value={tier.value}>
                          {t(tier.labelKey as never)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormField
                    control={form.control}
                    name={selectedField}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            inputMode="decimal"
                            min={0}
                            step="0.01"
                            type="number"
                            placeholder="0.00"
                            value={
                              (typeof field.value === "number" && Number.isFinite(field.value)) ||
                              typeof field.value === "string"
                                ? field.value
                                : ""
                            }
                            onChange={(event) => field.onChange(event.target.value)}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {PRICING_TIERS.map((tier) => {
                    const fieldName = TIER_FIELD_MAP[tier.value];
                    const currentValue = form.watch(fieldName);
                    return (
                      <button
                        key={tier.value}
                        type="button"
                        onClick={() => setSelectedTier(tier.value)}
                        className={`rounded-xl border px-3 py-2 text-left text-xs transition ${
                          selectedTier === tier.value
                            ? "border-primary/40 bg-primary/5"
                            : "border-white/8 bg-white/[0.02] hover:border-white/15"
                        }`}
                      >
                        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{t(tier.labelKey as never)}</p>
                        <p className="mt-0.5 text-sm font-medium text-foreground">
                          {typeof currentValue === "number" ? currentValue.toFixed(2) : "0.00"}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <SheetFooter className="border-t border-white/8 px-0 pt-5">
                <div className="flex w-full items-center justify-between gap-3">
                  <div className="text-sm text-muted-foreground">
                    {t("ampereSchedules.form.helper")}
                  </div>
                  <div className="flex items-center gap-3">
                    <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                      {t("ampereSchedules.actions.cancel")}
                    </Button>
                    <Button type="submit" disabled={pending}>
                      {pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                      {submitLabel}
                    </Button>
                  </div>
                </div>
                {error ? <p className="text-sm text-red-300">{error}</p> : null}
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
