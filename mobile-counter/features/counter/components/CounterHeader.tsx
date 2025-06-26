import { OfflineIndicator } from '@/features/error';
import React, { memo } from 'react';
import { Text, View } from 'react-native';

interface CounterConfig {
  Value: string;
}

interface CounterHeaderProps {
  config: CounterConfig[];
  counterNo: string | number;
  roleName: string;
  currentTime: React.ReactNode;
  currentDate: React.ReactNode;
  hasQueuedData: boolean;
  hasConnectionError: boolean;
}

export const CounterHeader = memo<CounterHeaderProps>(({
  config,
  counterNo,
  roleName,
  currentTime,
  currentDate,
  hasQueuedData,
  hasConnectionError,
}) => {
  return (
    <>
      <OfflineIndicator isOffline={hasConnectionError} />
      <View style={{
        backgroundColor: '#1c3f83',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
        className="px-6 py-5">
        {/* Header Section */}
        <View className="mb-4 flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-white tracking-wide">
              {config?.[0]?.Value} {counterNo}
            </Text>
            <View className="mt-1 h-0.5 w-12 bg-white/30 rounded-full" />
          </View>

          {hasQueuedData && (
            <View className="ml-4 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-3 py-1.5 shadow-sm">
              <Text className="text-xs font-semibold text-white tracking-wide">
                Queued Available
              </Text>
            </View>
          )}
        </View>

        {/* Info Section */}
        <View className="space-y-1">
          <View className="flex-row items-center">
            <View className="mr-2 h-1.5 w-1.5 bg-white/60 rounded-full" />
            <Text className="text-sm font-medium text-white/90 tracking-wide">
              {roleName}
            </Text>
          </View>

          <View className="mt-2 space-y-0.5">
            <Text className="text-xl font-bold text-white tracking-tight">
              {currentTime}
            </Text>
            <Text className="text-sm font-semibold text-white/80 tracking-wide">
              {currentDate}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
});

CounterHeader.displayName = 'CounterHeader';