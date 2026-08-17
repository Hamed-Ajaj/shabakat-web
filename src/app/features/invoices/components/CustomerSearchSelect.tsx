import { useMemo, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useDebouncedValue } from "../../../../hooks/use-debounced-value";
import { useI18n } from "../../../providers/I18nProvider";
import { Button } from "../../../components/ui/button";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import { Skeleton } from "../../../components/ui/skeleton";
import { cn } from "../../../components/ui/utils";
import { useSubscribersQuery } from "../../subscribers/queries";
import type { SubscriberRow } from "../../subscribers/types";

interface CustomerSearchSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  onSelectedChange?: (customer: SubscriberRow | null) => void;
  allowEmpty?: boolean;
  emptyLabel?: string;
  placeholder?: string;
}

export function CustomerSearchSelect({
  value,
  onValueChange,
  onSelectedChange,
  allowEmpty = false,
  emptyLabel,
  placeholder,
}: Readonly<CustomerSearchSelectProps>) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<SubscriberRow | null>(null);
  const debouncedSearch = useDebouncedValue(search, 250);
  const filters = useMemo(
    () => ({
      areaId: "",
      customerRelation: "",
      customerStatus: "",
      pageIndex: 0,
      pageSize: 20,
      planType: "",
      searchField: "name" as const,
      searchTerm: debouncedSearch,
    }),
    [debouncedSearch],
  );
  const customersQuery = useSubscribersQuery(filters);
  const customers = customersQuery.data?.data ?? [];

  const resolved =
    selected?.id === value
      ? selected
      : (customers.find((item) => item.id === value) ?? null);
  const fallbackLabel = allowEmpty
    ? (emptyLabel ?? t("invoices.filters.allCustomers"))
    : (placeholder ?? t("invoices.create.customerPlaceholder"));
  const displayLabel = resolved?.name ?? fallbackLabel;
  const isLoading = customersQuery.isLoading;

  function selectCustomer(customer: SubscriberRow) {
    setSelected(customer);
    onValueChange(customer.id);
    onSelectedChange?.(customer);
    setOpen(false);
  }

  function selectEmpty() {
    setSelected(null);
    onValueChange("");
    onSelectedChange?.(null);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between rounded-xl border-white/8 bg-card px-3",
            !resolved && "text-muted-foreground",
          )}
        >
          <span className="truncate">{displayLabel}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            value={search}
            onValueChange={setSearch}
            placeholder={t("invoices.customerSearch.search")}
          />
          <CommandList>
            {allowEmpty ? (
              <CommandItem value="__all__" onSelect={selectEmpty}>
                <Check
                  className={cn(
                    "h-4 w-4",
                    value === "" ? "opacity-100" : "opacity-0",
                  )}
                />
                {emptyLabel ?? t("invoices.filters.allCustomers")}
              </CommandItem>
            ) : null}

            {isLoading ? (
              <div className="space-y-2 px-3 py-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-8 w-full rounded-lg" />
                ))}
              </div>
            ) : customers.length === 0 ? (
              <p className="px-3 py-4 text-sm text-muted-foreground">
                {t("invoices.customerSearch.empty")}
              </p>
            ) : (
              customers.map((customer) => (
                <CommandItem
                  key={customer.id}
                  value={customer.id}
                  onSelect={() => selectCustomer(customer)}
                >
                  <Check
                    className={cn(
                      "h-4 w-4",
                      value === customer.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span className="flex min-w-0 flex-col items-start gap-0.5">
                    <span className="w-full truncate font-medium">
                      {customer.name}
                    </span>
                    {customer.phone ? (
                      <span className="w-full truncate text-xs text-muted-foreground">
                        {customer.phone}
                      </span>
                    ) : null}
                  </span>
                </CommandItem>
              ))
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
