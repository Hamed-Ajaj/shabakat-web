import { z } from "zod/v4";

export const createMeterReadingSchema = z.object({
  readingValue: z.coerce
    .number()
    .min(0, "Reading value must be 0 or greater.")
    .max(999999999, "Reading value is too large."),
  readingDate: z.string().optional().or(z.literal("")),
});

export type CreateMeterReadingFormInput = z.input<
  typeof createMeterReadingSchema
>;
export type CreateMeterReadingFormValues = z.output<
  typeof createMeterReadingSchema
>;
