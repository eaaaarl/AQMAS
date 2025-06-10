export interface createQueuePayload {
  trans_id: string;
  trans_date: Date;
  type_id?: number;
  employee_id?: number;
  time_served?: Date;
  time_end?: Date;
  counter_no?: number;
  trans_status?: number;
  single_trans_only?: number;
}
