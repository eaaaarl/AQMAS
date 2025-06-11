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
