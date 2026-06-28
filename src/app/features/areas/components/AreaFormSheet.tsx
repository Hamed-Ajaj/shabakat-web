import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { MapPinned, LoaderCircle } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../../components/ui/button";
import { useI18n } from "../../../providers/I18nProvider";
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet";
import {
  areaSchema,
  defaultAreaFormValues,
  type AreaFormInput,
  type AreaFormOutput,
} from "../schema";

interface AreaFormSheetProps {
  description: string;
  error: string;
  open: boolean;
  pending: boolean;
  submitLabel: string;
  title: string;
  values?: AreaFormInput;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: AreaFormOutput) => Promise<void>;
}

export function AreaFormSheet({
  description,
  error,
  open,
  pending,
  submitLabel,
  title,
  values,
  onOpenChange,
  onSubmit,
}: Readonly<AreaFormSheetProps>) {
  const { isRtl, t } = useI18n();
  const initialValues = useMemo(
    () => values ?? defaultAreaFormValues,
    [values],
  );

  const form = useForm<AreaFormInput, undefined, AreaFormOutput>({
    resolver: standardSchemaResolver(areaSchema),
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
        className="w-full overflow-y-auto border-white/8 bg-background p-0 sm:max-w-lg"
      >
        <SheetHeader className="border-b border-white/8 px-6 py-5">
          <SheetTitle className="flex items-center gap-2 text-xl text-foreground">
            <MapPinned className="h-5 w-5 text-primary" />
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
                    <FormLabel>{t("areas.form.field.name")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("areas.form.placeholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SheetFooter className="border-t border-white/8 px-0 pt-5">
                <div className="flex w-full items-center justify-between gap-3">
                  <div className="text-sm text-muted-foreground">
                    {t("areas.form.helper")}
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleOpenChange(false)}
                    >
                      {t("areas.actions.cancel")}
                    </Button>
                    <Button type="submit" disabled={pending}>
                      {pending ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : null}
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
