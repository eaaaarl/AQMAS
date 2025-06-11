import { z } from 'zod';

export const queueSchema = z.object({
  trans_id: z.string().min(1, 'Transaction id is required'),
  trans_date: z.date().optional(),
  type_id: z.string().optional(),
  employee_id: z.number().optional(),
  time_served: z.date().optional(),
  time_end: z.date().optional(),
  counter_no: z.number().optional(),
  trans_status: z.string().default('0'),
  single_trans_only: z.string().optional(),
  customer_name: z.string().optional(),
});

export type queueDTO = z.infer<typeof queueSchema>;
