import { Download, Filter, LoaderCircle, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { useI18n } from "../../../providers/I18nProvider";
import type { AmpereScheduleRecord } from "../../ampere-schedules/types";
import type { AreaRecord } from "../../areas/types";
import { getSubscriberRelationLabel, getSubscriberPlanLabel } from "../subscriberLabels";
import type { LookupOption } from "../subscribersApi";
import type { SubscriberSearchField } from "../types";

const STATUS_OPTIONS = [
  { value: "Active", labelKey: "subscribers.status.active" },
  { value: "Suspended", labelKey: "subscribers.status.suspended" },
  { value: "Terminated", labelKey: "subscribers.status.terminated" },
] as const;

type AdvancedFilters = {
  ampereScheduleId: string;
  customerRelation: string;
  customerStatus: string;
  planType: string;
};

export interface SubscribersToolbarProps extends AdvancedFilters {
  areaId: string;
  ampereSchedules: AmpereScheduleRecord[];
  areas: AreaRecord[];
  canExport: boolean;
  customerRelations: LookupOption[];
  isExporting: boolean;
  isFetching: boolean;
  planTypes: LookupOption[];
  searchField: SubscriberSearchField;
  searchTerm: string;
  total: number;
  onAdvancedFiltersChange: (filters: AdvancedFilters) => void;
  onAreaChange: (value: string) => void;
  onCreateClick: () => void;
  onExportClick: () => void;
  onSearchFieldChange: (value: SubscriberSearchField) => void;
  onSearchTermChange: (value: string) => void;
}

export function SubscribersToolbar({
  ampereScheduleId,
  ampereSchedules,
  areaId,
  areas,
  canExport,
  customerRelation,
  customerRelations,
  customerStatus,
  isExporting,
  isFetching,
  planType,
  planTypes,
  searchField,
  searchTerm,
  total,
  onAdvancedFiltersChange,
  onAreaChange,
  onCreateClick,
  onExportClick,
  onSearchFieldChange,
  onSearchTermChange,
}: Readonly<SubscribersToolbarProps>) {
  const { t } = useI18n();
  const currentFilters = { ampereScheduleId, customerRelation, customerStatus, planType };
  const [draftFilters, setDraftFilters] = useState<AdvancedFilters>(currentFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const activeFilterCount = Object.values(currentFilters).filter(Boolean).length;
  const selectedSchedule = ampereSchedules.find((schedule) => schedule.id === ampereScheduleId);

  function openFilters(open: boolean) {
    if (open) setDraftFilters(currentFilters);
    setFiltersOpen(open);
  }

  function applyFilters() {
    onAdvancedFiltersChange(draftFilters);
    setFiltersOpen(false);
  }

  function clearFilters() {
    const emptyFilters = { ampereScheduleId: "", customerRelation: "", customerStatus: "", planType: "" };
    setDraftFilters(emptyFilters);
    onAdvancedFiltersChange(emptyFilters);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="flex min-w-0 flex-1 overflow-hidden rounded-xl border border-white/8 bg-card focus-within:border-primary">
          <div className="w-32 shrink-0 border-r border-white/8">
            <Select value={searchField} onValueChange={(value) => onSearchFieldChange(value as SubscriberSearchField)}>
              <SelectTrigger className="h-11 rounded-none border-0 bg-transparent shadow-none"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="name">{t("subscribers.searchField.name")}</SelectItem>
                <SelectItem value="phone">{t("subscribers.searchField.phone")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <input
            className="h-11 min-w-0 flex-1 bg-transparent px-4 text-sm text-foreground outline-none"
            placeholder={searchField === "name" ? t("subscribers.search.byName") : t("subscribers.search.byPhone")}
            type="search"
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
          />
        </div>

        <div className="min-w-52">
          <Select value={areaId || "all"} onValueChange={(value) => onAreaChange(value === "all" ? "" : value)}>
            <SelectTrigger className="h-11 rounded-xl border-white/8 bg-card"><SelectValue placeholder={t("subscribers.search.area")} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("subscribers.search.allAreas")}</SelectItem>
              {areas.map((area) => <SelectItem key={area.id} value={area.id}>{area.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <Popover open={filtersOpen} onOpenChange={openFilters}>
          <PopoverTrigger asChild>
            <Button className="h-11 shrink-0 rounded-xl" variant="outline">
              <Filter />
              {t("subscribers.filters.button")}
              {activeFilterCount ? <span className="rounded-full bg-primary px-1.5 text-xs text-primary-foreground">{activeFilterCount}</span> : null}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-[min(22rem,calc(100vw-2rem))] space-y-4 p-4">
            <div>
              <h2 className="font-semibold text-foreground">{t("subscribers.filters.title")}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t("subscribers.filters.description")}</p>
            </div>
            <AdvancedSelect label={t("subscribers.search.planType")} value={draftFilters.planType || "all"} onValueChange={(value) => setDraftFilters((current) => ({ ...current, planType: value === "all" ? "" : value }))}>
              <SelectItem value="all">{t("subscribers.search.allPlanTypes")}</SelectItem>
              {planTypes.map((option) => <SelectItem key={option.label} value={option.label}>{t(getSubscriberPlanLabel(option.label as "Ampere" | "Kilowatt" | "FixedKilowatt"))}</SelectItem>)}
            </AdvancedSelect>
            <AdvancedSelect label={t("subscribers.search.relation")} value={draftFilters.customerRelation || "all"} onValueChange={(value) => setDraftFilters((current) => ({ ...current, customerRelation: value === "all" ? "" : value }))}>
              <SelectItem value="all">{t("subscribers.search.allRelations")}</SelectItem>
              {customerRelations.map((option) => <SelectItem key={option.label} value={option.label}>{t(getSubscriberRelationLabel(option.label as "Friend" | "Family" | "Owner" | "Other"))}</SelectItem>)}
            </AdvancedSelect>
            <AdvancedSelect label={t("subscribers.search.status")} value={draftFilters.customerStatus || "all"} onValueChange={(value) => setDraftFilters((current) => ({ ...current, customerStatus: value === "all" ? "" : value }))}>
              <SelectItem value="all">{t("subscribers.search.allStatuses")}</SelectItem>
              {STATUS_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{t(option.labelKey)}</SelectItem>)}
            </AdvancedSelect>
            <AdvancedSelect label={t("subscribers.search.ampereSchedule")} value={draftFilters.ampereScheduleId || "all"} onValueChange={(value) => setDraftFilters((current) => ({ ...current, ampereScheduleId: value === "all" ? "" : value }))}>
              <SelectItem value="all">{t("subscribers.search.allAmpereSchedules")}</SelectItem>
              {ampereSchedules.map((schedule) => <SelectItem key={schedule.id} value={schedule.id}>{schedule.name}</SelectItem>)}
            </AdvancedSelect>
            <div className="flex items-center justify-between border-t border-white/8 pt-4">
              <Button variant="ghost" onClick={() => setDraftFilters({ ampereScheduleId: "", customerRelation: "", customerStatus: "", planType: "" })}>{t("subscribers.filters.reset")}</Button>
              <Button onClick={applyFilters}>{t("subscribers.filters.apply")}</Button>
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex gap-2 xl:ml-auto">
          {canExport ? <Button className="h-11 rounded-xl" disabled={isExporting} variant="outline" onClick={onExportClick}>{isExporting ? <LoaderCircle className="animate-spin" /> : <Download />}{t("subscribers.actions.export")}</Button> : null}
          <Button className="h-11 rounded-xl" onClick={onCreateClick}>{t("subscribers.actions.add")}</Button>
        </div>
      </div>

      {activeFilterCount ? <div className="flex flex-wrap items-center gap-2"><span className="text-sm text-muted-foreground">{t("subscribers.filters.active")}:</span>{planType ? <FilterChip label={`${t("subscribers.search.planType")}: ${t(getSubscriberPlanLabel(planType as "Ampere" | "Kilowatt" | "FixedKilowatt"))}`} onRemove={() => onAdvancedFiltersChange({ ...currentFilters, planType: "" })} /> : null}{customerRelation ? <FilterChip label={`${t("subscribers.search.relation")}: ${t(getSubscriberRelationLabel(customerRelation as "Friend" | "Family" | "Owner" | "Other"))}`} onRemove={() => onAdvancedFiltersChange({ ...currentFilters, customerRelation: "" })} /> : null}{customerStatus ? <FilterChip label={`${t("subscribers.search.status")}: ${t(STATUS_OPTIONS.find((option) => option.value === customerStatus)?.labelKey ?? "subscribers.status.all")}`} onRemove={() => onAdvancedFiltersChange({ ...currentFilters, customerStatus: "" })} /> : null}{selectedSchedule ? <FilterChip label={`${t("subscribers.search.ampereSchedule")}: ${selectedSchedule.name}`} onRemove={() => onAdvancedFiltersChange({ ...currentFilters, ampereScheduleId: "" })} /> : null}<Button className="h-8 px-2 text-xs" variant="ghost" onClick={clearFilters}>{t("subscribers.filters.clearAll")}</Button></div> : null}

      <p className="text-xs text-muted-foreground">{t(total === 1 ? "subscribers.count" : "subscribers.count_plural", { count: total })}{isFetching ? ` · ${t("areas.refreshing")}` : ""}</p>
    </div>
  );
}

function AdvancedSelect({ label, value, onValueChange, children }: Readonly<{ label: string; value: string; onValueChange: (value: string) => void; children: React.ReactNode }>) {
  return <label className="block space-y-1.5"><span className="text-sm font-medium text-foreground">{label}</span><Select value={value} onValueChange={onValueChange}><SelectTrigger className="h-11 rounded-xl border-white/8 bg-card"><SelectValue /></SelectTrigger><SelectContent>{children}</SelectContent></Select></label>;
}

function FilterChip({ label, onRemove }: Readonly<{ label: string; onRemove: () => void }>) {
  return <Badge className="gap-1 rounded-full border-primary/30 bg-primary/10 px-2.5 py-1 text-foreground" variant="outline">{label}<button aria-label={`Remove ${label}`} className="rounded-full p-0.5 hover:bg-primary/15" type="button" onClick={onRemove}><X className="h-3 w-3" /></button></Badge>;
}
