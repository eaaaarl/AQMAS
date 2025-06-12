export interface createQueuePayload {
  transId: string;
  typeId: number;
  customerName: string;
  counter_no?: number;
  transStatus?: number;
  singleTransOnly?: number;
}

export interface createQueueDetailsPayload {
  trans_id: string;
  service_id: number;
}

export interface createQueuePayload2 {
  trans_id: string;
  type_id: number;
  customer_name: string;
  trans_status?: number;
  single_trans_only?: number;
}
