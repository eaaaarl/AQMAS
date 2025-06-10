export interface CustomerTypeResponse {
  type_id: number;
  type_name: string;
  priority_level: number;
  priority_pin: string;
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
}

export interface CustomerTypeParams {
  is_show: string;
}
