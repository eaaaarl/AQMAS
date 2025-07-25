import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Text, View } from 'react-native';

interface OfflineIndicatorProps {
  isOffline: boolean;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  isOffline,
}) => {
  if (!isOffline) return null;

  return (
    <View className="flex-row items-center justify-center bg-red-500 px-3 py-2">
      <Ionicons name="wifi-outline" size={16} color="white" />
      <Text className="ml-2 text-sm font-medium text-white">
        No Internet Connection
      </Text>
    </View>
  );
};
