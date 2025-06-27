// app/auth/verification.tsx
import { useVerifyDeviceMutation } from '@/features/auth/api/deviceApi';
import * as Application from 'expo-application';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function Verification() {
  const [passcode, setPasscode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyDevice, { isLoading: isVerifyingDevice }] = useVerifyDeviceMutation();
  const androidId = Application.getAndroidId();
  const handleVerification = async () => {
    if (!passcode.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Input',
        text2: 'Please enter a verification code',
      });
      return;
    }

    setIsVerifying(true);

    try {
      console.log('passcode', passcode);
      console.log('androidId', androidId);
      const res = await verifyDevice({
        id: androidId,
        passcode: passcode,
      }).unwrap();
      console.log('res', res);

      if (res.verified) {
        Toast.show({
          type: 'success',
          text1: 'Verification Successful',
          text2: 'Access granted! Redirecting...',
        });
        router.push('/auth/login');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Verification Failed',
          text2: 'Invalid verification code. Please try again.',
        });

        router.push('/auth/unauthorize');
      }
    } catch (error) {
      console.log('error', error);
      Toast.show({
        type: 'error',
        text1: 'Verification Error',
        text2: 'Failed to verify code. Please try again.',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-50">
      <View className="flex-1 justify-center items-center px-6">
        <View className="bg-white rounded-2xl p-8 shadow-lg w-full max-w-sm border border-blue-100">
          {/* Header */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-4">
              <Text className="text-4xl">🔐</Text>
            </View>

            <Text className="text-2xl font-bold text-blue-600 text-center mb-2">
              Verification Required
            </Text>

            <Text className="text-gray-600 text-center leading-relaxed">
              Enter the verification code provided by your administrator to gain access.
            </Text>
          </View>

          {/* Passcode Input */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Verification Code
            </Text>
            <TextInput

              value={passcode}
              onChangeText={setPasscode}
              placeholder="Enter verification code"
              className="border text-black border-gray-300 rounded-lg px-4 py-3 text-center text-lg font-bold bg-gray-50"
              secureTextEntry
              maxLength={10}
              keyboardType="numeric"
              autoFocus
            />
          </View>

          {/* Action Buttons */}
          <View className="gap-3">
            <TouchableOpacity
              onPress={handleVerification}
              disabled={isVerifying || isVerifyingDevice || !passcode.trim()}
              className={`py-3 px-6 rounded-lg shadow-sm ${isVerifying || isVerifyingDevice || !passcode.trim()
                ? 'bg-gray-400'
                : 'bg-blue-500'
                }`}
            >
              <Text className="text-white text-center font-semibold">
                {isVerifying || isVerifyingDevice ? <ActivityIndicator size="small" color="white" /> : 'Verify Access'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleGoBack}
              className="border border-gray-300 py-3 px-6 rounded-lg"
              disabled={isVerifying || isVerifyingDevice}
            >
              <Text className="text-gray-700 text-center font-medium">
                Go Back
              </Text>
            </TouchableOpacity>
          </View>

          {/* Help Text */}
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