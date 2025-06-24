export interface createQueuePayload {
  transId: string;
  typeId: number;
  customerName: string;
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

export interface Queue {
  trans_id: string;
  trans_date: string;
  type_id: number;
  trans_status?: number;
  single_trans_only?: {
    type: string;
    data: [];
  };
  customer_name: string;
}

export interface QueueQueryParams {
  customer_type?: number;
}

export interface QueueApiResponse {
  sucess: true;
  data: Queue;
}
