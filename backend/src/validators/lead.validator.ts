import { z } from "zod";
import { LEAD_STATUSES } from "../constants/statuses.js";

const statusSchema = z.preprocess((val) => {
  if (typeof val !== "string") return val;
  const v = val.trim().toLowerCase();
  return v === "" ? undefined : v;
}, z.enum(LEAD_STATUSES).optional());

export const createLeadSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Valid email is required"),
  phone: z.string().trim().min(1, "Phone is required"),
  status: statusSchema,
});

export const updateLeadSchema = createLeadSchema
  .partial()
  .refine(
    (data) => Object.values(data).some((v) => v !== undefined),
    "At least one field is required"
  );
