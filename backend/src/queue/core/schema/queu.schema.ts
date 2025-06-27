import { z } from 'zod';

export const queueSchema = z.object({
  transId: z.string(),
  //trans_date: z.date().optional(),
  typeId: z.number().optional(),
  transStatus: z.number().default(0),
  singleTransOnly: z.number().optional(),
  customerName: z.string().optional(),
});

export const queueDetailsSchema = z.object({
  trans_id: z.string(),
  trans_date: z.string().optional(),
  service_id: z.number(),
});

export const queueCountQuerySchema = z.object({
  Date: z.string().optional(),
  type_id: z.string().optional(),
});

export const queueByServiceCountSchema = z.object({
  service_id: z.string().optional(),
});

export type queueByServiceCountDTO = z.infer<typeof queueByServiceCountSchema>;
export type queueCountQueryDTO = z.infer<typeof queueCountQuerySchema>;
export type queueDetailsDTO = z.infer<typeof queueDetailsSchema>;
export type queueDTO = z.infer<typeof queueSchema>;
