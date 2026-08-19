import { Check, ChevronsUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { cn } from "../../components/ui/utils";

const INITIAL_OPTION_COUNT = 10;

export interface SearchableSelectOption {
  description?: string;
  label: string;
  value: string;
}

interface SearchableSelectProps {
  disabled?: boolean;
  emptyLabel: string;
  options: SearchableSelectOption[];
  placeholder: string;
  searchPlaceholder: string;
  value: string;
  onValueChange: (value: string) => void;
}

export function SearchableSelect({
  disabled = false,
  emptyLabel,
  options,
  placeholder,
  searchPlaceholder,
  value,
  onValueChange,
}: Readonly<SearchableSelectProps>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const selectedOption = options.find((option) => option.value === value);
  const initialOptions = useMemo(() => shuffleOptions(options).slice(0, INITIAL_OPTION_COUNT), [options]);
  const normalizedSearch = search.trim().toLocaleLowerCase();
  const visibleOptions = normalizedSearch
    ? options.filter((option) => `${option.label} ${option.description ?? ""}`.toLocaleLowerCase().includes(normalizedSearch))
    : initialOptions;

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) setSearch("");
  }

  function selectOption(nextValue: string) {
    onValueChange(nextValue);
    handleOpenChange(false);
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          disabled={disabled}
          className={cn("h-11 w-full justify-between rounded-xl border-white/8 bg-card px-3", !selectedOption && "text-muted-foreground")}
          role="combobox"
          type="button"
          variant="outline"
        >
          <span className="truncate">{selectedOption?.label ?? placeholder}</span>
          <ChevronsUpDown className="ms-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-(--radix-popover-trigger-width) p-0">
        <Command shouldFilter={false}>
          <CommandInput autoFocus placeholder={searchPlaceholder} value={search} onValueChange={setSearch} />
          <CommandList>
            <CommandItem value="__empty__" onSelect={() => selectOption("")}>
              <Check className={cn("h-4 w-4", !value ? "opacity-100" : "opacity-0")} />
              {emptyLabel}
            </CommandItem>
            {visibleOptions.length ? visibleOptions.map((option) => (
              <CommandItem key={option.value} value={option.value} onSelect={() => selectOption(option.value)}>
                <Check className={cn("h-4 w-4", value === option.value ? "opacity-100" : "opacity-0")} />
                <span className="flex min-w-0 flex-col items-start gap-0.5">
                  <span className="w-full truncate font-medium">{option.label}</span>
                  {option.description ? <span className="w-full truncate text-xs text-muted-foreground">{option.description}</span> : null}
                </span>
              </CommandItem>
            )) : <p className="px-3 py-4 text-sm text-muted-foreground">{emptyLabel}</p>}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function shuffleOptions(options: SearchableSelectOption[]) {
  return [...options].sort(() => Math.random() - 0.5);
}
