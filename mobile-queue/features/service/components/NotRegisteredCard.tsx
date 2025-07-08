import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface NotRegisteredCardProps {
  isRegistering: boolean;
  onRegister: () => void;
}

export const NotRegisteredCard: React.FC<NotRegisteredCardProps> = ({ isRegistering, onRegister }) => (
  <View className="bg-white rounded-lg p-8 shadow-lg w-full max-w-sm">
    <View className="items-center mb-6">
      <Text className="text-6xl mb-4">📱</Text>
      <Text className="text-xl font-bold text-gray-800 text-center">
        Device Not Registered
      </Text>
      <Text className="text-gray-600 text-center mt-2">
        Your device needs to be registered before you can continue.
      </Text>
    </View>
    <TouchableOpacity
      onPress={onRegister}
      disabled={isRegistering}
      className={`py-3 px-6 rounded-lg ${isRegistering ? 'bg-gray-400' : 'bg-blue-500'}`}
    >
      <Text className="text-white text-center font-semibold">
        {isRegistering ? 'Registering...' : 'OK - Register Device'}
      </Text>
    </TouchableOpacity>
  </View>
);

export default NotRegisteredCard; 