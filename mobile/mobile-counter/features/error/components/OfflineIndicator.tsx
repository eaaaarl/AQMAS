import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface OfflineIndicatorProps {
  isOffline: boolean;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ isOffline }) => {
  if (!isOffline) return null;

  return (
    <View className="bg-red-500 px-3 py-2 flex-row items-center justify-center">
      <Ionicons name="wifi-outline" size={16} color="white" />
      <Text className="text-white text-sm font-medium ml-2">
        No Internet Connection
      </Text>
    </View>
  );
}; 