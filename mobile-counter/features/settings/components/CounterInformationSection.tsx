import React from 'react';
import { Text, View } from 'react-native';

export interface CounterInformationSectionProps {
  empInformation: any;
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

export const CounterInformationSection: React.FC<CounterInformationSectionProps> = ({ empInformation }) => (
  <View className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
    <SectionHeader title="Counter Information" />
    <View className="space-y-1">
      <InfoRow
        label="Counter"
        value={empInformation?.[0]?.employee_no}
      />
      <Divider />
      <InfoRow
        label="Operator"
        value={`${empInformation?.[0]?.first_name} ${empInformation?.[0]?.mid_name} ${empInformation?.[0]?.last_name}`}
      />
      <Divider />
      <InfoRow
        label="Employee ID"
        value={`${empInformation?.[0]?.employee_id}`}
      />
    </View>
  </View>
); 