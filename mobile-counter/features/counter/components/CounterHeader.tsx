import { OfflineIndicator } from '@/features/error';
import React from 'react';
import { Text, View } from 'react-native';

interface CounterHeaderProps {
  config: any;
  counterNo: string | number;
  roleName: string;
  currentTime: React.ReactNode;
  hasQueuedData: boolean;
  hasConnectionError: boolean;
}

export const CounterHeader: React.FC<CounterHeaderProps> = ({
  config,
  counterNo,
  roleName,
  currentTime,
  hasQueuedData,
  hasConnectionError,
}) => {
  return (
    <>
      <OfflineIndicator isOffline={hasConnectionError} />
      <View style={{ backgroundColor: '#1c3f83' }} className="px-6 py-4">
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="text-lg font-semibold text-white">
            {config?.[0]?.Value} {counterNo}
          </Text>
          {hasQueuedData && (
            <View className="rounded-full bg-orange-500 px-2 py-1">
              <Text className="text-xs font-semibold text-white">
                Queued Available
              </Text>
            </View>
          )}
        </View>
        <View>
          <Text className="text-sm text-white/80">{roleName}</Text>
          <Text className="text-xl font-bold text-white">
            {currentTime}
          </Text>
        </View>
      </View>
    </>
  );
}; 