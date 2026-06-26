import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../providers/AuthProvider";
import { fetchWhatsAppStatus } from "./whatsappApi";

export const whatsappQueryKeys = {
  all: ["whatsapp"] as const,
  status: (companyId?: string) => ["whatsapp", "status", companyId] as const,
};

interface UseWhatsAppStatusQueryOptions {
  enabled?: boolean;
  refetchInterval?: number | false;
}

export function useWhatsAppStatusQuery(options?: UseWhatsAppStatusQueryOptions) {
  const { session } = useAuth();

  return useQuery({
    queryKey: whatsappQueryKeys.status(session?.companyId),
    queryFn: () => fetchWhatsAppStatus(session?.token ?? ""),
    enabled: Boolean(session?.token) && (options?.enabled ?? true),
    refetchInterval: options?.refetchInterval ?? false,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
}
