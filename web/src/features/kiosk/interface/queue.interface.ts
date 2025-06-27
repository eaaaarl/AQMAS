export interface CallQueuePayload {
  queue: {
    transId: string;
    typeId: number;
    transStatus: number;
    singleTransOnly: number;
    customerName?: string;
  };
  details: {
    trans_id: string;
    service_id: number;
  }[];
}

export interface CallQueueApi {
  success: boolean;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  meta: {
    timestamp: string;
    path?: string;
    duration?: number;
  };
}

export interface ByServiceCountApi {
  success: boolean;
  message: string;
  data: {
    count: number;
  };
  meta: {
    timestamp: string;
  };
}

export interface AllServiceCountApi {
  success: boolean;
  message: string;
  data: {
    count: number;
  };
  meta: {
    timestamp: string;
  };
}

export interface QueueCountApi {
  success: boolean;
  message: string;
  data: {
    count: number;
  };
  meta: {
    timestamp: string;
  };
}
