import React from 'react';
import { Switch, Text, View } from 'react-native';

export interface ServiceSettingsSectionProps {
  employeeRoleTasks: any[];
  enabledServices: number[];
  onServiceChange: (serviceId: number, value: boolean) => void;
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

export const ServiceSettingsSection: React.FC<ServiceSettingsSectionProps> = ({ employeeRoleTasks, enabledServices, onServiceChange }) => (
  <View className="mb-8 rounded-2xl bg-white p-5 shadow-sm">
    <SectionHeader title="Queue only by selected service" />
    <Text className="mb-4 text-sm text-gray-600">
      All services are enabled by default. Disable the services you
      don&apos;t want to see in your queue.
    </Text>
    <View className="space-y-1">
      {employeeRoleTasks.map(task => (
        <SettingRow
          key={task.service_id}
          label={task.service_name}
          value={enabledServices.includes(task.service_id)}
          onValueChange={value => onServiceChange(task.service_id, value)}
        />
      ))}
      <Divider />
    </View>
  </View>
); 