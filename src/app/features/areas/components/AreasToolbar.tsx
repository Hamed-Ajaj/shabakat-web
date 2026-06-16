import { Button } from "../../../components/ui/button";

interface AreasToolbarProps {
  canManage: boolean;
  isFetching: boolean;
  search: string;
  total: number;
  onCreateClick: () => void;
  onSearchChange: (value: string) => void;
}

export function AreasToolbar({
  canManage,
  isFetching,
  search,
  total,
  onCreateClick,
  onSearchChange,
}: Readonly<AreasToolbarProps>) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-72 flex-1">
          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search areas by name..."
            className="w-full max-w-[600px] rounded-xl border border-white/8 bg-card px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary"
          />
        </div>

        {canManage ? (
          <Button
            onClick={onCreateClick}
            className="rounded-xl px-4 py-2.5 text-sm font-medium"
            style={{ boxShadow: "0 0 16px rgba(245,192,0,0.25)" }}
          >
            Add Area
          </Button>
        ) : null}
      </div>

      <p className="text-xs text-muted-foreground">
        {total} area{total === 1 ? "" : "s"}
        {isFetching ? " · Refreshing..." : ""}
      </p>
    </div>
  );
}
