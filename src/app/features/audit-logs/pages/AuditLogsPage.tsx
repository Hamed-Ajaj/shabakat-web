import { CalendarDays, ChevronLeft, ChevronRight, Eye, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Skeleton } from "../../../components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { useAuth } from "../../../providers/AuthProvider";
import { useI18n } from "../../../providers/I18nProvider";
import { SectionCard } from "../../../shared/components/SectionCard";
import { AuditLogDetailsSheet } from "../components/AuditLogDetailsSheet";
import { getAuditSummary } from "../auditLogDisplay";
import { useAuditLogsQuery } from "../queries";
import type { AuditLog, AuditLogAction, AuditLogFilters, AuditLogStatus } from "../types";

const PAGE_SIZE = 20;
const ACTIONS: AuditLogAction[] = ["CustomerCreated", "CustomerUpdated", "CustomerDeleted", "InvoiceCreated", "InvoiceBulkCreated", "InvoicePaymentRecorded", "InvoiceFixedKilowattCharge", "ExpenseCreated", "ExpenseUpdated", "ExpenseDeleted"];
const STATUSES: AuditLogStatus[] = ["Success", "Failed"];
const defaultFilters: AuditLogFilters = { action: "", status: "", createdFrom: "", createdTo: "", pageIndex: 0, pageSize: PAGE_SIZE };

export default function AuditLogsPage() {
  const { session } = useAuth();
  const { locale, t } = useI18n();
  const [filters, setFilters] = useState<AuditLogFilters>(defaultFilters);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const logsQuery = useAuditLogsQuery(filters);
  const logs = logsQuery.data?.data ?? [];

  if (session?.role !== "Owner") return <SectionCard className="p-6 text-sm text-muted-foreground">{t("audit.unavailable")}</SectionCard>;

  function updateFilters(next: Partial<AuditLogFilters>) {
    setFilters((current) => ({ ...current, ...next, pageIndex: 0 }));
  }

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid gap-3 sm:grid-cols-2">
          <FilterSelect label={t("audit.filters.action")} value={filters.action || "all"} onValueChange={(value) => updateFilters({ action: value === "all" ? "" : value as AuditLogAction })}>
            <SelectItem value="all">{t("audit.filters.allActions")}</SelectItem>
            {ACTIONS.map((action) => <SelectItem key={action} value={action}>{action.replace(/([a-z])([A-Z])/g, "$1 $2")}</SelectItem>)}
          </FilterSelect>
          <FilterSelect label={t("audit.filters.status")} value={filters.status || "all"} onValueChange={(value) => updateFilters({ status: value === "all" ? "" : value as AuditLogStatus })}>
            <SelectItem value="all">{t("audit.filters.allStatuses")}</SelectItem>
            {STATUSES.map((status) => <SelectItem key={status} value={status}>{t(status === "Success" ? "audit.status.success" : "audit.status.failed")}</SelectItem>)}
          </FilterSelect>
        </div>
        <div className="grid gap-3 sm:grid-cols-[10rem_10rem_auto] lg:items-end">
          <DateFilter label={t("audit.filters.from")} value={filters.createdFrom} onChange={(createdFrom) => updateFilters({ createdFrom })} />
          <DateFilter label={t("audit.filters.to")} value={filters.createdTo} onChange={(createdTo) => updateFilters({ createdTo })} />
          <Button className="shrink-0" variant="outline" onClick={() => setFilters(defaultFilters)}><RotateCcw />{t("audit.filters.reset")}</Button>
        </div>
      </section>

      <p className="text-sm text-muted-foreground">{t("audit.pageInfo", { count: logsQuery.data?.totalCount ?? 0 })}</p>
      <SectionCard className="overflow-hidden">
        {logsQuery.isLoading ? <AuditLogsSkeleton /> : null}
        {!logsQuery.isLoading && logsQuery.error ? <div className="p-6 text-sm text-red-300">{t("audit.error")}</div> : null}
        {!logsQuery.isLoading && !logsQuery.error && logs.length === 0 ? <div className="p-10 text-center text-sm text-muted-foreground">{t("audit.empty")}</div> : null}
        {!logsQuery.isLoading && !logsQuery.error && logs.length > 0 ? <AuditLogsTable logs={logs} locale={locale} onView={setSelectedLog} /> : null}
      </SectionCard>

      {(logsQuery.data?.totalCount ?? 0) > 0 ? <div className="flex items-center justify-end gap-2"><Button aria-label={t("audit.previous")} disabled={!logsQuery.data?.hasPreviousPage} onClick={() => setFilters((current) => ({ ...current, pageIndex: current.pageIndex - 1 }))} size="icon" variant="outline"><ChevronLeft /></Button><Button aria-label={t("audit.next")} disabled={!logsQuery.data?.hasNextPage} onClick={() => setFilters((current) => ({ ...current, pageIndex: current.pageIndex + 1 }))} size="icon" variant="outline"><ChevronRight /></Button></div> : null}
      <AuditLogDetailsSheet log={selectedLog} open={selectedLog !== null} onOpenChange={(open) => { if (!open) setSelectedLog(null); }} />
    </div>
  );
}

