import type { LucideIcon } from "lucide-react";
import type { TranslationKey } from "../i18n/messages";

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
  labelKey: TranslationKey;
  icon: LucideIcon;
  badge?: number;
}
