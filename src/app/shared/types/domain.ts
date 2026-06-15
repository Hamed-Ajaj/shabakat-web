import type { LucideIcon } from "lucide-react";

export type Status = "paid" | "unpaid" | "overdue";

export interface Subscriber {
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

export interface RevenuePoint {
  month: string;
  billed: number;
  collected: number;
}

export interface NavigationItem {
  to: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}
