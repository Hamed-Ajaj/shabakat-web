import { FileText } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet";
import { useI18n } from "../../../providers/I18nProvider";
import { SectionCard } from "../../../shared/components/SectionCard";
import { getAuditActionLabel, getAuditEntityLabel, getAuditParamLabel, getAuditSummary } from "../auditLogDisplay";
import type { AuditLog } from "../types";

export function AuditLogDetailsSheet({
  log,
  open,
  onOpenChange,
}: Readonly<{
  log: AuditLog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>) {
  const { isRtl, locale, t } = useI18n();
  const detailEntries = log ? Object.entries(log.parameters) : [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={isRtl ? "right" : "left"} className="w-full overflow-y-auto border-white/8 bg-background p-0 sm:max-w-xl">
        <SheetHeader className="border-b border-white/8 px-6 py-5">
          <SheetTitle className="flex items-center gap-2 text-xl text-foreground">
            <FileText className="h-5 w-5 text-primary" />
            {t("audit.details.title")}
          </SheetTitle>
          <SheetDescription>{t("audit.details.description")}</SheetDescription>
        </SheetHeader>

        {log ? (
          <div className="space-y-5 px-6 py-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <MetricCard label={t("audit.table.action")} value={<ActionBadge action={log.action} />} />
              <MetricCard label={t("audit.table.status")} value={<StatusBadge status={log.status} />} />
            </div>

            <SectionCard className="space-y-4 p-5">
              <DetailItem label={t("audit.details.summary")} value={getAuditSummary(log, t)} />
              <div className="grid gap-4 sm:grid-cols-2">
                <DetailItem label={t("audit.details.when")} value={formatDateTime(log.createdAt, locale)} />
                <DetailItem label={t("audit.table.entity")} value={log.entityType ? getAuditEntityLabel(log.entityType, t) : t("audit.notSet")} />
              </div>
              <DetailItem label={t("audit.details.entityId")} value={log.entityId ?? t("audit.notSet")} mono />
              {log.userEmail ? <DetailItem label={t("audit.details.user")} value={log.userEmail} /> : null}
              {log.errorMessage ? <DetailItem label={t("audit.details.error")} value={log.errorMessage} error /> : null}
            </SectionCard>

            <SectionCard className="p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t("audit.details.fields")}</h3>
                <span className="text-sm text-muted-foreground">{t("audit.details.fieldCount", { count: detailEntries.length })}</span>
              </div>
              {detailEntries.length ? (
                <dl className="divide-y divide-white/8">
                  {detailEntries.map(([key, value]) => (
                    <div className="grid gap-2 py-3 sm:grid-cols-2" key={key}>
                      <dt className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{getAuditParamLabel(key, t)}</dt>
                      <dd className="wrap-break-word text-sm text-foreground sm:text-right">{formatParameter(value, locale)}</dd>
                    </div>
                  ))}
                </dl>
              ) : <p className="text-sm text-muted-foreground">{t("audit.details.noFields")}</p>}
            </SectionCard>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

function ActionBadge({ action }: Readonly<{ action: string }>) {
  const { t } = useI18n();
  return <Badge className="border-white/10 bg-muted/40 text-foreground" variant="outline">{getAuditActionLabel(action, t)}</Badge>;
}

function StatusBadge({ status }: Readonly<{ status: AuditLog["status"] }>) {
  const { t } = useI18n();
  return <Badge className={status === "Success" ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-400" : "border-red-400/20 bg-red-400/10 text-red-400"}>{t(status === "Success" ? "audit.status.success" : "audit.status.failed")}</Badge>;
}

function MetricCard({ label, value }: Readonly<{ label: string; value: React.ReactNode }>) {
  return <SectionCard className="space-y-3 p-5"><p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{label}</p>{value}</SectionCard>;
}

function DetailItem({ label, value, mono = false, error = false }: Readonly<{ label: string; value: string; mono?: boolean; error?: boolean }>) {
  return <div className="space-y-1"><p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{label}</p><p className={`wrap-break-word text-sm ${mono ? "font-mono text-xs" : ""} ${error ? "text-red-300" : "text-foreground"}`}>{value}</p></div>;
}

function formatDateTime(value: string, locale: "ar" | "en") {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-LB" : "en-GB", { dateStyle: "medium", timeStyle: "medium" }).format(new Date(value));
}

function formatParameter(value: unknown, locale: "ar" | "en") {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) return formatDateTime(value, locale);
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}


