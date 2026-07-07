import { apiRequest } from "../../shared/api/client";
import type { BoxRecord } from "./types";

interface DistributionBoxResponse {
  id: string;
  name: string;
  areaId: string;
  areaName: string;
  locationNote: string | null;
  notes: string | null;
  customerCount: number;
  createdAt: string;
}

interface PagedResponse<TData> {
  data: TData[];
  hasNextPage: boolean;
  pageNumber: number;
}

export interface BoxPayload {
  name: string;
  areaId: string;
  locationNote?: string;
  notes?: string;
}

export async function fetchBoxes(token: string, areaId?: string): Promise<BoxRecord[]> {
  const results: BoxRecord[] = [];
  let pageNumber = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const params = new URLSearchParams({
      pageNumber: String(pageNumber),
      pageSize: "200",
    });

    if (areaId) {
      params.set("areaId", areaId);
    }

    const response = await apiRequest<PagedResponse<DistributionBoxResponse>>(
      `/api/v1/distribution-boxes?${params.toString()}`,
      undefined,
      token,
    );

    results.push(
      ...response.data.map((box) => ({
        id: box.id,
        name: box.name,
        areaId: box.areaId,
        areaName: box.areaName,
        locationNote: box.locationNote,
        notes: box.notes,
        customerCount: box.customerCount,
        createdAt: box.createdAt,
      })),
    );

    hasNextPage = response.hasNextPage;
    pageNumber = response.pageNumber + 1;
  }

  return results;
}

export function createBox(payload: BoxPayload, token: string) {
  return apiRequest<DistributionBoxResponse>(
    "/api/v1/distribution-boxes",
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

export function updateBox(id: string, payload: BoxPayload, token: string) {
  return apiRequest<DistributionBoxResponse>(
    `/api/v1/distribution-boxes/${id}`,
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
