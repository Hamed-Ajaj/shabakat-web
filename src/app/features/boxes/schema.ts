import { z } from "zod";

export const boxSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(200, "Name must be 200 characters or fewer."),
  areaId: z.string().trim().min(1, "Area is required."),
  locationNote: z.string().trim().max(500, "Location note must be 500 characters or fewer.").optional().or(z.literal("")),
  notes: z.string().trim().max(1000, "Notes must be 1000 characters or fewer.").optional().or(z.literal("")),
});

export type BoxFormInput = z.input<typeof boxSchema>;
export type BoxFormOutput = z.output<typeof boxSchema>;

export const defaultBoxFormValues: BoxFormInput = {
  name: "",
  areaId: "",
  locationNote: "",
  notes: "",
};

