import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import type { AreaOption } from "../subscribersApi";
import type { SubscriberSearchField } from "../types";

export interface SubscribersToolbarProps {
  areaId: string;
  areas: AreaOption[];
  isFetching: boolean;
  searchField: SubscriberSearchField;
  searchTerm: string;
  total: number;
  onAreaChange: (value: string) => void;
  onCreateClick: () => void;
  onSearchFieldChange: (value: SubscriberSearchField) => void;
  onSearchTermChange: (value: string) => void;
}

export function SubscribersToolbar({
  areaId,
  areas,
  isFetching,
  searchField,
  searchTerm,
  total,
  onAreaChange,
  onCreateClick,
  onSearchFieldChange,
  onSearchTermChange,
}: Readonly<SubscribersToolbarProps>) {
  const areaValue = areaId || "all";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 xl:flex-nowrap">
        <div className="flex min-w-72 flex-1 gap-2">
          <div className="w-36 shrink-0">
            <Select
              value={searchField}
              onValueChange={(value) =>
                onSearchFieldChange(value as SubscriberSearchField)
              }
            >
              <SelectTrigger className="rounded-xl border-white/8 bg-card">
                <SelectValue placeholder="Search by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <input
            type="text"
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
            placeholder={
              searchField === "name"
                ? "Search subscribers by name..."
                : "Search subscribers by phone..."
            }
            className="w-full rounded-xl border border-white/8 bg-card px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary"
          />
        </div>

        <div className="min-w-full xl:min-w-56">
          <Select
            value={areaValue}
            onValueChange={(value) => onAreaChange(value === "all" ? "" : value)}
          >
            <SelectTrigger className="rounded-xl border-white/8 bg-card">
              <SelectValue placeholder="Area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All areas</SelectItem>
              {areas.map((area) => (
                <SelectItem key={area.id} value={area.id}>
                  {area.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={onCreateClick}
          className="rounded-xl px-4 py-2.5 text-sm font-medium"
          style={{ boxShadow: "0 0 16px rgba(245,192,0,0.25)" }}
        >
          Add Subscriber
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        {total} subscriber{total === 1 ? "" : "s"}
        {isFetching ? " · Refreshing..." : ""}
      </p>
    </div>
  );
}
