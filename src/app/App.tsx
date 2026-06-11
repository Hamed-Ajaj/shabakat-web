import { useState } from "react";
import {
  LayoutDashboard, Users, FileText, Bell, Settings,
  Search, Plus, Download, Printer, Send, Zap, Menu, X,
  CheckCircle, AlertCircle, Clock, MoreHorizontal, ArrowUpRight,
  MessageCircle, Phone, ChevronDown, DollarSign, UserCheck,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

// ── Types ─────────────────────────────────────────────────────────────────────

type Page = "dashboard" | "subscribers" | "invoice" | "notifications";
type Status = "paid" | "unpaid" | "overdue";

interface Subscriber {
  id: number;
  name: string;
  phone: string;
  area: string;
  ampere: string;
  subscriptionDate: string;
  status: Status;
  amount: number;
  dueDate: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────

const SUBSCRIBERS: Subscriber[] = [
  { id: 1,  name: "Ahmad Khalil",        phone: "+961 71 234 567", area: "Hamra",            ampere: "5A",  subscriptionDate: "Jan 15, 2024", status: "paid",    amount: 85,  dueDate: "Jun 15, 2025" },
  { id: 2,  name: "Rania Mansour",       phone: "+961 70 345 678", area: "Achrafieh",         ampere: "10A", subscriptionDate: "Feb 1, 2024",  status: "unpaid",  amount: 150, dueDate: "May 28, 2025" },
  { id: 3,  name: "Khalid Barakat",      phone: "+961 76 456 789", area: "Verdun",            ampere: "5A",  subscriptionDate: "Nov 20, 2023", status: "paid",    amount: 85,  dueDate: "Jun 20, 2025" },
  { id: 4,  name: "Lara Haddad",         phone: "+961 78 567 890", area: "Gemmayzeh",         ampere: "15A", subscriptionDate: "Mar 10, 2024", status: "overdue", amount: 210, dueDate: "May 10, 2025" },
  { id: 5,  name: "Hassan Nassar",       phone: "+961 71 678 901", area: "Mar Elias",         ampere: "5A",  subscriptionDate: "Jan 5, 2024",  status: "paid",    amount: 85,  dueDate: "Jun 5, 2025"  },
  { id: 6,  name: "Nadia Rizk",          phone: "+961 70 789 012", area: "Badaro",            ampere: "10A", subscriptionDate: "Dec 15, 2023", status: "unpaid",  amount: 150, dueDate: "May 25, 2025" },
  { id: 7,  name: "Fadi Gemayel",        phone: "+961 76 890 123", area: "Sodeco",            ampere: "20A", subscriptionDate: "Apr 1, 2024",  status: "paid",    amount: 280, dueDate: "Jun 1, 2025"  },
  { id: 8,  name: "Carla Khoury",        phone: "+961 78 901 234", area: "Ras Beirut",        ampere: "5A",  subscriptionDate: "Feb 20, 2024", status: "paid",    amount: 85,  dueDate: "Jun 20, 2025" },
  { id: 9,  name: "Rami Assaf",          phone: "+961 71 012 345", area: "Raouche",           ampere: "10A", subscriptionDate: "Oct 1, 2023",  status: "overdue", amount: 150, dueDate: "May 1, 2025"  },
  { id: 10, name: "Maya Frem",           phone: "+961 70 123 456", area: "Tallet el Khayat",  ampere: "15A", subscriptionDate: "Mar 25, 2024", status: "paid",    amount: 210, dueDate: "Jun 25, 2025" },
  { id: 11, name: "Elie Saab",           phone: "+961 76 234 567", area: "Monot",             ampere: "5A",  subscriptionDate: "Jan 30, 2024", status: "unpaid",  amount: 85,  dueDate: "May 30, 2025" },
  { id: 12, name: "Joelle Abou Jaoude", phone: "+961 78 345 678", area: "Hamra",             ampere: "20A", subscriptionDate: "Sep 15, 2023", status: "paid",    amount: 280, dueDate: "Jun 15, 2025" },
  { id: 13, name: "Georges Nassar",      phone: "+961 71 456 789", area: "Achrafieh",         ampere: "10A", subscriptionDate: "Apr 10, 2024", status: "paid",    amount: 150, dueDate: "Jun 10, 2025" },
  { id: 14, name: "Sandra Zgheib",       phone: "+961 70 567 890", area: "Verdun",            ampere: "5A",  subscriptionDate: "Feb 14, 2024", status: "overdue", amount: 85,  dueDate: "May 14, 2025" },
  { id: 15, name: "Marwan Tabbara",      phone: "+961 76 678 901", area: "Gemmayzeh",         ampere: "30A", subscriptionDate: "Aug 1, 2023",  status: "paid",    amount: 390, dueDate: "Jun 1, 2025"  },
];

const REVENUE_DATA = [
  { month: "Dec", billed: 9800,  collected: 8200  },
  { month: "Jan", billed: 10500, collected: 9100  },
  { month: "Feb", billed: 11200, collected: 9800  },
  { month: "Mar", billed: 12100, collected: 10500 },
  { month: "Apr", billed: 11800, collected: 10200 },
  { month: "May", billed: 12450, collected: 11100 },
];

const NAV_ITEMS = [
  { id: "dashboard"     as Page, icon: LayoutDashboard, label: "Dashboard"     },
  { id: "subscribers"   as Page, icon: Users,           label: "Subscribers"   },
  { id: "invoice"       as Page, icon: FileText,        label: "Invoices"      },
  { id: "notifications" as Page, icon: Bell,            label: "Notifications" },
];

const AVATAR_COLORS = ["#7c3aed", "#2563eb", "#059669", "#db2777", "#ea580c", "#0891b2", "#d97706"];

// ── Shared Components ─────────────────────────────────────────────────────────

function Avatar({ name, size = "sm" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const initials = name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  const color = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
  const sz = size === "sm" ? "h-8 w-8 text-xs" : size === "md" ? "h-9 w-9 text-sm" : "h-11 w-11 text-sm";
  return (
    <div className={`${sz} rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0`} style={{ backgroundColor: color }}>
      {initials}
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, { cls: string; label: string; Icon: typeof CheckCircle }> = {
    paid:    { cls: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", label: "Paid",    Icon: CheckCircle },
    unpaid:  { cls: "text-amber-400  bg-amber-400/10  border-amber-400/20",    label: "Unpaid",  Icon: Clock       },
    overdue: { cls: "text-red-400    bg-red-400/10    border-red-400/20",       label: "Overdue", Icon: AlertCircle },
  };
  const { cls, label, Icon } = map[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${cls}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border p-3 shadow-2xl min-w-36" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
      <p className="text-xs font-medium mb-2" style={{ color: "var(--muted-foreground)" }}>{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-sm font-mono font-semibold" style={{ color: entry.color }}>
          <span className="font-normal text-xs" style={{ color: "var(--muted-foreground)" }}>{entry.name}: </span>
          ${entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

// ── Sidebar ───────────────────────────────────────────────────────────────────

function Sidebar({ activePage, setActivePage, onClose }: {
  activePage: Page;
  setActivePage: (p: Page) => void;
  onClose?: () => void;
}) {
  return (
    <aside className="w-60 h-full flex flex-col" style={{ backgroundColor: "var(--sidebar)", borderRight: "1px solid var(--border)" }}>
      {/* Logo */}
      <div className="p-5 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center" style={{ boxShadow: "0 0 20px rgba(245,192,0,0.4)" }}>
            <Zap className="h-5 w-5 text-primary-foreground" fill="currentColor" />
          </div>
          <div>
            <p className="font-bold text-sm text-foreground leading-tight">El-Nour</p>
            <p className="text-xs leading-tight text-muted-foreground">Generators</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 transition-colors">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <div className="flex-1 px-3 overflow-y-auto">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Main Menu</p>
        <nav className="space-y-0.5">
          {NAV_ITEMS.map(({ id, icon: Icon, label }) => {
            const active = activePage === id;
            return (
              <button
                key={id}
                onClick={() => { setActivePage(id); onClose?.(); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
                style={active ? { boxShadow: "0 0 16px rgba(245,192,0,0.25)" } : undefined}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {label}
                {id === "notifications" && (
                  <span className="ml-auto flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                    8
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-6">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">System</p>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">
            <Settings className="h-4 w-4 flex-shrink-0" />
            Settings
          </button>
        </div>
      </div>

      {/* User */}
      <div className="p-4 flex-shrink-0" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="flex items-center gap-3">
          <Avatar name="Karim El-Nour" size="md" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">Karim El-Nour</p>
            <p className="text-xs text-muted-foreground">Owner · Hamra</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ── Top Navbar ────────────────────────────────────────────────────────────────

function TopNavbar({ activePage, onMenuClick }: { activePage: Page; onMenuClick: () => void }) {
  const titles: Record<Page, string> = {
    dashboard:     "Dashboard",
    subscribers:   "Subscribers",
    invoice:       "Invoices",
    notifications: "Notifications",
  };
  return (
    <header
      className="h-16 flex items-center gap-4 px-4 md:px-6 flex-shrink-0"
      style={{ borderBottom: "1px solid var(--border)", backgroundColor: "rgba(11,11,21,0.85)", backdropFilter: "blur(12px)" }}
    >
      <button onClick={onMenuClick} className="md:hidden text-muted-foreground hover:text-foreground p-1 -ml-1 transition-colors">
        <Menu className="h-5 w-5" />
      </button>

      <div className="min-w-0">
        <h1 className="font-semibold text-foreground text-base leading-tight">{titles[activePage]}</h1>
        <p className="text-xs text-muted-foreground hidden sm:block">El-Nour Generators · May 2025</p>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search subscribers..."
            className="w-56 rounded-lg pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            style={{ backgroundColor: "var(--secondary)", border: "1px solid var(--border)" }}
          />
        </div>

        <button className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full ring-2" style={{ ringColor: "var(--background)" }} />
        </button>

        <Avatar name="Karim El-Nour" />
      </div>
    </header>
  );
}

// ── Dashboard Page ────────────────────────────────────────────────────────────

function DashboardPage({ setActivePage }: { setActivePage: (p: Page) => void }) {
  const paid      = SUBSCRIBERS.filter((s) => s.status === "paid").length;
  const unpaidCnt = SUBSCRIBERS.filter((s) => s.status !== "paid").length;
  const overdueCnt = SUBSCRIBERS.filter((s) => s.status === "overdue").length;
  const totalRev  = SUBSCRIBERS.reduce((sum, s) => sum + s.amount, 0);
  const outstanding = SUBSCRIBERS.filter((s) => s.status !== "paid").reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="space-y-5">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="rounded-xl p-5 transition-colors" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Total Subscribers</p>
              <p className="mt-2 text-3xl font-bold font-mono text-foreground">{SUBSCRIBERS.length}</p>
              <p className="mt-1 text-xs text-emerald-400 flex items-center gap-0.5">
                <ArrowUpRight className="h-3 w-3" />+12 this month
              </p>
            </div>
            <div className="rounded-lg p-2.5 bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>

        <div className="rounded-xl p-5 transition-colors" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Paid This Month</p>
              <p className="mt-2 text-3xl font-bold font-mono text-emerald-400">{paid}</p>
              <p className="mt-1 text-xs text-muted-foreground">{Math.round((paid / SUBSCRIBERS.length) * 100)}% collection rate</p>
            </div>
            <div className="rounded-lg p-2.5 bg-emerald-500/10">
              <UserCheck className="h-5 w-5 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl p-5 transition-colors" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Unpaid Invoices</p>
              <p className="mt-2 text-3xl font-bold font-mono text-red-400">{unpaidCnt}</p>
              <p className="mt-1 text-xs text-red-400">{overdueCnt} overdue</p>
            </div>
            <div className="rounded-lg p-2.5 bg-red-500/10">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
          </div>
        </div>

        {/* Revenue — accent card */}
        <div
          className="col-span-2 lg:col-span-1 rounded-xl p-5 bg-primary"
          style={{ border: "1px solid rgba(245,192,0,0.4)", boxShadow: "0 0 30px rgba(245,192,0,0.18)" }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(11,11,21,0.6)" }}>Monthly Revenue</p>
              <p className="mt-2 text-3xl font-bold font-mono text-primary-foreground">${totalRev.toLocaleString()}</p>
              <p className="mt-1 text-xs" style={{ color: "rgba(11,11,21,0.55)" }}>${outstanding} outstanding</p>
            </div>
            <div className="rounded-lg p-2.5" style={{ backgroundColor: "rgba(11,11,21,0.1)" }}>
              <DollarSign className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="rounded-xl p-5" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            <h2 className="font-semibold text-foreground">Revenue Overview</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Dec 2024 – May 2025</p>
          </div>
          <div className="flex items-center gap-5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full inline-block" style={{ backgroundColor: "#f5c000" }} />
              Billed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" />
              Collected
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={REVENUE_DATA} margin={{ top: 2, right: 4, left: -22, bottom: 0 }}>
            <defs>
              <linearGradient id="gb" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#f5c000" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f5c000" stopOpacity={0}   />
              </linearGradient>
              <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}   />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: "#7a7a9a", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#7a7a9a", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="billed"    name="Billed"    stroke="#f5c000" strokeWidth={2} fill="url(#gb)" dot={false} activeDot={{ r: 4, fill: "#f5c000" }} />
            <Area type="monotone" dataKey="collected" name="Collected" stroke="#22c55e" strokeWidth={2} fill="url(#gc)" dot={false} activeDot={{ r: 4, fill: "#22c55e" }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-5 gap-4">
        {/* Recent Payments */}
        <div className="lg:col-span-3 rounded-xl p-5" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Recent Payments</h2>
            <button onClick={() => setActivePage("subscribers")} className="text-xs text-primary hover:opacity-70 font-medium transition-opacity">
              View all →
            </button>
          </div>
          <div>
            {SUBSCRIBERS.filter((s) => s.status === "paid").slice(0, 5).map((s) => (
              <div key={s.id} className="flex items-center gap-3 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
                <Avatar name={s.name} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.area} · {s.ampere}</p>
                </div>
                <div className="text-right flex-shrink-0 mr-2">
                  <p className="text-sm font-mono font-semibold text-foreground">${s.amount}</p>
                  <p className="text-xs text-muted-foreground">{s.dueDate}</p>
                </div>
                <StatusBadge status={s.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Due */}
        <div className="lg:col-span-2 rounded-xl p-5" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Upcoming Due</h2>
            <span className="text-xs font-medium text-red-400 bg-red-400/10 border border-red-400/20 rounded-full px-2 py-0.5">
              {unpaidCnt} pending
            </span>
          </div>
          <div>
            {SUBSCRIBERS.filter((s) => s.status !== "paid").slice(0, 5).map((s) => (
              <div key={s.id} className="flex items-center gap-3 py-2.5" style={{ borderBottom: "1px solid var(--border)" }}>
                <Avatar name={s.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.dueDate}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="font-mono text-sm font-semibold text-foreground">${s.amount}</span>
                  <StatusBadge status={s.status} />
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setActivePage("notifications")}
            className="mt-4 w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all"
            style={{ boxShadow: "0 0 16px rgba(245,192,0,0.2)" }}
          >
            Send Reminders
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Subscribers Page ──────────────────────────────────────────────────────────

function SubscribersPage() {
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");

  const filtered = SUBSCRIBERS.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch = s.name.toLowerCase().includes(q) || s.area.toLowerCase().includes(q) || s.phone.includes(q);
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, area, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap flex-shrink-0">
          {(["all", "paid", "unpaid", "overdue"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${
                statusFilter === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
              style={statusFilter !== s ? { border: "1px solid var(--border)" } : undefined}
            >
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        <button
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-all flex-shrink-0"
          style={{ boxShadow: "0 0 16px rgba(245,192,0,0.25)" }}
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Subscriber</span>
        </button>
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} of {SUBSCRIBERS.length} subscribers</p>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Name", "Phone Number", "Area", "Ampere", "Since", "Status", "Amount", ""].map((h, i) => (
                  <th key={i} className="text-left px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr
                  key={s.id}
                  className="transition-colors hover:bg-white/[0.03] cursor-pointer"
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={s.name} />
                      <span className="text-sm font-medium text-foreground whitespace-nowrap">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm font-mono text-muted-foreground whitespace-nowrap">{s.phone}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm text-foreground">{s.area}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm font-mono font-bold text-primary">{s.ampere}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">{s.subscriptionDate}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm font-mono font-semibold text-foreground">${s.amount}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <button className="text-muted-foreground hover:text-foreground transition-colors p-0.5">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Invoice Page ──────────────────────────────────────────────────────────────

function InvoicePage() {
  const [selectedId, setSelectedId] = useState(SUBSCRIBERS[0].id);
  const subscriber = SUBSCRIBERS.find((s) => s.id === selectedId)!;
  const invoiceNumber = `INV-2025-${String(selectedId).padStart(4, "0")}`;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-end gap-4 flex-wrap">
        <div className="flex-1 min-w-52">
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">Select Subscriber</label>
          <div className="relative">
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(Number(e.target.value))}
              className="w-full appearance-none rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary pr-8 cursor-pointer transition-all"
              style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            >
              {SUBSCRIBERS.map((s) => (
                <option key={s.id} value={s.id} style={{ backgroundColor: "#13131f" }}>
                  {s.name} — {s.area} ({s.ampere})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-white/5 transition-all"
            style={{ border: "1px solid var(--border)" }}
          >
            <Printer className="h-4 w-4" />
            Print
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-all"
            style={{ boxShadow: "0 0 16px rgba(245,192,0,0.2)" }}
          >
            <Download className="h-4 w-4" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Invoice Card */}
      <div
        className="rounded-2xl p-6 md:p-8 max-w-3xl"
        style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 25px 50px rgba(0,0,0,0.4)" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center" style={{ boxShadow: "0 0 20px rgba(245,192,0,0.4)" }}>
              <Zap className="h-7 w-7 text-primary-foreground" fill="currentColor" />
            </div>
            <div>
              <p className="font-bold text-xl text-foreground">El-Nour Generators</p>
              <p className="text-xs text-muted-foreground">Hamra Street, Beirut, Lebanon</p>
              <p className="text-xs text-muted-foreground">+961 71 000 000 · elnour@generators.lb</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary font-mono tracking-tight">INVOICE</p>
            <p className="text-sm font-mono text-muted-foreground mt-0.5">{invoiceNumber}</p>
            <div className="mt-2">
              <StatusBadge status={subscriber.status} />
            </div>
          </div>
        </div>

        {/* Meta row */}
        <div
          className="grid grid-cols-3 gap-4 mb-8 p-4 rounded-xl"
          style={{ backgroundColor: "var(--secondary)", border: "1px solid var(--border)" }}
        >
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Issue Date</p>
            <p className="text-sm font-semibold text-foreground">May 1, 2025</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Due Date</p>
            <p className={`text-sm font-semibold ${subscriber.status === "overdue" ? "text-red-400" : "text-foreground"}`}>
              {subscriber.dueDate}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Period</p>
            <p className="text-sm font-semibold text-foreground">May 2025</p>
          </div>
        </div>

        {/* Bill To */}
        <div className="mb-8">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Bill To</p>
          <div className="flex items-center gap-3">
            <Avatar name={subscriber.name} size="lg" />
            <div>
              <p className="font-semibold text-foreground">{subscriber.name}</p>
              <p className="text-sm text-muted-foreground">{subscriber.phone}</p>
              <p className="text-sm text-muted-foreground">{subscriber.area}, Beirut, Lebanon</p>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="rounded-xl overflow-hidden mb-6" style={{ border: "1px solid var(--border)" }}>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: "var(--secondary)", borderBottom: "1px solid var(--border)" }}>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</th>
                <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Qty</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rate</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-4">
                  <p className="text-sm font-medium text-foreground">Monthly Generator Subscription</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{subscriber.ampere} capacity · May 2025 · Beirut Grid Zone</p>
                </td>
                <td className="px-4 py-4 text-center text-sm text-muted-foreground">1</td>
                <td className="px-4 py-4 text-right text-sm font-mono text-foreground">${subscriber.amount}.00</td>
                <td className="px-4 py-4 text-right text-sm font-mono font-semibold text-foreground">${subscriber.amount}.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-52 space-y-2.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-mono text-foreground">${subscriber.amount}.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (0%)</span>
              <span className="font-mono text-foreground">$0.00</span>
            </div>
            <div className="h-px" style={{ backgroundColor: "var(--border)" }} />
            <div className="flex justify-between font-semibold">
              <span className="text-foreground">Total Due</span>
              <span className="font-mono text-primary text-lg">${subscriber.amount}.00</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 text-center" style={{ borderTop: "1px solid var(--border)" }}>
          <p className="text-xs text-muted-foreground">Thank you for your subscription. Questions? Call +961 71 000 000</p>
          <p className="text-xs text-muted-foreground mt-1">Payment via bank transfer (BLC Bank) or cash. El-Nour Generators, Hamra, Beirut.</p>
        </div>
      </div>
    </div>
  );
}

// ── Notifications Page ────────────────────────────────────────────────────────

function NotificationsPage() {
  const [channel, setChannel] = useState<"whatsapp" | "sms">("whatsapp");
  const [sentIds, setSentIds]  = useState<number[]>([]);

  const pending  = SUBSCRIBERS.filter((s) => s.status !== "paid");
  const remaining = Math.max(0, pending.length - sentIds.length);

  const handleSend    = (id: number) => setSentIds((prev) => [...prev, id]);
  const handleSendAll = () => setSentIds(pending.map((s) => s.id));

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl p-4" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pending</p>
          <p className="text-3xl font-bold font-mono text-red-400 mt-1.5">{pending.length}</p>
        </div>
        <div className="rounded-xl p-4" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sent Today</p>
          <p className="text-3xl font-bold font-mono text-emerald-400 mt-1.5">{sentIds.length}</p>
        </div>
        <div className="rounded-xl p-4" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Remaining</p>
          <p className="text-3xl font-bold font-mono text-primary mt-1.5">{remaining}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <button
            onClick={() => setChannel("whatsapp")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${channel === "whatsapp" ? "bg-emerald-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </button>
          <button
            onClick={() => setChannel("sms")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${channel === "sms" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Phone className="h-4 w-4" />
            SMS
          </button>
        </div>

        <button
          onClick={handleSendAll}
          disabled={remaining === 0}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ boxShadow: remaining > 0 ? "0 0 16px rgba(245,192,0,0.2)" : undefined }}
        >
          <Send className="h-4 w-4" />
          Send All Reminders ({remaining})
        </button>
      </div>

      {/* Template Preview */}
      <div className="rounded-xl p-4" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Message Template · {channel === "whatsapp" ? "WhatsApp" : "SMS"}
        </p>
        <div className={`rounded-lg p-3 text-sm leading-relaxed ${channel === "whatsapp" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300" : "bg-primary/10 border border-primary/20 text-primary"}`}>
          {channel === "whatsapp"
            ? "🔌 *El-Nour Generators* — Dear [Name], your monthly generator subscription of $[Amount] is due on [Date]. Please arrange payment to avoid service interruption. Thank you! ⚡"
            : "El-Nour: Dear [Name], your $[Amount] generator subscription is due [Date]. Pay via bank or cash to avoid disconnection. Call +961 71 000 000."}
        </div>
      </div>

      {/* List */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <h2 className="font-semibold text-foreground">Pending Reminders</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Subscribers with unpaid or overdue invoices</p>
        </div>

        {pending.map((s) => {
          const isSent = sentIds.includes(s.id);
          return (
            <div
              key={s.id}
              className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <Avatar name={s.name} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-foreground">{s.name}</p>
                  <StatusBadge status={s.status} />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {s.phone} · {s.area} · Due {s.dueDate}
                </p>
              </div>
              <span className="text-sm font-mono font-semibold text-foreground flex-shrink-0 mr-1">${s.amount}</span>
              <button
                onClick={() => handleSend(s.id)}
                disabled={isSent}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex-shrink-0 ${
                  isSent
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default"
                    : channel === "whatsapp"
                      ? "bg-emerald-500 text-white hover:bg-emerald-600"
                      : "bg-primary text-primary-foreground hover:opacity-90"
                }`}
              >
                {isSent
                  ? <><CheckCircle className="h-3 w-3" /> Sent</>
                  : <><Send className="h-3 w-3" /> {channel === "whatsapp" ? "WhatsApp" : "SMS"}</>}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Bottom Nav (Mobile) ───────────────────────────────────────────────────────

function BottomNav({ activePage, setActivePage }: { activePage: Page; setActivePage: (p: Page) => void }) {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40"
      style={{ backgroundColor: "var(--card)", borderTop: "1px solid var(--border)" }}
    >
      <div className="flex items-center">
        {NAV_ITEMS.map(({ id, icon: Icon, label }) => {
          const active = activePage === id;
          return (
            <button
              key={id}
              onClick={() => setActivePage(id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 transition-all ${active ? "text-primary" : "text-muted-foreground"}`}
            >
              <Icon
                className="h-5 w-5"
                style={active ? { filter: "drop-shadow(0 0 6px rgba(245,192,0,0.7))" } : undefined}
              />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [activePage,   setActivePage]   = useState<Page>("dashboard");
  const [sidebarOpen,  setSidebarOpen]  = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10">
            <Sidebar activePage={activePage} setActivePage={setActivePage} onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNavbar activePage={activePage} onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
          {activePage === "dashboard"     && <DashboardPage setActivePage={setActivePage} />}
          {activePage === "subscribers"   && <SubscribersPage />}
          {activePage === "invoice"       && <InvoicePage />}
          {activePage === "notifications" && <NotificationsPage />}
        </main>
      </div>

      <BottomNav activePage={activePage} setActivePage={setActivePage} />
    </div>
  );
}
