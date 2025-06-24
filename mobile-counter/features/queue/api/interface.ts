export interface Ticket {
  ticketNo: string;
  customerType: string;
  customerName: string;
  remaining: number;
  services: ServiceButton[];
}

export interface ServiceButton {
  button_caption: string;
}

export interface QueueDetail {
  trans_status: number;
  trans_time: string;
  trans_sec: string | null | number | undefined;
}
