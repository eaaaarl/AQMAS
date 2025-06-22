export interface Ticket {
  number: string;
  customerName: string;
  service: string;
  customerType: string;
  finished: number;
  skipped: number;
  bestTime: string;
  worstTime: string;
  remaining: number;
}

export interface CounterState {
  currentTicket: Ticket;
  currentTime: Date;
} 