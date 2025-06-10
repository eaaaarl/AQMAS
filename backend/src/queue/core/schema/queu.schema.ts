import { z } from 'zod';

export const queueSchema = z.object({
  trans_id: z.string().min(1, 'Transaction id is required'),
  trans_date: z.string(),
  type_id: z.number().optional(),
  employee_id: z.number().optional(),
  time_served: z.date().optional(),
  time_end: z.date().optional(),
  counter_no: z.number().optional(),
  trans_status: z.number().default(0),
  single_trans_only: z.number().optional(),
});

export type queueDTO = z.infer<typeof queueSchema>;
