import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { LoaderCircle, Package2 } from "lucide-react";
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
import { useI18n } from "../../../providers/I18nProvider";
import type { AreaRecord } from "../../areas/types";
import {
  boxSchema,
  defaultBoxFormValues,
  type BoxFormInput,
  type BoxFormOutput,
} from "../schema";

interface BoxFormSheetProps {
  areas: AreaRecord[];
  description: string;
  error: string;
  open: boolean;
  pending: boolean;
  submitLabel: string;
  title: string;
  values?: BoxFormInput;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: BoxFormOutput) => Promise<void>;
}

export function BoxFormSheet({
  areas,
  description,
  error,
  open,
  pending,
  submitLabel,
  title,
  values,
  onOpenChange,
  onSubmit,
}: Readonly<BoxFormSheetProps>) {
  const { isRtl, t } = useI18n();
  const initialValues = useMemo(() => values ?? defaultBoxFormValues, [values]);

  const form = useForm<BoxFormInput, undefined, BoxFormOutput>({
    resolver: standardSchemaResolver(boxSchema),
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
            <Package2 className="h-5 w-5 text-primary" />
            {title}
          </SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        <div className="px-6 py-5">
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-5 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("boxes.form.name")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("boxes.form.namePlaceholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="areaId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("boxes.form.area")}</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={t("boxes.form.areaPlaceholder")} />
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="locationNote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("boxes.form.locationNote")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("boxes.form.locationNotePlaceholder")} {...field} />
                    </FormControl>
                    <FormDescription>{t("boxes.form.locationNoteHelp")}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("boxes.form.notes")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("boxes.form.notesPlaceholder")}
                        className="min-h-28"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>{t("boxes.form.notesHelp")}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SheetFooter className="border-t border-white/8 px-0 pt-5">
                <div className="flex w-full items-center justify-between gap-3">
                  <div className="text-sm text-muted-foreground">
                    {t("boxes.form.helper")}
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleOpenChange(false)}
                    >
                      {t("boxes.actions.cancel")}
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

