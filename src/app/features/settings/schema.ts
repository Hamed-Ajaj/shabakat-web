import { z } from "zod/v4";

export const dueDateSchema = z.coerce.number().int().min(1, "Due date must be at least 1.").max(31, "Due date must be at most 31.");
export const triggerDateSchema = z.coerce.number().int().min(1, "Trigger date must be at least 1.").max(28, "Trigger date must be at most 28.");
export const triggerMessageSchema = z.string().trim().max(1000, "Trigger message must be 1000 characters or fewer.");
export const languageSchema = z.enum(["en", "ar"], {
  message: "Language must be English or Arabic.",
});
export const pricingValueSchema = z.coerce.number().min(0, "Value cannot be negative.");
export const tvaValueSchema = z.coerce.number().min(0, "TVA cannot be negative.").max(100, "TVA must be 100 or less.");
