import { z } from "zod";

export const ampereScheduleSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(200, "Name must be 200 characters or fewer."),
  hoursPerDay: z.coerce.number().int("Hours per day must be a whole number.").min(1, "Hours per day must be at least 1.").max(24, "Hours per day must be at most 24."),
  pricePerAmp: z.coerce.number().gt(0, "Price per amp must be greater than 0."),
});

export type AmpereScheduleFormInput = z.input<typeof ampereScheduleSchema>;
export type AmpereScheduleFormOutput = z.output<typeof ampereScheduleSchema>;

export const defaultAmpereScheduleFormValues: AmpereScheduleFormInput = {
  name: "",
  hoursPerDay: 14,
  pricePerAmp: 0,
};
