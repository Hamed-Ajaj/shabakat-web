import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { useI18n } from "../../../providers/I18nProvider";
import type { AreaRecord } from "../../areas/types";
import type { SubscriberSearchField } from "../types";
import type { LookupOption } from "../subscribersApi";
import { getSubscriberRelationLabel, getSubscriberPlanLabel } from "../subscriberLabels";

const STATUS_OPTIONS = [
  { value: "", labelKey: "subscribers.status.all" },
  { value: "Active", labelKey: "subscribers.status.active" },
  { value: "Suspended", labelKey: "subscribers.status.suspended" },
  { value: "Terminated", labelKey: "subscribers.status.terminated" },
] as const;

export interface SubscribersToolbarProps {
  areaId: string;
  areas: AreaRecord[];
  customerRelation: string;
  customerRelations: LookupOption[];
  customerStatus: string;
  isFetching: boolean;
  planType: string;
  planTypes: LookupOption[];
  searchField: SubscriberSearchField;
  searchTerm: string;
  total: number;
  onAreaChange: (value: string) => void;
  onCreateClick: () => void;
  onCustomerRelationChange: (value: string) => void;
  onCustomerStatusChange: (value: string) => void;
  onPlanTypeChange: (value: string) => void;
  onSearchFieldChange: (value: SubscriberSearchField) => void;
  onSearchTermChange: (value: string) => void;
}

export function SubscribersToolbar({
  areaId,
  areas,
  customerRelation,
  customerRelations,
  customerStatus,
  isFetching,
  planType,
  planTypes,
  searchField,
  searchTerm,
  total,
  onAreaChange,
  onCreateClick,
  onCustomerRelationChange,
  onCustomerStatusChange,
  onPlanTypeChange,
  onSearchFieldChange,
  onSearchTermChange,
}: Readonly<SubscribersToolbarProps>) {
  const { t } = useI18n();
  const areaValue = areaId || "all";
  const planTypeValue = planType || "all";
  const relationValue = customerRelation || "all";

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
                <SelectValue placeholder={t("subscribers.searchField.name")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">{t("subscribers.searchField.name")}</SelectItem>
                <SelectItem value="phone">{t("subscribers.searchField.phone")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <input
            type="text"
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
            placeholder={
              searchField === "name" ? t("subscribers.search.byName") : t("subscribers.search.byPhone")
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
              <SelectValue placeholder={t("subscribers.search.area")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("subscribers.search.allAreas")}</SelectItem>
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
          {t("subscribers.actions.add")}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-40">
          <Select
            value={planTypeValue}
            onValueChange={(value) => onPlanTypeChange(value === "all" ? "" : value)}
          >
            <SelectTrigger className="rounded-xl border-white/8 bg-card">
              <SelectValue placeholder={t("subscribers.search.planType")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("subscribers.search.allPlanTypes")}</SelectItem>
              {planTypes.map((option) => (
                <SelectItem key={option.label} value={option.label}>
                  {t(getSubscriberPlanLabel(option.label as "Ampere" | "Kilowatt" | "FixedKilowatt"))}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-40">
          <Select
            value={relationValue}
            onValueChange={(value) => onCustomerRelationChange(value === "all" ? "" : value)}
          >
            <SelectTrigger className="rounded-xl border-white/8 bg-card">
              <SelectValue placeholder={t("subscribers.search.relation")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("subscribers.search.allRelations")}</SelectItem>
              {customerRelations.map((option) => (
                <SelectItem key={option.label} value={option.label}>
                  {t(getSubscriberRelationLabel(option.label as "Friend" | "Family" | "Owner" | "Other"))}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-40">
          <Select
            value={customerStatus || "all"}
            onValueChange={onCustomerStatusChange}
          >
            <SelectTrigger className="rounded-xl border-white/8 bg-card">
              <SelectValue placeholder={t("subscribers.search.status")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("subscribers.search.allStatuses")}</SelectItem>
              {STATUS_OPTIONS.filter((o) => o.value !== "").map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {t(option.labelKey as never)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        {t(total === 1 ? "subscribers.count" : "subscribers.count_plural", { count: total })}
        {isFetching ? ` · ${t("areas.refreshing")}` : ""}
      </p>
    </div>
  );
}
