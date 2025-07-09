import { VerificationForm } from '@/features/service/components/VerificationForm';
import { VerificationHeader } from '@/features/service/components/VerificationHeader';
import { VerificationHelp } from '@/features/service/components/VerificationHelp';
import { useVerification } from '@/features/service/hooks/useVerification';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Verification() {
  const {
    passcode,
    setPasscode,
    isVerifying,
    isVerifyingDevice,
    handleVerification,
    handleGoBack,
  } = useVerification();

  return (
    <SafeAreaView className="flex-1 bg-blue-50">
      <View className="flex-1 justify-center items-center px-6">
        <View className="bg-white rounded-2xl p-8 shadow-lg w-full max-w-sm border border-blue-100">
          <VerificationHeader
            title="Verification Required"
            subtitle="Enter the verification code provided by your administrator to gain access."
          />
          <VerificationForm
            passcode={passcode}
            setPasscode={setPasscode}
            isVerifying={isVerifying}
            isVerifyingDevice={isVerifyingDevice}
            handleVerification={handleVerification}
            handleGoBack={handleGoBack}
          />
          <VerificationHelp
            helpText="Contact your administrator if you don't have a verification code or if you're experiencing issues."
          />
        </View>
      </View>
    </SafeAreaView>
  );
}