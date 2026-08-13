import { apiBaseUrl, apiRequest, toApiErrorResponse } from "../../shared/api/client";
import { getCustomerExportColumns } from "../../shared/export/customerExportColumns";
import type { AreaRecord } from "./types";

interface AreaResponse {
  id: string;
  name: string;
  customerCount: number;
  createdAt: string;
}

export interface AreaPayload {
  name: string;
}

export async function fetchAreas(token: string): Promise<AreaRecord[]> {
  const response = await apiRequest<AreaResponse[]>(
    "/api/v1/areas",
    undefined,
    token,
  );

  return response.map((area) => ({
    id: area.id,
    name: area.name,
    customerCount: area.customerCount,
    createdAt: area.createdAt,
  }));
}

export function createArea(payload: AreaPayload, token: string) {
  return apiRequest<AreaResponse>(
    "/api/v1/areas",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
    token,
  );
}

export function updateArea(id: string, payload: AreaPayload, token: string) {
  return apiRequest<AreaResponse>(
    `/api/v1/areas/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
    token,
  );
}

export function deleteArea(id: string, token: string) {
  return apiRequest(
    `/api/v1/areas/${id}`,
    {
      method: "DELETE",
    },
    token,
  );
}

export async function exportCustomers(token: string, areaId?: string, companyId?: string) {
  const params = new URLSearchParams();
  if (areaId) params.append("areaIds", areaId);
  getCustomerExportColumns(companyId).forEach((column) => params.append("columns", column));
  const query = params.size ? `?${params.toString()}` : "";
  const response = await fetch(`${apiBaseUrl}/api/v1/areas/export${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw await toApiErrorResponse(response);
  }

  const fileName = response.headers.get("content-disposition")?.match(/filename="?([^";]+)"?/)?.[1]
    ?? "customers.xlsx";
  const url = URL.createObjectURL(await response.blob());
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
