import { useWatch, type UseFormReturn } from "react-hook-form";
import { Checkbox } from "../../../components/ui/checkbox";
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
import type { LookupOption } from "../subscribersApi";
import type {
  CreateSubscriberFormInput,
  CreateSubscriberFormValues,
} from "../schema";

interface SubscriberDetailsSectionProps {
  areas: AreaRecord[];
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
  customerRelations,
  customerTypes,
  form,
  planTypes,
}: Readonly<SubscriberDetailsSectionProps>) {
  const selectedPlan = useWatch({
    control: form.control,
    name: "plan",
  });

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="محمد علي" {...field} />
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
            <FormLabel>Phone</FormLabel>
            <FormControl>
              <Input placeholder="03100004" type="tel" {...field} />
            </FormControl>
            <FormDescription>Optional.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="subscriptionDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Subscription Date</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormDescription>
              Optional. Defaults to today if omitted.
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
            <FormLabel>Customer Type</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {customerTypes.map((option) => (
                  <SelectItem key={option.label} value={option.label}>
                    {option.label}
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
            <FormLabel>Plan Type</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {planTypes.map((option) => (
                  <SelectItem key={option.label} value={option.label}>
                    {option.label}
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
            ? "Contracted amperes for prepaid billing."
            : selectedPlan === "FixedKilowatt"
              ? "Prepaid counter plan handled through invoice top-ups."
              : "Monthly meter-based kilowatt plan."
        }
        label="Plan Value"
        name="planValue"
        placeholder={selectedPlan === "Ampere" ? "5" : "25"}
      />

      <FormField
        control={form.control}
        name="areaId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Area</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Optional area" />
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
              Optional area assignment for grouping and filtering.
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
            <FormLabel>Relation</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Optional relation" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {customerRelations.map((option) => (
                  <SelectItem key={option.label} value={option.label}>
                    {option.label}
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
        name="address"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Address</FormLabel>
            <FormControl>
              <Textarea placeholder="طرابلس - المينا" {...field} />
            </FormControl>
            <FormDescription>Optional.</FormDescription>
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
                <FormLabel>Use pricing override</FormLabel>
                <FormDescription>
                  Override company pricing for this subscriber with a custom
                  price, fixed charge, and TVA.
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
            label="Override Price"
            name="overridePrice"
            placeholder="50000"
          />
          <NumericField
            form={form}
            label="Fixed Charge"
            name="overrideFixedCharge"
            placeholder="10000"
          />
          <NumericField
            form={form}
            label="TVA (%)"
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
