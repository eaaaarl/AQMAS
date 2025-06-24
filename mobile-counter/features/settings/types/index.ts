export interface SettingRowProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export interface InfoRowProps {
  label: string;
  value: string | number | undefined;
}

export interface SettingsState {
  customerTypes: number[];
  services: number[];
}

export interface DeveloperSettings {
  ipAddress: string;
  port: string;
}
