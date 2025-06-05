export interface ServiceResponse {
  service_id: number;
  service_name: string;
  button_caption: string;
  priority_level: number;
  service_format: string;
  is_active: {
    type: string;
    data: number[];
  };
  header_id: number;
}
