import { VerificationForm } from '@/features/auth/components/VerificationForm';
import { VerificationHeader } from '@/features/auth/components/VerificationHeader';
import { useVerificationScreen } from '@/features/auth/hooks/useVerificationScreen';
import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';

export default function Verification() {
  const {
    passcode,
    setPasscode,
    isVerifying,
    handleVerification,
    handleGoBack,
  } = useVerificationScreen();

  return (
    <SafeAreaView className="flex-1 bg-blue-50">
      <View className="flex-1 justify-center items-center px-6">
        <View className="bg-white rounded-2xl p-8 shadow-lg w-full max-w-sm border border-blue-100">
          <VerificationHeader />
          <VerificationForm
            passcode={passcode}
            setPasscode={setPasscode}
            isVerifying={isVerifying}
            onVerify={handleVerification}
            onGoBack={handleGoBack}
          />
          <View className="mt-6 pt-4 border-t border-gray-200">
            <Text className="text-xs text-gray-500 text-center leading-relaxed">
              Contact your administrator if you don&apos;t have a verification code or if you&apos;re experiencing issues.
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}