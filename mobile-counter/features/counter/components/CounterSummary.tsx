import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface CounterSummaryProps {
  finishedCount: number;
  skippedCount: number;
  remainingCount: number;
  queue?: { remaining?: number };
  bestTime?: string;
  worstTime?: string;
  averageTime?: string;
}

export const CounterSummary: React.FC<CounterSummaryProps> = ({
  finishedCount,
  skippedCount,
  remainingCount,
  queue,
  bestTime,
  worstTime,
  averageTime,
}) => {
  return (
    <View className="px-6 pb-6">
      <Text className="mb-4 text-center text-base font-semibold text-gray-700">
        Today&apos;s Summary
      </Text>
      
      {/* Counts Section */}
      <View className="mb-6 flex-row justify-between">
        <View className="items-center">
          <MaterialCommunityIcons name="check-circle" size={24} color="#22c55e" />
          <Text className="mt-1 text-xs text-gray-600">Finished</Text>
          <Text className="text-lg font-bold text-gray-800">{finishedCount}</Text>
        </View>
        <View className="items-center">
          <MaterialCommunityIcons name="skip-next-circle" size={24} color="#f59e0b" />
          <Text className="mt-1 text-xs text-gray-600">Skipped</Text>
          <Text className="text-lg font-bold text-gray-800">{skippedCount}</Text>
        </View>
        <View className="items-center">
          <MaterialCommunityIcons name="account-clock" size={24} color="#1c3f83" />
          <Text className="mt-1 text-xs text-gray-600">Waiting</Text>
          <Text className="text-lg font-bold text-gray-800">
            {queue?.remaining ? Number(queue.remaining) : remainingCount}
          </Text>
        </View>
      </View>

      {/* Times Section */}
      <View className="rounded-lg bg-gray-50 p-4">
        <Text className="mb-3 text-sm font-medium text-gray-700">Service Times</Text>
        <View className="gap-3 space-y-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <MaterialCommunityIcons name="timer-outline" size={18} color="#059669" />
              <Text className="ml-2 text-gray-600">Best Time</Text>
            </View>
            <Text className="font-medium text-emerald-600">{bestTime || '-'}</Text>
          </View>
          
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <MaterialCommunityIcons name="timer-sand" size={18} color="#dc2626" />
              <Text className="ml-2 text-gray-600">Worst Time</Text>
            </View>
            <Text className="font-medium text-red-600">{worstTime || '-'}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}; 