function FilterSelect({ label, value, onValueChange, children }: Readonly<{ label: string; value: string; onValueChange: (value: string) => void; children: React.ReactNode }>) {
  return <label className="space-y-1.5"><span className="sr-only">{label}</span><Select value={value} onValueChange={onValueChange}><SelectTrigger className="h-11 min-w-48"><SelectValue placeholder={label} /></SelectTrigger><SelectContent>{children}</SelectContent></Select></label>;
}

function DateFilter({ label, value, onChange }: Readonly<{ label: string; value: string; onChange: (value: string) => void }>) {
  return <label className="relative"><span className="sr-only">{label}</span><CalendarDays className="pointer-events-none absolute top-3 left-3 h-4 w-4 text-muted-foreground" /><Input aria-label={label} className="h-11 w-full pl-9" type="date" value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}

function AuditLogsTable({ logs, locale, onView }: Readonly<{ logs: AuditLog[]; locale: "ar" | "en"; onView: (log: AuditLog) => void }>) {
  const { t } = useI18n();
  return <Table><TableHeader><TableRow className="hover:bg-transparent"><TableHead>{t("audit.table.event")}</TableHead><TableHead className="hidden md:table-cell">{t("audit.table.action")}</TableHead><TableHead className="hidden lg:table-cell">{t("audit.table.entity")}</TableHead><TableHead className="hidden sm:table-cell">{t("audit.table.status")}</TableHead><TableHead><span className="sr-only">{t("audit.details.view")}</span></TableHead></TableRow></TableHeader><TableBody>{logs.map((log) => <TableRow key={log.id}><TableCell className="min-w-64 whitespace-normal py-4"><p className="font-medium text-foreground">{getAuditSummary(log, t)}</p><p className="mt-1 text-xs text-muted-foreground">{new Intl.DateTimeFormat(locale === "ar" ? "ar-LB" : "en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(log.createdAt))}</p></TableCell><TableCell className="hidden md:table-cell"><ActionBadge action={log.action} /></TableCell><TableCell className="hidden lg:table-cell">{log.entityType ?? "—"}</TableCell><TableCell className="hidden sm:table-cell"><StatusBadge status={log.status} /></TableCell><TableCell><Button aria-label={t("audit.details.view")} size="icon" title={t("audit.details.view")} variant="ghost" onClick={() => onView(log)}><Eye /></Button></TableCell></TableRow>)}</TableBody></Table>;
}

function ActionBadge({ action }: Readonly<{ action: string }>) {
  return <Badge className="border-white/10 bg-muted/40 text-foreground" variant="outline">{action.replace(/([a-z])([A-Z])/g, "$1 $2")}</Badge>;
}

function StatusBadge({ status }: Readonly<{ status: AuditLog["status"] }>) {
  const { t } = useI18n();
  return <Badge className={status === "Success" ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-400" : "border-red-400/20 bg-red-400/10 text-red-400"}>{t(status === "Success" ? "audit.status.success" : "audit.status.failed")}</Badge>;
}

function AuditLogsSkeleton() { return <div className="space-y-4 p-6">{Array.from({ length: 6 }).map((_, index) => <div className="flex justify-between gap-4" key={index}><div className="flex-1 space-y-2"><Skeleton className="h-4 w-2/3" /><Skeleton className="h-3 w-1/3" /></div><Skeleton className="h-7 w-28" /><Skeleton className="h-7 w-20" /></div>)}</div>; }
