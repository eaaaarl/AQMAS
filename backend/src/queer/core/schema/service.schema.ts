import { z } from "zod";

const serviceSchema = z.object({
  service_id: z.number(),
  service_name: z.string().min(1, "Service name is required"),
  button_caption: z.string().optional(),
  priority_level: z.number().int().optional(),
  service_format: z.string().optional(),
  is_active: z
    .union([z.boolean(), z.number().int().min(0).max(1), z.null()])
    .optional()
    .transform((val) => (val === null ? undefined : Boolean(val))),
  header_id: z
    .union([z.number().int().gte(-32768).lte(32767), z.null()])
    .optional(),
});

export type ServiceSchema = z.infer<typeof serviceSchema>;
