import type { AreaRecord } from "../areas/types";
import type { CreateSubscriberPayload } from "./subscribersApi";
import type { CreateSubscriberFormInput, CreateSubscriberFormValues } from "./schema";
import type { SubscriberDetail } from "./types";

export function mapFormValuesToSubscriberPayload(
  values: CreateSubscriberFormValues,
  options?: { preserveClears?: boolean },
): CreateSubscriberPayload {
  const preserveClears = options?.preserveClears ?? false;
  const trimmedBuilding = values.building?.trim() ?? "";
  const trimmedFloor = values.floor?.trim() ?? "";
  const trimmedCableName = values.cableName?.trim() ?? "";

  return {
    name: values.name.trim(),
    phone: values.phone?.trim() || undefined,
    address: values.address?.trim() || undefined,
    building: preserveClears ? (trimmedBuilding ? trimmedBuilding : null) : trimmedBuilding || undefined,
    floor: preserveClears ? (trimmedFloor ? trimmedFloor : null) : trimmedFloor || undefined,
    cableName: preserveClears ? (trimmedCableName ? trimmedCableName : null) : trimmedCableName || undefined,
    ampereScheduleId: values.plan === "Ampere"
      ? preserveClears
        ? values.ampereScheduleId || null
        : values.ampereScheduleId || undefined
      : null,
    areaId: values.areaId || undefined,
    boxId: preserveClears ? (values.boxId || null) : values.boxId || undefined,
    customerType: values.customerType,
    plan: values.plan,
    planValue: values.planValue,
    subscriptionDate: values.subscriptionDate || undefined,
    customerRelation: values.customerRelation || undefined,
    pricingOverride: values.usePricingOverride
      ? {
          price: values.overridePrice,
          fixedCharge: values.overrideFixedCharge,
          tva: values.overrideTva,
        }
      : undefined,
  };
}

export function mapSubscriberDetailToFormInput(
  subscriber: SubscriberDetail,
  areas: AreaRecord[],
): CreateSubscriberFormInput {
  const matchedArea = areas.find((area) => area.name === subscriber.areaName);

  return {
    name: subscriber.name,
    phone: subscriber.phone ?? "",
    address: subscriber.address ?? "",
    building: subscriber.building ?? "",
    floor: subscriber.floor ?? "",
    cableName: subscriber.cableName ?? "",
    ampereScheduleId: subscriber.ampereScheduleId ?? "",
    areaId: matchedArea?.id ?? "",
    boxId: subscriber.boxId ?? "",
    customerType: subscriber.customerType,
    plan: subscriber.plan,
    planValue: subscriber.planValue,
    subscriptionDate: "",
    customerRelation: subscriber.customerRelation,
    ampereSchedulePricingEnabled: false,
    usePricingOverride: subscriber.hasPricingOverride,
    overridePrice: subscriber.pricingOverride?.price ?? Number.NaN,
    overrideFixedCharge: subscriber.pricingOverride?.fixedCharge ?? Number.NaN,
    overrideTva: subscriber.pricingOverride?.tva ?? Number.NaN,
  };
}
