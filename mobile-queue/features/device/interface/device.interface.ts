export interface DeviceInfo {
  id: string;
  os: number;
  type: number;
  deviceName: string;
}

export interface DeviceApi {
  ghError: number;
  ghMessage: string;
}
