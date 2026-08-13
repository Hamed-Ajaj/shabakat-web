import { AlertCircle, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Skeleton } from "../../../components/ui/skeleton";
import { useAuth } from "../../../providers/AuthProvider";
import { useI18n } from "../../../providers/I18nProvider";
import { SectionCard } from "../../../shared/components/SectionCard";
import type { TranslationKey } from "../../../shared/i18n/messages";
import { useAuditLogsQuery } from "../queries";
import type { AuditLog } from "../types";

const PAGE_SIZE = 20;
const MESSAGE_KEYS: Record<string, TranslationKey> = {
  "audit.customer.created": "audit.customer.created",
  "audit.expense.created": "audit.expense.created",
  "audit.invoice.created": "audit.invoice.created",
  "audit.invoice.bulk_created": "audit.invoice.bulk_created",
  "audit.invoice.payment_recorded": "audit.invoice.payment_recorded",
  "audit.invoice.fixed_kilowatt_charge": "audit.invoice.fixed_kilowatt_charge",
};

export default function AuditLogsPage() {
  const { session } = useAuth();
  const { locale, t } = useI18n();
  const [pageIndex, setPageIndex] = useState(0);
  const logsQuery = useAuditLogsQuery(pageIndex, PAGE_SIZE);
  const logs = logsQuery.data?.data ?? [];

  if (session?.role !== "Owner") {
    return <SectionCard className="p-6 text-sm text-muted-foreground">{t("audit.unavailable")}</SectionCard>;
  }

  return (
    <div className="space-y-4">
      <SectionCard className="overflow-hidden">
        {logsQuery.isLoading ? <AuditLogsSkeleton /> : null}
        {!logsQuery.isLoading && logsQuery.error ? <div className="p-6 text-sm text-red-300">{t("audit.error")}</div> : null}
        {!logsQuery.isLoading && !logsQuery.error && logs.length === 0 ? <div className="p-10 text-center text-sm text-muted-foreground">{t("audit.empty")}</div> : null}
        {!logsQuery.isLoading && !logsQuery.error && logs.length > 0 ? <div className="divide-y divide-white/8">{logs.map((log) => <AuditLogRow key={log.id} locale={locale} log={log} />)}</div> : null}
      </SectionCard>

      {(logsQuery.data?.totalCount ?? 0) > 0 ? (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{t("audit.pageInfo", { count: logsQuery.data?.totalCount ?? 0 })}</span>
          <div className="flex gap-2">
            <Button aria-label={t("audit.previous")} disabled={!logsQuery.data?.hasPreviousPage} onClick={() => setPageIndex((page) => page - 1)} size="icon" variant="outline"><ChevronLeft /></Button>
            <Button aria-label={t("audit.next")} disabled={!logsQuery.data?.hasNextPage} onClick={() => setPageIndex((page) => page + 1)} size="icon" variant="outline"><ChevronRight /></Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function AuditLogRow({ locale, log }: Readonly<{ locale: "ar" | "en"; log: AuditLog }>) {
  const { t } = useI18n();
  const messageKey = MESSAGE_KEYS[log.messageKey];
  const timestamp = new Intl.DateTimeFormat(locale === "ar" ? "ar-LB" : "en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(log.createdAt));

  return (
    <article className="flex gap-3 px-4 py-4 sm:px-6">
      {log.status === "Success" ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" /> : <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{messageKey ? t(messageKey, log.parameters) : log.parameters.legacySummary || log.action}</p>
        {log.errorMessage ? <p className="mt-1 text-sm text-red-300">{log.errorMessage}</p> : null}
        <p className="mt-1 text-xs text-muted-foreground">{[log.userEmail, timestamp].filter(Boolean).join(" · ")}</p>
      </div>
    </article>
  );
}

function AuditLogsSkeleton() {
  return <div className="space-y-5 p-6">{Array.from({ length: 6 }).map((_, index) => <div className="flex gap-3" key={index}><Skeleton className="h-5 w-5 rounded-full" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-2/3" /><Skeleton className="h-3 w-1/3" /></div></div>)}</div>;
}
