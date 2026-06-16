import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { LoaderCircle, UserPlus } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../../components/ui/button";
import {
  Form,
} from "../../../components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet";
import {
  useSubscriberCustomerRelationsQuery,
  useSubscriberCustomerTypesQuery,
  useSubscriberPlanTypesQuery,
} from "../queries";
import { useAreasQuery } from "../../areas/queries";
import {
  createSubscriberSchema,
  defaultSubscriberFormValues,
  type CreateSubscriberFormInput,
  type CreateSubscriberFormValues,
} from "../schema";
import {
  SubscriberDetailsSection,
  SubscriberPricingOverrideSection,
} from "./SubscriberFormSections";

interface SubscriberFormSheetProps {
  description: string;
  error: string;
  open: boolean;
  pending: boolean;
  submitLabel: string;
  title: string;
  values?: CreateSubscriberFormInput;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CreateSubscriberFormValues) => Promise<void>;
}

export function SubscriberFormSheet({
  description,
  error,
  open,
  pending,
  submitLabel,
  title,
  values,
  onOpenChange,
  onSubmit,
}: Readonly<SubscriberFormSheetProps>) {
  const initialValues = useMemo(
    () => values ?? defaultSubscriberFormValues,
    [values],
  );
  const form = useForm<
    CreateSubscriberFormInput,
    undefined,
    CreateSubscriberFormValues
  >({
    resolver: standardSchemaResolver(createSubscriberSchema),
    values: initialValues,
  });
  const areasQuery = useAreasQuery();
  const customerTypesQuery = useSubscriberCustomerTypesQuery();
  const planTypesQuery = useSubscriberPlanTypesQuery();
  const customerRelationsQuery = useSubscriberCustomerRelationsQuery();

  const isOptionsLoading =
    areasQuery.isLoading ||
    customerTypesQuery.isLoading ||
    planTypesQuery.isLoading ||
    customerRelationsQuery.isLoading;

  const optionsError =
    areasQuery.error ||
    customerTypesQuery.error ||
    planTypesQuery.error ||
    customerRelationsQuery.error;

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      form.reset(initialValues);
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto border-white/8 bg-background p-0 sm:max-w-2xl"
      >
        <SheetHeader className="border-b border-white/8 px-6 py-5">
          <SheetTitle className="flex items-center gap-2 text-xl text-foreground">
            <UserPlus className="h-5 w-5 text-primary" />
            {title}
          </SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        {optionsError ? (
          <div className="px-6 py-5 text-sm text-red-300">
            {optionsError instanceof Error
              ? optionsError.message
              : "Unable to load form options."}
          </div>
        ) : null}

        <div className="px-6 py-5">
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <SubscriberDetailsSection
                areas={areasQuery.data ?? []}
                customerRelations={customerRelationsQuery.data ?? []}
                customerTypes={customerTypesQuery.data ?? []}
                form={form}
                planTypes={planTypesQuery.data ?? []}
              />

              <SubscriberPricingOverrideSection form={form} />

              <SheetFooter className="border-t border-white/8 px-0 pt-5">
                <div className="flex w-full items-center justify-between gap-3">
                  <div className="text-sm text-muted-foreground">
                    {isOptionsLoading
                      ? "Loading form options..."
                      : "Required fields are validated before submit."}
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleOpenChange(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={pending || isOptionsLoading}
                    >
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
