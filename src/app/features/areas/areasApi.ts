import { apiRequest } from "../../shared/api/client";
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
