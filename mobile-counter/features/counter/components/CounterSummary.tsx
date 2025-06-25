import React from 'react';
import { Text, View } from 'react-native';

interface CounterSummaryProps {
  finishedCount: number;
  skippedCount: number;
  remainingCount: number;
  queue?: { remaining?: number };
}

export const CounterSummary: React.FC<CounterSummaryProps> = ({
  finishedCount,
  skippedCount,
  remainingCount,
  queue,
}) => {
  return (
    <View className="px-6 pb-6">
      <Text className="mb-4 text-center text-sm font-medium text-gray-500">
        Summary
      </Text>
      <View className="gap-3 space-y-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-gray-600">Finished</Text>
          <Text style={{ color: '#1c3f83' }} className="font-semibold">
            {finishedCount}
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-gray-600">Skipped</Text>
          <Text style={{ color: '#1c3f83' }} className="font-semibold">
            {skippedCount}
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-gray-600">Best Time</Text>
          <Text className="text-gray-400">{'00:00:00'}</Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-gray-600">Worst Time</Text>
          <Text className="text-gray-400">{'00:00:00'}</Text>
        </View>
        <View className="flex-row items-center justify-between border-t border-gray-200 pt-3">
          <Text className="font-medium text-gray-600">Remaining</Text>
          <Text style={{ color: '#1c3f83' }} className="text-lg font-bold">
            {queue?.remaining ? Number(queue.remaining) : remainingCount}
          </Text>
        </View>
      </View>
    </View>
  );
}; 