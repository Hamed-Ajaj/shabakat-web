import { CheckCircle, MessageCircle, Phone, Send } from "lucide-react";
import { useState } from "react";
import { Avatar } from "../../../shared/components/Avatar";
import { SectionCard } from "../../../shared/components/SectionCard";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { subscribers } from "../../../shared/data/mockData";

export default function NotificationsPage() {
  const [channel, setChannel] = useState<"whatsapp" | "sms">("whatsapp");
  const [sentIds, setSentIds] = useState<number[]>([]);

  const pendingSubscribers = subscribers.filter((subscriber) => subscriber.status !== "paid");
  const remaining = Math.max(0, pendingSubscribers.length - sentIds.length);

  function handleSend(id: number) {
    setSentIds((current) => (current.includes(id) ? current : [...current, id]));
  }

  function handleSendAll() {
    setSentIds(pendingSubscribers.map((subscriber) => subscriber.id));
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Pending" value={pendingSubscribers.length} accentClassName="text-red-400" />
        <StatCard label="Sent Today" value={sentIds.length} accentClassName="text-emerald-400" />
        <StatCard label="Remaining" value={remaining} accentClassName="text-primary" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 rounded-xl border border-white/8 bg-card p-1">
          <ChannelButton label="WhatsApp" icon={MessageCircle} active={channel === "whatsapp"} onClick={() => setChannel("whatsapp")} tone="emerald" />
          <ChannelButton label="SMS" icon={Phone} active={channel === "sms"} onClick={() => setChannel("sms")} tone="primary" />
        </div>

        <button
          onClick={handleSendAll}
          disabled={remaining === 0}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
          Send All Reminders ({remaining})
        </button>
      </div>

      <SectionCard className="p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Message Template · {channel === "whatsapp" ? "WhatsApp" : "SMS"}
        </p>
        <div className={`rounded-xl border p-3 text-sm leading-relaxed ${
          channel === "whatsapp"
            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
            : "border-primary/20 bg-primary/10 text-primary"
        }`}>
          {channel === "whatsapp"
            ? "Shabakat — Dear [Name], your monthly generator subscription of $[Amount] is due on [Date]. Please arrange payment to avoid service interruption."
            : "Shabakat: Dear [Name], your $[Amount] generator subscription is due [Date]. Pay via bank or cash to avoid disconnection."}
        </div>
      </SectionCard>

      <SectionCard className="overflow-hidden">
        <div className="border-b border-white/8 px-5 py-4">
          <h2 className="text-lg font-semibold text-foreground">Pending Reminders</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Subscribers with unpaid or overdue invoices</p>
        </div>

        {pendingSubscribers.map((subscriber) => {
          const isSent = sentIds.includes(subscriber.id);

          return (
            <div key={subscriber.id} className="flex flex-wrap items-center gap-4 border-b border-white/8 px-5 py-4 last:border-b-0 hover:bg-white/[0.02]">
              <Avatar name={subscriber.name} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{subscriber.name}</p>
                  <StatusBadge status={subscriber.status} />
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{subscriber.phone} · {subscriber.area} · Due {subscriber.dueDate}</p>
              </div>
              <span className="mr-1 font-mono text-sm font-semibold text-foreground">${subscriber.amount}</span>
              <button
                onClick={() => handleSend(subscriber.id)}
                disabled={isSent}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                  isSent
                    ? "cursor-default border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                    : channel === "whatsapp"
                      ? "bg-emerald-500 text-white hover:bg-emerald-600"
                      : "bg-primary text-primary-foreground hover:opacity-90"
                }`}
              >
                {isSent ? <><CheckCircle className="h-3 w-3" />Sent</> : <><Send className="h-3 w-3" />{channel === "whatsapp" ? "WhatsApp" : "SMS"}</>}
              </button>
            </div>
          );
        })}
      </SectionCard>
    </div>
  );
}

function StatCard({ label, value, accentClassName }: Readonly<{ label: string; value: number; accentClassName: string }>) {
  return (
    <SectionCard className="p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className={`mt-1.5 font-mono text-3xl font-bold ${accentClassName}`}>{value}</p>
    </SectionCard>
  );
}

function ChannelButton({
  label,
  icon: Icon,
  active,
  tone,
  onClick,
}: Readonly<{ label: string; icon: typeof MessageCircle; active: boolean; tone: "emerald" | "primary"; onClick: () => void }>) {
  const activeClassName = tone === "emerald" ? "bg-emerald-500 text-white" : "bg-primary text-primary-foreground";

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-all ${
        active ? activeClassName : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
