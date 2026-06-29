import type { TranslationKey } from "../../shared/i18n/messages";
import type { SubscriberPlan } from "./types";

export function getSubscriberSearchFieldLabel(field: "name" | "phone"): TranslationKey {
  return field === "name" ? "subscribers.searchField.name" : "subscribers.searchField.phone";
}

export function getSubscriberPlanLabel(plan: SubscriberPlan): TranslationKey {
  if (plan === "Ampere") return "subscribers.plan.ampere";
  if (plan === "FixedKilowatt") return "subscribers.plan.fixedKilowatt";
  return "subscribers.plan.kilowatt";
}

export function getSubscriberCustomerTypeLabel(type: "Residential" | "Commercial" | "Industrial"): TranslationKey {
  if (type === "Commercial") return "subscribers.customerType.commercial";
  if (type === "Industrial") return "subscribers.customerType.industrial";
  return "subscribers.customerType.residential";
}

export function getSubscriberRelationLabel(relation: "Friend" | "Family" | "Owner" | "Other"): TranslationKey {
  if (relation === "Family") return "subscribers.relation.family";
  if (relation === "Owner") return "subscribers.relation.owner";
  if (relation === "Other") return "subscribers.relation.other";
  return "subscribers.relation.friend";
}
