import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Clock3, LoaderCircle } from "lucide-react";
import { useMemo } from "react";
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

  const form = useForm<AmpereScheduleFormInput, undefined, AmpereScheduleFormOutput>({
    resolver: standardSchemaResolver(ampereScheduleSchema),
    values: initialValues,
  });

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      form.reset(initialValues);
    }
  }

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

              <div className="grid gap-5 md:grid-cols-2">
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

                <FormField
                  control={form.control}
                  name="pricePerAmp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("ampereSchedules.form.pricePerAmp")}</FormLabel>
                      <FormControl>
                        <Input
                          inputMode="decimal"
                          min={0}
                          step="0.01"
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
                      <FormDescription>{t("ampereSchedules.form.pricePerAmpHelp")}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <SheetFooter className="border-t border-white/8 px-0 pt-5">
                <div className="flex w-full items-center justify-between gap-3">
                  <div className="text-sm text-muted-foreground">
                    {t("ampereSchedules.form.helper")}
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleOpenChange(false)}
                    >
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
