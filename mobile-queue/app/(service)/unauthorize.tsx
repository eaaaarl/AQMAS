import { UnauthorizeCard } from '@/features/service/components';
import { useUnauthorize } from '@/features/service/hooks/useUnauthorize';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UnauthorizeScreen() {
  const {
    isLoading,
    handleVerification,
    handleContactAdmin,
    handleTryAgain,
  } = useUnauthorize();

  return (
    <SafeAreaView className="flex-1 bg-red-50">
      <View className="flex-1 justify-center items-center px-6">
        <UnauthorizeCard
          isLoading={isLoading}
          onVerification={handleVerification}
          onContactAdmin={handleContactAdmin}
          onTryAgain={handleTryAgain}
        />
      </View>
    </SafeAreaView>
  );
}