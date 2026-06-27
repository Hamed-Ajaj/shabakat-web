import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../providers/AuthProvider";
import { connectWhatsApp, disconnectWhatsApp } from "./whatsappApi";
import { settingsQueryKeys } from "./queries";
import { whatsappQueryKeys } from "./whatsappQueries";

export function useConnectWhatsAppMutation() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!session?.token) {
        throw new Error("You must be logged in to connect WhatsApp.");
      }

      return connectWhatsApp(session.token);
    },
    onSuccess: async () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: whatsappQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: settingsQueryKeys.preferences(session?.companyId) }),
      ]),
  });
}

export function useDisconnectWhatsAppMutation() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!session?.token) {
        throw new Error("You must be logged in to disconnect WhatsApp.");
      }

      return disconnectWhatsApp(session.token);
    },
    onSuccess: async () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: whatsappQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: settingsQueryKeys.preferences(session?.companyId) }),
      ]),
  });
}
