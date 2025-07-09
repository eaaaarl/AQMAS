import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export interface LogoutSectionProps {
  onLogout: () => void;
}

export const LogoutSection: React.FC<LogoutSectionProps> = ({ onLogout }) => (
  <View className="mt-4 px-2">
    <TouchableOpacity
      onPress={onLogout}
      style={{ backgroundColor: '#ef4444' }}
      className="rounded-xl py-4 active:opacity-80"
    >
      <Text className="text-center text-base font-semibold text-white">
        Logout
      </Text>
    </TouchableOpacity>
  </View>
); 