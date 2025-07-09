import { useRegisteredDeviceMutation } from '@/features/device/api/deviceApi';
import * as Application from 'expo-application';
import * as Device from 'expo-device';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

interface UseUnauthorize {
  isLoading: boolean;
  handleVerification: () => void;
  handleContactAdmin: () => void;
  handleTryAgain: () => Promise<void>;
}

export const useUnauthorize = (): UseUnauthorize => {
  const [registerDevice, { isLoading }] = useRegisteredDeviceMutation();

  const handleVerification = () => {
    router.push('/(service)/verification');
  };

  const handleContactAdmin = () => {
    // Implement contact admin logic here (e.g., open mail, show info, etc.)
    Toast.show({
      type: 'info',
      text1: 'Contact Administrator',
      text2: 'Please reach out to your administrator for assistance.',
    });
  };

  const handleTryAgain = async () => {
    try {
      const deviceId = Application.getAndroidId();
      const osType = Device.osName === 'Android' ? 1 : 2;

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
      console.log('Device registration error:', error);
      Toast.show({
        type: 'error',
        text1: 'Registration failed',
        text2: 'Please try again or contact administrator',
      });
    }
  };

  return {
    isLoading,
    handleVerification,
    handleContactAdmin,
    handleTryAgain,
  };
}; 