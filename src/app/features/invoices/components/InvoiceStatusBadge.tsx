import { StatusBadge } from "../../../shared/components/StatusBadge";
import type { InvoiceStatus } from "../types";
import { mapInvoiceStatusToBadge } from "../utils";

export function InvoiceStatusBadge({ status }: Readonly<{ status: InvoiceStatus }>) {
  return <StatusBadge status={mapInvoiceStatusToBadge(status)} />;
}
