import { apiRequest } from "../../shared/api/client";
import type { AmpereScheduleRecord } from "./types";

interface AmpereScheduleResponse {
  id: string;
  name: string;
  hoursPerDay: number;
  pricePerAmp: number;
  customerCount: number;
  createdAt: string;
}

export interface AmpereSchedulePayload {
  name: string;
  hoursPerDay: number;
  pricePerAmp: number;
}

export async function fetchAmpereSchedules(token: string): Promise<AmpereScheduleRecord[]> {
  const response = await apiRequest<AmpereScheduleResponse[]>(
    "/api/v1/ampere-schedules",
    undefined,
    token,
  );

  return response.map((schedule) => ({
    id: schedule.id,
    name: schedule.name,
    hoursPerDay: schedule.hoursPerDay,
    pricePerAmp: schedule.pricePerAmp,
    customerCount: schedule.customerCount,
    createdAt: schedule.createdAt,
  }));
}

export function createAmpereSchedule(payload: AmpereSchedulePayload, token: string) {
  return apiRequest<AmpereScheduleResponse>(
    "/api/v1/ampere-schedules",
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

export function updateAmpereSchedule(id: string, payload: AmpereSchedulePayload, token: string) {
  return apiRequest<AmpereScheduleResponse>(
    `/api/v1/ampere-schedules/${id}`,
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

export function deleteAmpereSchedule(id: string, token: string) {
  return apiRequest(
    `/api/v1/ampere-schedules/${id}`,
    {
      method: "DELETE",
    },
    token,
  );
}
