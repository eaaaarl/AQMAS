export interface CustomerApi {
  success: boolean;
  message: string;
  data: {
    type_id: number;
    type_name: string;
    priority_level: number;
    priority_pin: number;
    is_show: {
      type: string;
      data: number[];
    };
    suffix: string;
    own_sequence: {
      type: string;
      data: number[];
    };
    default: {
      type: string;
      data: number[];
    };
  }[];
  meta: {
    timestamp: string;
  };
}
