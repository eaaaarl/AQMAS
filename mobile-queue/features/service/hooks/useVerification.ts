import { useVerifyDeviceMutation } from '@/features/device/api/deviceApi';
import * as Application from 'expo-application';
import { router } from 'expo-router';
import { useState } from 'react';
import Toast from 'react-native-toast-message';

export interface UseVerification {
  passcode: string;
  setPasscode: (code: string) => void;
  isVerifying: boolean;
  isVerifyingDevice: boolean;
  handleVerification: () => Promise<void>;
  handleGoBack: () => void;
}

export function useVerification(): UseVerification {
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
      const res = await verifyDevice({ id: androidId, passcode }).unwrap();
      if (res.verified) {
        Toast.show({
          type: 'success',
          text1: 'Verification Successful',
          text2: 'Access granted! Redirecting...',
        });
        router.push('/(service)');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Verification Failed',
          text2: 'Invalid verification code. Please try again.',
        });
        router.push('/(service)/unauthorize');
      }
    } catch (error) {
      console.log(error);
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

  return {
    passcode,
    setPasscode,
    isVerifying,
    isVerifyingDevice,
    handleVerification,
    handleGoBack,
  };
} 