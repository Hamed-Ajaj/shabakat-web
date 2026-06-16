import { apiRequest } from "../../shared/api/client";
import type {
  SubscriberBillingStatus,
  SubscriberDetail,
  SubscribersPageData,
  SubscribersQueryFilters,
  SubscriberRow,
} from "./types";

interface CustomerSummaryResponse {
  id: string;
  name: string;
  phone: string | null;
  address: string | null;
  customerType: string;
  plan: string;
  areaName: string | null;
  planValue: number;
  customerStatus: string;
  subscriptionDate: string;
  createdAt: string;
  hasPricingOverride: boolean;
  customerRelation: string | null;
  amountDue: number;
}

interface PagedResponse<TData> {
  data: TData[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface AreaOption {
  id: string;
  name: string;
  customerCount: number;
  createdAt: string;
}

export interface LookupOption {
  value: number;
  label: string;
}

export interface CreateSubscriberPayload {
  name: string;
  phone?: string;
  address?: string;
  areaId?: string;
  customerType: "Residential" | "Commercial" | "Industrial";
  plan: "Ampere" | "Kilowatt";
  planValue: number;
  subscriptionDate?: string;
  customerRelation?: "Friend" | "Family" | "Owner" | "Other";
  pricingOverride?: {
    price: number;
    fixedCharge: number;
    tva: number;
  };
}

export type UpdateSubscriberPayload = CreateSubscriberPayload;

interface CustomerPricingOverrideResponse {
  price: number | null;
  fixedCharge: number | null;
  tva?: number | null;
  TVA?: number | null;
}

interface CustomerDetailResponse {
  id: string;
  name: string;
  phone: string | null;
  address: string | null;
  customerType: "Residential" | "Commercial" | "Industrial";
  plan: "Ampere" | "Kilowatt";
  planValue: number;
  areaName: string | null;
  customerStatus: string;
  subscriptionDate: string;
  createdAt: string;
  customerRelation: "Friend" | "Family" | "Owner" | "Other" | null;
  hasPricingOverride: boolean;
  pricingOverride: CustomerPricingOverrideResponse | null;
  totalBilled: number;
  totalPaid: number;
  totalOutstanding: number;
  paidThisMonth: boolean;
}

export async function fetchSubscribers(
  filters: SubscribersQueryFilters,
  token: string,
): Promise<SubscribersPageData> {
  const params = new URLSearchParams({
    pageNumber: String(filters.pageIndex + 1),
    pageSize: String(filters.pageSize),
  });

  const searchTerm = filters.searchTerm.trim();
  if (searchTerm) {
    params.set(filters.searchField, searchTerm);
  }

  if (filters.areaId) {
    params.set("areaId", filters.areaId);
  }

  const response = await apiRequest<PagedResponse<CustomerSummaryResponse>>(
    `/api/v1/customers?${params.toString()}`,
    undefined,
    token,
  );

  return {
    data: response.data.map(mapCustomerSummaryToSubscriberRow),
    hasNextPage: response.hasNextPage,
    hasPreviousPage: response.hasPreviousPage,
    pageCount: response.totalPages,
    pageNumber: response.pageNumber,
    pageSize: response.pageSize,
    totalCount: response.totalCount,
  };
}

export function fetchAreas(token: string) {
  return apiRequest<AreaOption[]>("/api/v1/areas", undefined, token);
}

export function fetchCustomerTypes(token: string) {
  return apiRequest<LookupOption[]>("/api/v1/lookups/customerTypes", undefined, token);
}

export function fetchPlanTypes(token: string) {
  return apiRequest<LookupOption[]>("/api/v1/lookups/planTypes", undefined, token);
}

export function fetchCustomerRelations(token: string) {
  return apiRequest<LookupOption[]>("/api/v1/lookups/customerRelations", undefined, token);
}

export function createSubscriber(payload: CreateSubscriberPayload, token: string) {
  return apiRequest(
    "/api/v1/customers",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: payload.name,
        phone: payload.phone,
        address: payload.address,
        areaId: payload.areaId,
        customerType: payload.customerType,
        plan: payload.plan,
        planValue: payload.planValue,
        subscriptionDate: payload.subscriptionDate,
        customerRelation: payload.customerRelation,
        pricingOverride: mapPricingOverride(payload.pricingOverride),
      }),
    },
    token,
  );
}

export async function fetchSubscriberDetail(id: string, token: string): Promise<SubscriberDetail> {
  const subscriber = await apiRequest<CustomerDetailResponse>(`/api/v1/customers/${id}`, undefined, token);

  return {
    id: subscriber.id,
    name: subscriber.name,
    phone: subscriber.phone || "Not set",
    address: subscriber.address || "Not set",
    areaName: subscriber.areaName || "Unassigned",
    customerType: subscriber.customerType,
    plan: subscriber.plan,
    planValue: subscriber.planValue,
    customerStatus: subscriber.customerStatus,
    subscriptionDate: formatDate(subscriber.subscriptionDate),
    createdAt: formatDateTime(subscriber.createdAt),
    customerRelation: subscriber.customerRelation || "",
    hasPricingOverride: subscriber.hasPricingOverride,
    pricingOverride: subscriber.pricingOverride
      ? {
          price: subscriber.pricingOverride.price ?? 0,
          fixedCharge: subscriber.pricingOverride.fixedCharge ?? 0,
          tva: subscriber.pricingOverride.tva ?? subscriber.pricingOverride.TVA ?? 0,
        }
      : null,
    totalBilled: subscriber.totalBilled,
    totalPaid: subscriber.totalPaid,
    totalOutstanding: subscriber.totalOutstanding,
    paidThisMonth: subscriber.paidThisMonth,
  };
}

export function updateSubscriber(id: string, payload: UpdateSubscriberPayload, token: string) {
  return apiRequest(
    `/api/v1/customers/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: payload.name,
        phone: payload.phone,
        address: payload.address,
        areaId: payload.areaId,
        customerType: payload.customerType,
        plan: payload.plan,
        planValue: payload.planValue,
        customerRelation: payload.customerRelation,
        pricingOverride: mapPricingOverride(payload.pricingOverride),
      }),
    },
    token,
  );
}

export function deleteSubscriber(id: string, token: string) {
  return apiRequest(
    `/api/v1/customers/${id}`,
    {
      method: "DELETE",
    },
    token,
  );
}

function formatDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function mapCustomerSummaryToSubscriberRow(customer: CustomerSummaryResponse): SubscriberRow {
  return {
    id: customer.id,
    name: customer.name,
    phone: customer.phone || "Not set",
    area: customer.areaName || "Unassigned",
    planLabel:
      customer.plan === "Ampere"
        ? `${formatNumber(customer.planValue)} A`
        : `${formatNumber(customer.planValue)} kW`,
    subscriptionDate: formatDate(customer.subscriptionDate),
    status: resolveBillingStatus(customer.customerStatus, customer.amountDue),
    amountDue: customer.amountDue,
    customerStatus: customer.customerStatus,
    customerType: customer.customerType,
  };
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function resolveBillingStatus(customerStatus: string, amountDue: number): SubscriberBillingStatus {
  if (amountDue <= 0) {
    return "paid";
  }

  if (customerStatus === "Suspended" || customerStatus === "Terminated") {
    return "overdue";
  }

  return "unpaid";
}

function mapPricingOverride(pricingOverride: CreateSubscriberPayload["pricingOverride"]) {
  return pricingOverride
    ? {
        price: pricingOverride.price,
        fixedCharge: pricingOverride.fixedCharge,
        tVA: pricingOverride.tva,
      }
    : undefined;
}
