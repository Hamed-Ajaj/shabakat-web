import { z } from "zod/v4";

const customerRelationSchema = z.enum(["Friend", "Family", "Owner", "Other"]);

export const createSubscriberSchema = z
  .object({
    name: z.string().trim().min(2, "Name is required.").max(200, "Name must be 200 characters or fewer."),
    phone: z.string().trim().max(30, "Phone must be 30 characters or fewer.").optional().or(z.literal("")),
    address: z.string().trim().max(500, "Address must be 500 characters or fewer.").optional().or(z.literal("")),
    cableName: z.string().trim().max(100, "Cable name must be 100 characters or fewer.").optional().or(z.literal("")),
    areaId: z.string().optional().or(z.literal("")),
    boxId: z.string().optional().or(z.literal("")),
    customerType: z.enum(["Residential", "Commercial", "Industrial"], {
      message: "Customer type is required.",
    }),
    plan: z.enum(["Ampere", "Kilowatt", "FixedKilowatt"], {
      message: "Plan type is required.",
    }),
    planValue: z.coerce.number().min(0.01, "Plan value must be greater than 0.").max(9999999, "Plan value is too large."),
    subscriptionDate: z.string().optional().or(z.literal("")),
    customerRelation: customerRelationSchema.optional().or(z.literal("")),
    usePricingOverride: z.boolean().default(false),
    overridePrice: z.union([z.coerce.number(), z.nan()]).optional(),
    overrideFixedCharge: z.union([z.coerce.number(), z.nan()]).optional(),
    overrideTva: z.union([z.coerce.number(), z.nan()]).optional(),
  })
  .superRefine((values, context) => {
    if (!values.usePricingOverride) {
      return;
    }

    if (!Number.isFinite(values.overridePrice)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Override price is required.",
        path: ["overridePrice"],
      });
    } else if (values.overridePrice <= 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Override price must be greater than 0.",
        path: ["overridePrice"],
      });
    }

    if (!Number.isFinite(values.overrideFixedCharge)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Override fixed charge is required.",
        path: ["overrideFixedCharge"],
      });
    } else if (values.overrideFixedCharge <= 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Override fixed charge must be greater than 0.",
        path: ["overrideFixedCharge"],
      });
    }

    if (!Number.isFinite(values.overrideTva)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Override TVA is required.",
        path: ["overrideTva"],
      });
    } else if (values.overrideTva <= 0 || values.overrideTva > 100) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Override TVA must be between 1 and 100.",
        path: ["overrideTva"],
      });
    }
  });

export type CreateSubscriberFormInput = z.input<typeof createSubscriberSchema>;
export type CreateSubscriberFormValues = z.output<typeof createSubscriberSchema>;

export const defaultSubscriberFormValues: CreateSubscriberFormInput = {
  name: "",
  phone: "",
  address: "",
  cableName: "",
  areaId: "",
  boxId: "",
  customerType: "Residential",
  plan: "Ampere",
  planValue: 5,
  subscriptionDate: "",
  customerRelation: "",
  usePricingOverride: false,
  overridePrice: Number.NaN,
  overrideFixedCharge: Number.NaN,
  overrideTva: Number.NaN,
};
