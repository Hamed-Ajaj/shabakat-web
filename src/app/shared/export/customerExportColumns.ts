export const customerExportColumns = [
  "Name", "Phone", "Address", "Building", "Floor", "CableName", "AreaName", "BoxName",
  "AmpereScheduleName", "CustomerType", "Plan", "PlanValue", "SubscriptionDate", "CustomerStatus",
  "CustomerRelation", "InitialMeterReading", "LatestMeterReading", "TotalBilled", "TotalPaid", "TotalToPay",
] as const;

export type CustomerExportColumn = typeof customerExportColumns[number];

const defaultColumns: CustomerExportColumn[] = ["Name", "Phone", "Floor", "PlanValue", "TotalToPay"];

function storageKey(companyId?: string) {
  return `shabakat-export-columns:${companyId ?? "default"}`;
}

export function getCustomerExportColumns(companyId?: string): CustomerExportColumn[] {
  try {
    const saved = JSON.parse(window.localStorage.getItem(storageKey(companyId)) ?? "null");
    if (Array.isArray(saved)) {
      const columns = saved.filter((column): column is CustomerExportColumn => customerExportColumns.includes(column));
      if (columns.length) return columns;
    }
  } catch {
    // Use the backend defaults when a previous browser value is invalid.
  }

  return defaultColumns;
}

export function saveCustomerExportColumns(columns: CustomerExportColumn[], companyId?: string) {
  window.localStorage.setItem(storageKey(companyId), JSON.stringify(columns));
}
