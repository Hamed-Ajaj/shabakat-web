export type SubscriberBillingStatus = "paid" | "unpaid" | "overdue";

export interface SubscriberRow {
  id: string;
  name: string;
  phone: string;
  area: string;
  planLabel: string;
  subscriptionDate: string;
  status: SubscriberBillingStatus;
  amountDue: number;
  customerType: string;
  customerStatus: string;
}

export interface SubscriberDetail {
  id: string;
  name: string;
  phone: string;
  address: string;
  areaName: string;
  customerType: "Residential" | "Commercial" | "Industrial";
  plan: "Ampere" | "Kilowatt";
  planValue: number;
  customerStatus: string;
  subscriptionDate: string;
  createdAt: string;
  customerRelation: "Friend" | "Family" | "Owner" | "Other" | "";
  hasPricingOverride: boolean;
  pricingOverride: {
    price: number;
    fixedCharge: number;
    tva: number;
  } | null;
  totalBilled: number;
  totalPaid: number;
  totalOutstanding: number;
  paidThisMonth: boolean;
}
