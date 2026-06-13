import { ChevronDown, Download, Printer } from "lucide-react";
import { useState } from "react";
import { Avatar } from "../../../shared/components/Avatar";
import { SectionCard } from "../../../shared/components/SectionCard";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { subscribers } from "../../../shared/data/mockData";

export default function InvoicesPage() {
  const [selectedId, setSelectedId] = useState(subscribers[0].id);
  const subscriber = subscribers.find((item) => item.id === selectedId) ?? subscribers[0];
  const invoiceNumber = `INV-2025-${String(subscriber.id).padStart(4, "0")}`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-56 flex-1">
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Select Subscriber</label>
          <div className="relative">
            <select
              value={selectedId}
              onChange={(event) => setSelectedId(Number(event.target.value))}
              className="w-full appearance-none rounded-xl border border-white/8 bg-card px-4 py-2.5 pr-9 text-sm text-foreground outline-none transition focus:border-primary"
            >
              {subscribers.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} - {item.area} ({item.ampere})
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl border border-white/8 px-4 py-2.5 text-sm text-foreground transition hover:bg-white/5"
          >
            <Printer className="h-4 w-4" />
            Print
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </button>
        </div>
      </div>

      <SectionCard className="mx-auto max-w-4xl p-6 md:p-8">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-foreground">Shabakat</p>
            <p className="text-xs text-muted-foreground">Hamra Street, Beirut, Lebanon</p>
            <p className="text-xs text-muted-foreground">+961 71 000 000 - billing@shabakat.app</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-2xl font-bold text-primary">INVOICE</p>
            <p className="mt-1 text-sm font-mono text-muted-foreground">{invoiceNumber}</p>
            <div className="mt-2">
              <StatusBadge status={subscriber.status} />
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-4 rounded-2xl border border-white/8 bg-secondary p-4 md:grid-cols-3">
          <InfoCell label="Issue Date" value="May 1, 2025" />
          <InfoCell label="Due Date" value={subscriber.dueDate} />
          <InfoCell label="Period" value="May 2025" />
        </div>

        <div className="mb-8 flex items-center gap-3">
          <Avatar name={subscriber.name} size="lg" />
          <div>
            <p className="font-semibold text-foreground">{subscriber.name}</p>
            <p className="text-sm text-muted-foreground">{subscriber.phone}</p>
            <p className="text-sm text-muted-foreground">{subscriber.area}, Beirut, Lebanon</p>
          </div>
        </div>

        <div className="mb-6 overflow-hidden rounded-2xl border border-white/8">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr className="border-b border-white/8">
                {["Description", "Qty", "Rate", "Total"].map((header) => (
                  <th key={header} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-4">
                  <p className="text-sm font-medium text-foreground">Monthly Generator Subscription</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{subscriber.ampere} capacity · May 2025 · Beirut Grid Zone</p>
                </td>
                <td className="px-4 py-4 text-sm text-muted-foreground">1</td>
                <td className="px-4 py-4 text-right font-mono text-sm text-foreground">${subscriber.amount}.00</td>
                <td className="px-4 py-4 text-right font-mono text-sm font-semibold text-foreground">${subscriber.amount}.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-8 flex justify-end">
          <div className="w-56 space-y-2.5">
            <TotalsRow label="Subtotal" value={`$${subscriber.amount}.00`} />
            <TotalsRow label="Tax (0%)" value="$0.00" />
            <div className="h-px bg-white/8" />
            <div className="flex justify-between text-base font-semibold">
              <span className="text-foreground">Total Due</span>
              <span className="font-mono text-primary">${subscriber.amount}.00</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/8 pt-6 text-center">
          <p className="text-xs text-muted-foreground">Thank you for your subscription. Questions? Call +961 71 000 000.</p>
          <p className="mt-1 text-xs text-muted-foreground">Payment via bank transfer or cash. Shabakat, Hamra, Beirut.</p>
        </div>
      </SectionCard>
    </div>
  );
}

function InfoCell({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div>
      <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function TotalsRow({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono text-foreground">{value}</span>
    </div>
  );
}
