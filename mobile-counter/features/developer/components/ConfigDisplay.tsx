import { ApiConfig } from '@/libs/redux/state/configSlice';
import React from 'react';
import { Text, View } from 'react-native';

interface ConfigDisplayProps {
  currentConfig: ApiConfig;
  className?: string;
}

export default function ConfigDisplay({
  currentConfig,
  className = '',
}: ConfigDisplayProps) {
  const hasConfig = currentConfig?.ipAddress && currentConfig?.port;

  if (!hasConfig) {
    return (
      <View
        className={`rounded-xl border border-amber-200 bg-amber-50 p-5 ${className}`}
      >
        <View className="mb-2 flex-row items-center">
          <View className="mr-3 h-2 w-2 rounded-full bg-amber-400" />
          <Text className="text-sm font-medium text-amber-800">
            No Configuration Set
          </Text>
        </View>
        <Text className="ml-5 text-xs text-amber-700">
          Please configure the API settings below to connect to your server
        </Text>
      </View>
    );
  }

  return (
    <View
      className={`rounded-xl border border-emerald-200 bg-emerald-50 p-5 ${className}`}
    >
      <View className="mb-3 flex-row items-center">
        <View className="mr-3 h-2 w-2 rounded-full bg-emerald-500" />
        <Text className="text-sm font-medium text-emerald-800">
          Current Configuration
        </Text>
      </View>
      <View className="ml-5 space-y-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-xs font-medium text-emerald-700">
            IP Address
          </Text>
          <Text className="rounded bg-emerald-100 px-2 py-1 font-mono text-xs text-emerald-900">
            {currentConfig.ipAddress}
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-xs font-medium text-emerald-700">Port</Text>
          <Text className="rounded bg-emerald-100 px-2 py-1 font-mono text-xs text-emerald-900">
            {currentConfig.port}
          </Text>
        </View>
      </View>
    </View>
  );
}
