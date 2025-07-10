import React from 'react';
import { Switch, Text, View } from 'react-native';

export interface CustomerTypeSettingsSectionProps {
  customerGroups: any[];
  enabledCustomerTypes: number[];
  onCustomerTypeChange: (typeId: number, value: boolean) => void;
}

const SectionHeader = ({ title }: { title: string }) => (
  <Text className="mb-4 text-sm font-medium uppercase tracking-wide text-gray-600">
    {title}
  </Text>
);

const SettingRow = ({ label, value, onValueChange }: { label: string; value: boolean; onValueChange: (value: boolean) => void }) => (
  <View className="flex-row items-center justify-between px-1 py-4">
    <Text style={{ color: '#1c3f83' }} className="flex-1 text-base font-medium">
      {label}
    </Text>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: '#e5e7eb', true: '#1c3f83' }}
      thumbColor={value ? '#ffffff' : '#f9fafb'}
      ios_backgroundColor="#e5e7eb"
    />
  </View>
);

const Divider = () => <View className="mx-1 h-px bg-gray-100" />;

export const CustomerTypeSettingsSection: React.FC<CustomerTypeSettingsSectionProps> = ({ customerGroups, enabledCustomerTypes, onCustomerTypeChange }) => (
  <View className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
    <SectionHeader title="Queue only by selected customer type" />
    <Text className="mb-4 text-sm text-gray-600">
      All customer types are enabled by default. Disable the types you
      don&apos;t want to see in your queue.
    </Text>
    <View className="space-y-1">
      {customerGroups.map(group => (
        <SettingRow
          key={group.type_id}
          label={group.type_name}
          value={enabledCustomerTypes.includes(group.type_id)}
          onValueChange={value => onCustomerTypeChange(group.type_id, value)}
        />
      ))}
      <Divider />
    </View>
  </View>
); 