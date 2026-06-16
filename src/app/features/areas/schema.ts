import { z } from "zod/v4";

export const areaSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Area name is required.")
    .max(200, "Area name must be 200 characters or fewer."),
});

export type AreaFormInput = z.input<typeof areaSchema>;
export type AreaFormOutput = z.output<typeof areaSchema>;

export const defaultAreaFormValues: AreaFormInput = {
  name: "",
};
