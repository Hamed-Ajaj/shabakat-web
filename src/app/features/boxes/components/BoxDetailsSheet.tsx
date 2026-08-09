import { useEffect, useState } from "react";
import { Calendar, MapPinned, NotebookPen, Package2, Phone, UsersRound } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet";
import { useI18n } from "../../../providers/I18nProvider";
import { Avatar } from "../../../shared/components/Avatar";
import { SectionCard } from "../../../shared/components/SectionCard";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { getSubscriberPlanLabel } from "../../subscribers/subscriberLabels";
import { useBoxSubscribersQuery } from "../../subscribers/queries";
import type { BoxRecord } from "../types";

interface BoxDetailsSheetProps {
  box: BoxRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BoxDetailsSheet({
  box,
  open,
  onOpenChange,
}: Readonly<BoxDetailsSheetProps>) {
  const { formatCurrency, formatDate, isRtl, t } = useI18n();
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    setPageIndex(0);
  }, [box?.id]);

  const subscribersQuery = useBoxSubscribersQuery(
    box?.id,
    pageIndex,
    open && Boolean(box),
  );
  const subscribers = subscribersQuery.data?.data ?? [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isRtl ? "right" : "left"}
        className="w-full overflow-y-auto border-white/8 bg-background p-0 sm:max-w-xl"
      >
        <SheetHeader className="border-b border-white/8 px-6 py-5">
          <SheetTitle className="text-xl text-foreground">
            {box?.name ?? t("boxes.actions.viewDetails")}
          </SheetTitle>
          <SheetDescription>{t("boxes.details.description")}</SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-6 py-5">
          {box ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <MetricCard
                  label={t("boxes.details.subscribers")}
                  value={t(box.customerCount === 1 ? "boxes.subscriberCount" : "boxes.subscriberCount_plural", { count: box.customerCount })}
                />
                <MetricCard label={t("boxes.details.created")} value={formatDate(box.createdAt)} />
              </div>

              <SectionCard className="space-y-4 p-5">
                <DetailRow icon={Package2} label={t("boxes.details.name")} value={box.name} />
                <DetailRow icon={MapPinned} label={t("boxes.details.area")} value={box.areaName} />
                <DetailRow
                  icon={MapPinned}
                  label={t("boxes.details.locationNote")}
                  value={box.locationNote || t("common.labels.notSet")}
                />
                <DetailRow
                  icon={NotebookPen}
                  label={t("boxes.details.notes")}
                  value={box.notes || t("common.labels.notSet")}
                />
                <DetailRow
                  icon={UsersRound}
                  label={t("boxes.details.assignedSubscribers")}
                  value={t(box.customerCount === 1 ? "boxes.subscriberCount" : "boxes.subscriberCount_plural", { count: box.customerCount })}
                />
                <DetailRow icon={Calendar} label={t("boxes.details.createdAt")} value={formatDate(box.createdAt)} />
              </SectionCard>

              <SectionCard className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {t("boxes.details.assignedSubscribers")}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {t("boxes.details.assignedSubscribersDescription")}
                    </p>
                  </div>
                  <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
                    {t(subscribersQuery.data?.totalCount === 1 ? "boxes.subscriberCount" : "boxes.subscriberCount_plural", {
                      count: subscribersQuery.data?.totalCount ?? 0,
                    })}
                  </Badge>
                </div>

                {subscribersQuery.isLoading ? <BoxSubscribersSkeleton /> : null}
                {subscribersQuery.error instanceof Error ? (
                  <p className="text-sm text-red-300">{subscribersQuery.error.message}</p>
                ) : null}
                {!subscribersQuery.isLoading && !subscribers.length ? (
                  <p className="text-sm text-muted-foreground">
                    {t("boxes.details.noSubscribers")}
                  </p>
                ) : null}

                {subscribers.length ? (
                  <div className="space-y-3">
                    {subscribers.map((subscriber) => (
                      <div
                        key={subscriber.id}
                        className="rounded-2xl border border-white/8 bg-white/[0.02] p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <Avatar name={subscriber.name} />
                            <div className="space-y-2">
                              <div>
                                <p className="text-sm font-semibold text-foreground">
                                  {subscriber.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {t(getSubscriberPlanLabel(subscriber.plan))} · {subscriber.planValue}
                                </p>
                              </div>
                              <div className="flex flex-wrap items-center gap-2">
                                <StatusBadge status={subscriber.status} />
                                <Badge variant="outline" className="rounded-full px-2.5 py-1 text-xs">
                                  {formatDate(subscriber.subscriptionDate)}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                              {t("subscribers.table.amountDue")}
                            </p>
                            <p className="mt-2 text-base font-semibold text-foreground">
                              {formatCurrency(subscriber.amountDue)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4 text-primary" />
                          <span className="font-mono">
                            {subscriber.phone ?? t("subscribers.notSet")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}

                {subscribersQuery.data && subscribersQuery.data.pageCount > 1 ? (
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-4">
                    <span className="text-sm text-muted-foreground">
                      {t("subscribers.pageNumber", {
                        page: subscribersQuery.data.pageNumber,
                        count: subscribersQuery.data.pageCount,
                      })}
                    </span>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" disabled={!subscribersQuery.data.hasPreviousPage} onClick={() => setPageIndex((current) => current - 1)}>
                        {t("subscribers.actions.previous")}
                      </Button>
                      <Button type="button" variant="outline" disabled={!subscribersQuery.data.hasNextPage} onClick={() => setPageIndex((current) => current + 1)}>
                        {t("subscribers.actions.next")}
                      </Button>
                    </div>
                  </div>
                ) : null}
              </SectionCard>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t("boxes.details.empty")}
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MetricCard({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <SectionCard className="p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-xl font-semibold text-foreground">{value}</p>
    </SectionCard>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: Readonly<{ icon: typeof Calendar; label: string; value: string }>) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-lg border border-white/8 bg-white/[0.03] p-2 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
        <p className="mt-1 text-sm text-foreground">{value}</p>
      </div>
    </div>
  );
}

function BoxSubscribersSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-white/8 bg-white/[0.02] p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 animate-pulse rounded-full bg-white/10" />
              <div className="space-y-2">
                <div className="h-4 w-32 animate-pulse rounded-full bg-white/10" />
                <div className="h-3 w-24 animate-pulse rounded-full bg-white/10" />
                <div className="h-5 w-28 animate-pulse rounded-full bg-white/10" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-16 animate-pulse rounded-full bg-white/10" />
              <div className="h-5 w-20 animate-pulse rounded-full bg-white/10" />
            </div>
          </div>
          <div className="mt-4 h-4 w-28 animate-pulse rounded-full bg-white/10" />
        </div>
      ))}
    </div>
  );
}
