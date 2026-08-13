import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Switch } from "../../../components/ui/switch";
import { useAuth } from "../../../providers/AuthProvider";
import { useI18n } from "../../../providers/I18nProvider";
import { customerExportColumns, getCustomerExportColumns, saveCustomerExportColumns, type CustomerExportColumn } from "../../../shared/export/customerExportColumns";
import type { TranslationKey } from "../../../shared/i18n/messages";
import { SettingsScaffold } from "../components/SettingsScaffold";

const columnLabels: Record<CustomerExportColumn, TranslationKey> = {
  Name: "export.columns.name", Phone: "export.columns.phone", Address: "export.columns.address", Building: "export.columns.building",
  Floor: "export.columns.floor", CableName: "export.columns.cableName", AreaName: "export.columns.areaName", BoxName: "export.columns.boxName",
  AmpereScheduleName: "export.columns.ampereScheduleName", CustomerType: "export.columns.customerType", Plan: "export.columns.plan", PlanValue: "export.columns.planValue",
  SubscriptionDate: "export.columns.subscriptionDate", CustomerStatus: "export.columns.customerStatus", CustomerRelation: "export.columns.customerRelation",
  InitialMeterReading: "export.columns.initialMeterReading", LatestMeterReading: "export.columns.latestMeterReading", TotalBilled: "export.columns.totalBilled",
  TotalPaid: "export.columns.totalPaid", TotalToPay: "export.columns.totalToPay",
};

export default function ExcelExportColumnsPage() {
  const { session } = useAuth();
  const { t } = useI18n();
  const [columns, setColumns] = useState<CustomerExportColumn[]>(() => getCustomerExportColumns(session?.companyId));
  const canManage = session?.role === "Owner";

  useEffect(() => setColumns(getCustomerExportColumns(session?.companyId)), [session?.companyId]);

  function toggleColumn(column: CustomerExportColumn, checked: boolean) {
    if (!checked && columns.length === 1) return;
    setColumns((current) => checked ? [...current, column] : current.filter((item) => item !== column));
  }

  function handleSave() {
    saveCustomerExportColumns(columns, session?.companyId);
    toast.success(t("export.saved"));
  }

  return (
    <SettingsScaffold title={t("settings.title.excelExport")}>
      <p className="mb-5 text-sm text-muted-foreground">{t("export.description")}</p>
      <div className="divide-y divide-black/5 rounded-2xl border border-black/6 dark:divide-white/8 dark:border-white/8">
        {customerExportColumns.map((column) => {
          const checked = columns.includes(column);
          return <label className="flex cursor-pointer items-center gap-3 px-4 py-3" key={column}>
            <span className="flex-1 text-sm font-medium text-foreground">{t(columnLabels[column])}</span>
            <Switch checked={checked} disabled={!canManage || (checked && columns.length === 1)} onCheckedChange={(next) => toggleColumn(column, next)} />
          </label>;
        })}
      </div>
      {!canManage ? <p className="mt-4 text-sm text-muted-foreground">{t("export.ownerOnly")}</p> : null}
      <button className="mt-6 w-full rounded-2xl bg-secondary px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary/80 disabled:opacity-50" disabled={!canManage} onClick={handleSave} type="button">
        {t("common.actions.save")}
      </button>
    </SettingsScaffold>
  );
}
