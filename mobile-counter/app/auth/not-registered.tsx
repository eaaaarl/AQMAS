import { NotRegisteredCard } from '@/features/auth/components';
import { useNotRegisteredScreen } from '@/features/auth/hooks';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotRegistered() {
  const { isRegistering, handleRegisterDevice } = useNotRegisteredScreen();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 justify-center items-center px-8">
        <NotRegisteredCard
          isRegistering={isRegistering}
          onRegister={handleRegisterDevice}
        />
      </View>
    </SafeAreaView>
  );
}