import * as Application from 'expo-application';
import * as Device from 'expo-device';
import React from 'react';
import { Text, View } from 'react-native';

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

export const DeviceInformationSection: React.FC = () => {
  const deviceInfo = {
    androidId: Application.getAndroidId(),
    name: Application.applicationName,
    version: Application.nativeApplicationVersion,
    buildVersion: Application.nativeBuildVersion,
    packageName: Application.applicationId,
    deviceName: Device.osName
  };

  return (
    <View className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
      <SectionHeader title="Device Information" />
      <View className="space-y-1">
        <InfoRow
          label="Android ID"
          value={deviceInfo.androidId || 'N/A'}
        />
        <Divider />
        <InfoRow
          label="App Name"
          value={deviceInfo.name || 'N/A'}
        />
        <Divider />
        <InfoRow
          label="App Version"
          value={deviceInfo.version || 'N/A'}
        />
        <Divider />
        <InfoRow
          label="Build Version"
          value={deviceInfo.buildVersion || 'N/A'}
        />
        <Divider />
        <InfoRow
          label="Device Name"
          value={deviceInfo.deviceName || 'N/A'}
        />
      </View>
    </View>
  );
}; 