import React from 'react';
import { Text, View } from 'react-native';

export interface QueueSettingsSummarySectionProps {
  customerTypesCount: number;
  servicesCount: number;
  totalCustomerGroups: number;
  totalEmployeeRoleTasks: number;
}

const SectionHeader = ({ title }: { title: string }) => (
  <Text className="mb-4 text-sm font-medium uppercase tracking-wide text-gray-600">
    {title}
  </Text>
);

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View className="flex-row items-center justify-between px-1 py-3">
    <Text className="text-sm font-medium text-gray-600">{label}</Text>
    <Text style={{ color: '#1c3f83' }} className="text-sm font-semibold">
      {value}
    </Text>
  </View>
);

const Divider = () => <View className="mx-1 h-px bg-gray-100" />;

export const QueueSettingsSummarySection: React.FC<QueueSettingsSummarySectionProps> = ({
  customerTypesCount,
  servicesCount,
  totalCustomerGroups,
  totalEmployeeRoleTasks
}) => (
  <View className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
    <SectionHeader title="Queue Settings Summary" />
    <View className="space-y-1">
      <InfoRow
        label="Enabled Customer Types"
        value={`${customerTypesCount} of ${totalCustomerGroups}`}
      />
      <Divider />
      <InfoRow
        label="Enabled Services"
        value={`${servicesCount} of ${totalEmployeeRoleTasks}`}
      />
    </View>
  </View>
); 