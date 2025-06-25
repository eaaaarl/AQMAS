export interface Service {
  button_caption: string;
}

export interface Ticket {
  ticketNo: string;
  customerName: string;
  services: Service[];
  customerType: string;
}

export interface CounterState {
  currentTicket: Ticket | null;
  currentTime: Date;
  hasActiveTicket: boolean;
  isCallingQueue: boolean;
  isRecallingQueue: boolean;
  isFinishingQueue: boolean;
  isSkippingQueue: boolean;
}

export interface CounterStats {
  finishedCount: number;
  skippedCount: number;
  remainingCount: number;
  bestTime: string;
  worstTime: string;
}

export interface CounterConfig {
  Value: string;
  // Add other config fields as needed
}

export interface QueueData {
  ticketNo: string;
  customerName: string;
  services: Service[];
  customerType: string;
  remaining?: number;
}
