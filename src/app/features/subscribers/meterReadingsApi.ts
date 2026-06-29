import { apiRequest } from "../../shared/api/client";
import type { MeterReadingRecord } from "./types";

interface MeterReadingResponse {
  id: string;
  readingValue: number;
  consumption: number | null;
  createdAt: string;
}

export interface CreateMeterReadingPayload {
  readingDate?: string;
  readingValue: number;
}

export async function fetchMeterReadings(
  customerId: string,
  token: string,
): Promise<MeterReadingRecord[]> {
  const response = await apiRequest<MeterReadingResponse[]>(
    `/api/v1/customers/${customerId}/meter-readings`,
    undefined,
    token,
  );

  return response.map((reading) => ({
    id: reading.id,
    readingValue: reading.readingValue,
    consumption: reading.consumption,
    createdAt: reading.createdAt,
  }));
}

export function createMeterReading(
  customerId: string,
  payload: CreateMeterReadingPayload,
  token: string,
) {
  return apiRequest<MeterReadingResponse>(
    `/api/v1/customers/${customerId}/meter-readings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        readingValue: payload.readingValue,
        readingDate: payload.readingDate || undefined,
      }),
    },
    token,
  );
}

export function deleteMeterReading(
  customerId: string,
  readingId: string,
  token: string,
) {
  return apiRequest<void>(
    `/api/v1/customers/${customerId}/meter-readings/${readingId}`,
    {
      method: "DELETE",
    },
    token,
  );
}
