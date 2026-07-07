import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAuth } from "../../providers/AuthProvider";
import {
  fetchCustomerRelations,
  fetchCustomerTypes,
  fetchDistributionBoxes,
  fetchPlanTypes,
  fetchSubscriberDetail,
  fetchSubscribers,
} from "./subscribersApi";
import { fetchMeterReadings } from "./meterReadingsApi";
import type { SubscribersQueryFilters } from "./types";

export const subscriberQueryKeys = {
  all: ["subscribers"] as const,
  company: (companyId?: string, filters?: SubscribersQueryFilters) =>
    ["subscribers", companyId, filters] as const,
  detail: (id?: string) => ["subscriber-detail", id] as const,
  customerTypes: ["subscriber-customer-types"] as const,
  planTypes: ["subscriber-plan-types"] as const,
  customerRelations: ["subscriber-customer-relations"] as const,
  distributionBoxes: (companyId?: string, areaId?: string) =>
    ["subscriber-distribution-boxes", companyId, areaId] as const,
  meterReadings: (id?: string) => ["subscriber-meter-readings", id] as const,
};

export function useSubscribersQuery(filters: SubscribersQueryFilters) {
  const { session } = useAuth();

  return useQuery({
    queryKey: subscriberQueryKeys.company(session?.companyId, filters),
    queryFn: () => fetchSubscribers(filters, session?.token ?? ""),
    enabled: Boolean(session?.token),
    placeholderData: keepPreviousData,
  });
}

export function useSubscriberDetailQuery(id?: string) {
  const { session } = useAuth();

  return useQuery({
    queryKey: subscriberQueryKeys.detail(id),
    queryFn: () => fetchSubscriberDetail(id ?? "", session?.token ?? ""),
    enabled: Boolean(session?.token && id),
  });
}

export function useSubscriberMeterReadingsQuery(id?: string, enabled = true) {
  const { session } = useAuth();

  return useQuery({
    queryKey: subscriberQueryKeys.meterReadings(id),
    queryFn: () => fetchMeterReadings(id ?? "", session?.token ?? ""),
    enabled: Boolean(session?.token && id && enabled),
  });
}

export function useSubscriberCustomerTypesQuery() {
  const { session } = useAuth();

  return useQuery({
    queryKey: subscriberQueryKeys.customerTypes,
    queryFn: () => fetchCustomerTypes(session?.token ?? ""),
    enabled: Boolean(session?.token),
    staleTime: Infinity,
  });
}

export function useSubscriberPlanTypesQuery() {
  const { session } = useAuth();

  return useQuery({
    queryKey: subscriberQueryKeys.planTypes,
    queryFn: () => fetchPlanTypes(session?.token ?? ""),
    enabled: Boolean(session?.token),
    staleTime: Infinity,
  });
}

export function useSubscriberCustomerRelationsQuery() {
  const { session } = useAuth();

  return useQuery({
    queryKey: subscriberQueryKeys.customerRelations,
    queryFn: () => fetchCustomerRelations(session?.token ?? ""),
    enabled: Boolean(session?.token),
    staleTime: Infinity,
  });
}

export function useSubscriberDistributionBoxesQuery(areaId?: string) {
  const { session } = useAuth();

  return useQuery({
    queryKey: subscriberQueryKeys.distributionBoxes(session?.companyId, areaId),
    queryFn: () => fetchDistributionBoxes(session?.token ?? "", areaId),
    enabled: Boolean(session?.token),
    staleTime: 60_000,
  });
}
