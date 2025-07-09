import React from 'react';
import { Text, View } from 'react-native';

export interface VerificationHeaderProps {
  title?: string;
  description?: string;
}

export const VerificationHeader: React.FC<VerificationHeaderProps> = ({
  title = 'Verification Required',
  description = 'Enter the verification code provided by your administrator to gain access.',
}) => (
  <View className="items-center mb-8">
    <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-4">
      <Text className="text-4xl">🔐</Text>
    </View>
    <Text className="text-2xl font-bold text-blue-600 text-center mb-2">{title}</Text>
    <Text className="text-gray-600 text-center leading-relaxed">{description}</Text>
  </View>
); 