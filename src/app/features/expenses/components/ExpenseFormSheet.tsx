import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { HandCoins, LoaderCircle } from "lucide-react";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "../../../components/ui/button";
import {
  Form,
  FormControl,
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
import { Textarea } from "../../../components/ui/textarea";
import {
  defaultExpenseFormValues,
  expenseFormSchema,
  type ExpenseFormInput,
  type ExpenseFormOutput,
} from "../schema";
import { expenseTypeOptions, getExpenseTypeDescription } from "../utils";

interface ExpenseFormSheetProps {
  description: string;
  error: string;
  open: boolean;
  pending: boolean;
  submitLabel: string;
  title: string;
  values?: ExpenseFormInput;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ExpenseFormOutput) => Promise<void>;
}

export function ExpenseFormSheet({
  description,
  error,
  open,
  pending,
  submitLabel,
  title,
  values,
  onOpenChange,
  onSubmit,
}: Readonly<ExpenseFormSheetProps>) {
  const initialValues = useMemo(() => values ?? defaultExpenseFormValues, [values]);

  const form = useForm<ExpenseFormInput, undefined, ExpenseFormOutput>({
    resolver: standardSchemaResolver(expenseFormSchema),
    values: initialValues,
  });

  const expenseType = useWatch({
    control: form.control,
    name: "expenseType",
  });

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      form.reset(initialValues);
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto border-white/8 bg-background p-0 sm:max-w-xl">
        <SheetHeader className="border-b border-white/8 px-6 py-5">
          <SheetTitle className="flex items-center gap-2 text-xl text-foreground">
            <HandCoins className="h-5 w-5 text-primary" />
            {title}
          </SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        <div className="px-6 py-5">
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="expenseType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expense Type</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {expenseTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
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
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="250"
                          {...field}
                          value={typeof field.value === "number" || typeof field.value === "string" ? field.value : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="expenseDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expense Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{expenseType === "Other" ? "Label" : "Label (Optional)"}</FormLabel>
                      <FormControl>
                        <Input placeholder={expenseType === "Other" ? "Rent, Insurance..." : "Optional category"} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea rows={6} placeholder="Optional internal note..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <p className="text-sm text-muted-foreground">{getExpenseTypeDescription(expenseType)}</p>

              <SheetFooter className="border-t border-white/8 px-0 pt-5">
                <div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="text-sm text-muted-foreground">
                    Expenses update dashboard totals after successful save.
                  </div>

                  <div className="flex items-center gap-3">
                    <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                      Cancel
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
