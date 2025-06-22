export interface SettingsState {
  customerTypes: {
    seniorCitizen: boolean;
    vip: boolean;
    regularCustomer: boolean;
  };
  services: {
    cash: boolean;
    credit: boolean;
  };
}

export interface SettingRowProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export interface InfoRowProps {
  label: string;
  value: string;
} 