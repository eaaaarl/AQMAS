import React from 'react';
import { Text, View } from 'react-native';

export interface VerificationHelpProps {
  helpText: string;
}

export const VerificationHelp: React.FC<VerificationHelpProps> = ({ helpText }) => (
  <View className="mt-6 pt-4 border-t border-gray-200">
    <Text className="text-xs text-gray-500 text-center leading-relaxed">
      {helpText}
    </Text>
  </View>
); 