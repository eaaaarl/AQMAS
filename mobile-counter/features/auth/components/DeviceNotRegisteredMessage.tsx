import React from 'react';
import { Text, View } from 'react-native';

export interface DeviceNotRegisteredMessageProps {
  message: string;
}

export const DeviceNotRegisteredMessage: React.FC<DeviceNotRegisteredMessageProps> = ({ message }) => (
  <View className="mt-4 p-4 bg-red-100 rounded-lg">
    <Text className="text-center text-red-600 font-semibold">{message}</Text>
  </View>
); 