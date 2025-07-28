import * as Application from 'expo-application';
import * as Device from 'expo-device';
import { router } from 'expo-router';
import { useCallback } from 'react';
import Toast from 'react-native-toast-message';
import {
  useLazyCheckDeviceQuery,
  useRegisteredDeviceMutation,
} from '../api/deviceApi';

export function useUnauthorizeScreen() {
  const [registerDevice, { isLoading }] = useRegisteredDeviceMutation();
  const [checkDevice, { isLoading: isChecking }] = useLazyCheckDeviceQuery();

  const handleVerification = useCallback(() => {
    router.push('/auth/verification');
  }, []);

  const handleContactAdmin = useCallback(() => {
    Toast.show({
      type: 'info',
      text1: 'Contact Administrator',
      text2: 'Please reach out to your administrator for assistance.',
    });
  }, []);

  const handleTryAgain = useCallback(async () => {
    try {
      const deviceId = Application.getAndroidId();
      const osType = Device.osName === 'Android' ? 1 : 2;

      const { registered } = await checkDevice({
        id: deviceId,
        type: 1,
      }).unwrap();

      console.log('registered', registered);

      if (registered) {
        router.replace('/auth/login');
        return;
      }

      await registerDevice({
        id: deviceId,
        os: osType,
        type: 1,
      }).unwrap();

      Toast.show({
        type: 'success',
        text1: 'Device registered.',
        text2: 'Please contact your administrator to verify your device.',
      });
    } catch (error) {
      console.error('Device registration error:', error);
      Toast.show({
        type: 'error',
        text1: 'Registration failed',
        text2: 'Please try again or contact administrator',
      });
      // router.back();
    }
  }, [checkDevice, registerDevice]);

  return {
    isLoading: isChecking || isLoading,
    handleVerification,
    handleContactAdmin,
    handleTryAgain,
  };
}
