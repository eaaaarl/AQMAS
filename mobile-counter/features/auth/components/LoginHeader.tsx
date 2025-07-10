import React from 'react';
import { Text, View } from 'react-native';

export interface LoginHeaderProps {}

export const LoginHeader: React.FC<LoginHeaderProps> = () => (
  <View className="mb-12 items-center">
    <Text className="text-4xl font-bold text-gray-800 mt-4">
      Counter Portal
    </Text>
  </View>
); 