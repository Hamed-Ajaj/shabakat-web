import { apiRequest } from "../../shared/api/client";
import type {
  CustomerStatus,
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
  building: string | null;
  floor: string | null;
  cableName: string | null;
  ampereScheduleId: string | null;
  ampereScheduleName: string | null;
  boxId: string | null;
  boxName: string | null;
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

export interface LookupOption {
  value: number | string;
  label: string;
}

export interface CreateSubscriberPayload {
  name: string;
  phone?: string;
  address?: string;
  building?: string;
  floor?: string;
  cableName?: string | null;
  ampereScheduleId?: string | null;
  areaId?: string;
  boxId?: string | null;
  customerType: "Residential" | "Commercial" | "Industrial";
  plan: "Ampere" | "Kilowatt" | "FixedKilowatt";
  planValue: number;
  subscriptionDate?: string;
  customerRelation?: "Friend" | "Family" | "Owner" | "Other";
  initialMeterReading?: number;
  pricingOverride?: {
    price: number;
    fixedCharge: number;
    tva: number;
  };
}

export interface UpdateSubscriberPayload extends CreateSubscriberPayload {
  clearPricingOverride: boolean;
  customerStatus: CustomerStatus;
}

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
  building: string | null;
  floor: string | null;
  cableName: string | null;
  ampereScheduleId: string | null;
  ampereScheduleName: string | null;
  boxId: string | null;
  boxName: string | null;
  customerType: "Residential" | "Commercial" | "Industrial";
  plan: "Ampere" | "Kilowatt" | "FixedKilowatt";
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
  initialMeterReading: number | null;
}

interface DistributionBoxResponse {
  id: string;
  name: string;
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

  if (filters.boxId) {
    params.set("boxId", filters.boxId);
  }

  if (filters.ampereScheduleId) {
    params.set("ampereScheduleId", filters.ampereScheduleId);
  }

  if (filters.planType) {
    params.set("planType", filters.planType);
  }

  if (filters.customerRelation) {
    params.set("customerRelation", filters.customerRelation);
  }

  if (filters.customerStatus) {
    params.set("customerStatus", filters.customerStatus);
  }

  const response = await apiRequest<PagedResponse<CustomerSummaryResponse>>(
    `/api/v1/customers?${params.toString()}`,
    undefined,
    token,
  );

  const customers = filters.boxId
    ? response.data.filter((customer) => customer.boxId === filters.boxId)
    : response.data;

  return {
    data: customers.map(mapCustomerSummaryToSubscriberRow),
    hasNextPage: response.hasNextPage,
    hasPreviousPage: response.hasPreviousPage,
    pageCount: response.totalPages,
    pageNumber: response.pageNumber,
    pageSize: response.pageSize,
    totalCount: response.totalCount,
  };
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

export async function fetchDistributionBoxes(token: string, areaId?: string) {
  const params = new URLSearchParams({
    pageNumber: "1",
    pageSize: "1000",
  });

  if (areaId) {
    params.set("areaId", areaId);
  }

  const response = await apiRequest<PagedResponse<DistributionBoxResponse>>(
    `/api/v1/distribution-boxes?${params.toString()}`,
    undefined,
    token,
  );

  return response.data.map((box) => ({
    value: box.id,
    label: box.name,
  }));
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
        building: payload.building,
        floor: payload.floor,
        cableName: payload.cableName,
        ampereScheduleId: payload.ampereScheduleId,
        areaId: payload.areaId,
        boxId: payload.boxId,
        customerType: payload.customerType,
        plan: payload.plan,
        planValue: payload.planValue,
        subscriptionDate: payload.subscriptionDate,
        customerRelation: payload.customerRelation,
        initialMeterReading: payload.initialMeterReading,
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
    phone: subscriber.phone,
    address: subscriber.address,
    building: subscriber.building,
    floor: subscriber.floor,
    cableName: subscriber.cableName,
    ampereScheduleId: subscriber.ampereScheduleId,
    ampereScheduleName: subscriber.ampereScheduleName,
    boxId: subscriber.boxId,
    boxName: subscriber.boxName,
    areaName: subscriber.areaName,
    customerType: subscriber.customerType,
    plan: subscriber.plan,
    planValue: subscriber.planValue,
    customerStatus: subscriber.customerStatus as CustomerStatus,
    subscriptionDate: subscriber.subscriptionDate,
    createdAt: subscriber.createdAt,
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
    initialMeterReading: subscriber.initialMeterReading,
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
        building: payload.building,
        floor: payload.floor,
        cableName: payload.cableName,
        ampereScheduleId: payload.ampereScheduleId,
        areaId: payload.areaId,
        boxId: payload.boxId,
        customerType: payload.customerType,
        plan: payload.plan,
        planValue: payload.planValue,
        customerStatus: payload.customerStatus,
        customerRelation: payload.customerRelation,
        initialMeterReading: payload.initialMeterReading,
        clearPricingOverride: payload.clearPricingOverride,
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

export function suspendSubscriber(id: string, token: string) {
  return apiRequest(
    "/api/v1/customers/suspend",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ customerIds: [id] }),
    },
    token,
  );
}

function mapCustomerSummaryToSubscriberRow(customer: CustomerSummaryResponse): SubscriberRow {
  return {
    id: customer.id,
    name: customer.name,
    phone: customer.phone || "Not set",
    area: customer.areaName || "Unassigned",
    plan: customer.plan as SubscriberRow["plan"],
    planValue: customer.planValue,
    subscriptionDate: customer.subscriptionDate,
    status: customer.customerStatus as CustomerStatus,
    amountDue: customer.amountDue,
    customerStatus: customer.customerStatus as CustomerStatus,
    customerType: customer.customerType,
  };
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
