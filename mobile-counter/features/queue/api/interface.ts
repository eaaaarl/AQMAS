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
