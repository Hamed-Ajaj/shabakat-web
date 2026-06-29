export type SubscriberBillingStatus = "paid" | "unpaid" | "overdue";

export type SubscriberSearchField = "name" | "phone";
export type SubscriberPlan = "Ampere" | "Kilowatt" | "FixedKilowatt";

export interface SubscriberRow {
  id: string;
  name: string;
  phone: string | null;
  area: string | null;
  plan: SubscriberPlan;
  planValue: number;
  subscriptionDate: string;
  status: SubscriberBillingStatus;
  amountDue: number;
  customerType: string;
  customerStatus: string;
}

export interface SubscriberDetail {
  id: string;
  name: string;
  phone: string | null;
  address: string | null;
  areaName: string | null;
  customerType: "Residential" | "Commercial" | "Industrial";
  plan: SubscriberPlan;
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

export interface MeterReadingRecord {
  id: string;
  readingValue: number;
  consumption: number | null;
  createdAt: string;
}

export interface SubscribersQueryFilters {
  areaId: string;
  pageIndex: number;
  pageSize: number;
  searchField: SubscriberSearchField;
  searchTerm: string;
}

export interface SubscribersPageData {
  data: SubscriberRow[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  pageCount: number;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
}
