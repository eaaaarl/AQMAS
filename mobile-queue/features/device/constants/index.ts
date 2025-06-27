export const DeviceType = {
  KIOSK: 0,
  COUNTER: 1,
} as const;

export type DeviceTypeKeys = keyof typeof DeviceType;
export type DeviceTypeValues = (typeof DeviceType)[DeviceTypeKeys];
