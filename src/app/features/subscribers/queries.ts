import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAuth } from "../../providers/AuthProvider";
import {
  fetchAreas,
  fetchCustomerRelations,
  fetchCustomerTypes,
  fetchPlanTypes,
  fetchSubscriberDetail,
  fetchSubscribers,
} from "./subscribersApi";
import type { SubscribersQueryFilters } from "./types";

export const subscriberQueryKeys = {
  all: ["subscribers"] as const,
  company: (companyId?: string, filters?: SubscribersQueryFilters) =>
    ["subscribers", companyId, filters] as const,
  detail: (id?: string) => ["subscriber-detail", id] as const,
  areas: (companyId?: string) => ["subscriber-areas", companyId] as const,
  customerTypes: ["subscriber-customer-types"] as const,
  planTypes: ["subscriber-plan-types"] as const,
  customerRelations: ["subscriber-customer-relations"] as const,
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

export function useSubscriberAreasQuery() {
  const { session } = useAuth();

  return useQuery({
    queryKey: subscriberQueryKeys.areas(session?.companyId),
    queryFn: () => fetchAreas(session?.token ?? ""),
    enabled: Boolean(session?.token),
    staleTime: 1000 * 60 * 30,
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
