import { z } from 'zod';

export const queueSchema = z.object({
  trans_id: z.string(),
  trans_date: z.date().optional(),
  type_id: z.number().optional(),
  employee_id: z.number().optional(),
  time_served: z.date().optional(),
  time_end: z.date().optional(),
  counter_no: z.number().optional(),
  trans_status: z.number().default(0),
  single_trans_only: z.number().optional(),
  customer_name: z.string().optional(),
});

export const queueDetailsSchema = z.object({
  trans_id: z.string().min(1, 'trans_id is required'),
  trans_date: z.string().optional(),
  service_id: z.number().min(1, 'service_id is required'),
});

export const queueCountQuerySchema = z.object({
  Date: z.string().optional(),
  type_id: z.number().optional(),
});

export const queueByServiceCountSchema = z.object({
  service_id: z.string().optional(),
});

export type queueByServiceCountDTO = z.infer<typeof queueByServiceCountSchema>;
export type queueCountQueryDTO = z.infer<typeof queueCountQuerySchema>;
export type queueDetailsDTO = z.infer<typeof queueDetailsSchema>;
export type queueDTO = z.infer<typeof queueSchema>;
