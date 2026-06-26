import { apiRequest } from "../../shared/api/client";

interface WhatsAppStatusResponse {
  state: string;
  instanceName: string;
}

interface WhatsAppQrResponse {
  qrCode: string;
  message: string;
}

interface WhatsAppDisconnectResponse {
  message: string;
}

export interface WhatsAppConnectionStatus {
  state: string;
  instanceName: string;
}

export interface WhatsAppQrPayload {
  qrCode: string;
  message: string;
}

export function fetchWhatsAppStatus(token: string) {
  return apiRequest<WhatsAppStatusResponse>(
    "/api/v1/whatsapp/status",
    {
      cache: "no-store",
    },
    token,
  );
}

export function connectWhatsApp(token: string) {
  return apiRequest<WhatsAppQrResponse>(
    "/api/v1/whatsapp/connect",
    {
      cache: "no-store",
      method: "POST",
    },
    token,
  );
}

export function disconnectWhatsApp(token: string) {
  return apiRequest<WhatsAppDisconnectResponse>(
    "/api/v1/whatsapp/disconnect",
    {
      method: "DELETE",
    },
    token,
  );
}
