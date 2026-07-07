import { useWatch, type UseFormReturn } from "react-hook-form";
import { Checkbox } from "../../../components/ui/checkbox";
import { useI18n } from "../../../providers/I18nProvider";
import {
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
import { Textarea } from "../../../components/ui/textarea";
import type { AreaRecord } from "../../areas/types";
import { getSubscriberCustomerTypeLabel, getSubscriberPlanLabel, getSubscriberRelationLabel } from "../subscriberLabels";
import type { LookupOption } from "../subscribersApi";
import type {
  CreateSubscriberFormInput,
  CreateSubscriberFormValues,
} from "../schema";

interface SubscriberDetailsSectionProps {
  areas: AreaRecord[];
  boxes: LookupOption[];
  customerRelations: LookupOption[];
  customerTypes: LookupOption[];
  form: UseFormReturn<
    CreateSubscriberFormInput,
    undefined,
    CreateSubscriberFormValues
  >;
  planTypes: LookupOption[];
}

export function SubscriberDetailsSection({
  areas,
  boxes,
  customerRelations,
  customerTypes,
  form,
  planTypes,
}: Readonly<SubscriberDetailsSectionProps>) {
  const { t } = useI18n();
  const selectedPlan = useWatch({
    control: form.control,
    name: "plan",
  });
  const hasBoxes = boxes.length > 0;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>{t("subscribers.form.name")}</FormLabel>
            <FormControl>
              <Input placeholder={t("subscribers.form.namePlaceholder")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("subscribers.form.phone")}</FormLabel>
            <FormControl>
              <Input placeholder={t("subscribers.form.phonePlaceholder")} type="tel" {...field} />
            </FormControl>
            <FormDescription>{t("subscribers.form.optional")}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="subscriptionDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("subscribers.form.subscriptionDate")}</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormDescription>
              {t("subscribers.form.subscriptionDateHelp")}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="customerType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("subscribers.customerType.label")}</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t("subscribers.form.customerTypePlaceholder")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {customerTypes.map((option) => (
                  <SelectItem key={option.label} value={option.label}>
                    {t(getSubscriberCustomerTypeLabel(option.label as "Residential" | "Commercial" | "Industrial"))}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="plan"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("subscribers.form.plan")}</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t("subscribers.form.planPlaceholder")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {planTypes.map((option) => (
                  <SelectItem key={option.label} value={option.label}>
                    {t(getSubscriberPlanLabel(option.label as "Ampere" | "Kilowatt" | "FixedKilowatt"))}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <NumericField
        form={form}
        helperText={
          selectedPlan === "Ampere"
            ? "Used as the contracted ampere value for ampere billing."
            : selectedPlan === "FixedKilowatt"
              ? "Used by prepaid counter billing and fixed-kilowatt top-up calculations."
              : "Used by monthly meter billing calculations."
        }
        label={t("subscribers.form.planValue")}
        name="planValue"
        placeholder="5"
      />

      <FormField
        control={form.control}
        name="areaId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("subscribers.form.area")}</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                form.setValue("boxId", "");
              }}
              value={field.value || ""}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t("subscribers.form.areaPlaceholder")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {areas.map((area) => (
                  <SelectItem key={area.id} value={area.id}>
                    {area.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription className="min-h-10">
              {t("subscribers.form.areaHelp")}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="boxId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("subscribers.form.box")}</FormLabel>
            <Select
              disabled={!hasBoxes}
              onValueChange={(value) => field.onChange(value === "none" ? "" : value)}
              value={field.value || "none"}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t("subscribers.form.boxPlaceholder")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">{t("subscribers.form.boxNone")}</SelectItem>
                {boxes.map((box) => (
                  <SelectItem key={String(box.value)} value={String(box.value)}>
                    {box.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription className="min-h-10">
              {hasBoxes ? t("subscribers.form.boxHelp") : t("subscribers.form.boxEmpty")}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="customerRelation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("subscribers.form.relation")}</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t("subscribers.form.relationPlaceholder")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {customerRelations.map((option) => (
                  <SelectItem key={option.label} value={option.label}>
                    {t(getSubscriberRelationLabel(option.label as "Friend" | "Family" | "Owner" | "Other"))}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cableName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("subscribers.form.cableName")}</FormLabel>
            <FormControl>
              <Input placeholder={t("subscribers.form.cableNamePlaceholder")} {...field} />
            </FormControl>
            <FormDescription>{t("subscribers.form.optional")}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>{t("subscribers.form.address")}</FormLabel>
            <FormControl>
              <Textarea placeholder={t("subscribers.form.addressPlaceholder")} {...field} />
            </FormControl>
            <FormDescription>{t("subscribers.form.optional")}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

interface SubscriberPricingOverrideSectionProps {
  form: UseFormReturn<
    CreateSubscriberFormInput,
    undefined,
    CreateSubscriberFormValues
  >;
}

export function SubscriberPricingOverrideSection({
  form,
}: Readonly<SubscriberPricingOverrideSectionProps>) {
  const { t } = useI18n();
  const usePricingOverride = useWatch({
    control: form.control,
    name: "usePricingOverride",
  });

  return (
    <div className="rounded-2xl border border-white/8 bg-card/70 p-4">
      <FormField
        control={form.control}
        name="usePricingOverride"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <div className="flex items-start gap-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                />
              </FormControl>
              <div className="space-y-1">
                <FormLabel>{t("subscribers.form.pricingOverride")}</FormLabel>
                <FormDescription>
                  {t("subscribers.form.pricingOverrideHelp")}
                </FormDescription>
              </div>
            </div>
          </FormItem>
        )}
      />

      {usePricingOverride ? (
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <NumericField
            form={form}
            label={t("subscribers.form.usePricingOverride.overridePrice")}
            name="overridePrice"
            placeholder="50000"
          />
          <NumericField
            form={form}
            label={t("subscribers.form.usePricingOverride.fixedCharge")}
            name="overrideFixedCharge"
            placeholder="10000"
          />
          <NumericField
            form={form}
            label={t("subscribers.form.usePricingOverride.tva")}
            name="overrideTva"
            placeholder="11"
          />
        </div>
      ) : null}
    </div>
  );
}

interface NumericFieldProps {
  form: UseFormReturn<
    CreateSubscriberFormInput,
    undefined,
    CreateSubscriberFormValues
  >;
  helperText?: string;
  label: string;
  name:
    | "overrideFixedCharge"
    | "overridePrice"
    | "overrideTva"
    | "planValue";
  placeholder: string;
}

function NumericField({
  form,
  helperText,
  label,
  name,
  placeholder,
}: Readonly<NumericFieldProps>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              inputMode="decimal"
              name={field.name}
              onBlur={field.onBlur}
              placeholder={placeholder}
              ref={field.ref}
              step="0.01"
              type="number"
              value={
                (typeof field.value === "number" &&
                  Number.isFinite(field.value)) ||
                typeof field.value === "string"
                  ? field.value
                  : ""
              }
              onChange={(event) => field.onChange(event.target.value)}
            />
          </FormControl>
          {helperText ? (
            <FormDescription className="min-h-10">
              {helperText}
            </FormDescription>
          ) : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
