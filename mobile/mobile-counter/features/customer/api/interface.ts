export interface CustomerGroup {
  type_id: number;
  type_name: string;
  priority_level: number;
  priority_pin: string;
  is_show: BufferLike;
  suffix: string;
  own_sequence: BufferLike;
  default: BufferLike;
}

export interface BufferLike {
  type: 'Buffer';
  data: [0 | 1];
}
