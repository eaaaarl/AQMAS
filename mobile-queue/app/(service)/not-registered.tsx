import { NotRegisteredCard } from '@/features/service/components/NotRegisteredCard';
import { useNotRegistered } from '@/features/service/hooks/useNotRegistered';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const NotRegisteredScreen: React.FC = () => {
  const { isRegistering, handleRegisterDevice } = useNotRegistered();

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
};

export default NotRegisteredScreen;