import { useDeveloperSetting } from '@/features/developer/hooks/useDeveloperSetting';
import { router } from 'expo-router';
import { useState } from 'react';
import Toast from 'react-native-toast-message';

export interface UseNotRegistered {
  isRegistering: boolean;
  handleRegisterDevice: () => Promise<void>;
}

export const useNotRegistered = (): UseNotRegistered => {
  const [isRegistering, setIsRegistering] = useState(false);
  const { registerDeviceSilently } = useDeveloperSetting();

  const handleRegisterDevice = async () => {
    setIsRegistering(true);
    try {
      const res = await registerDeviceSilently();
      if (res) {
        Toast.show({
          type: 'success',
          text1: 'Device Registered',
          text2: 'Your device has been registered successfully!',
        });
        router.push('/(service)');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Registration Failed',
          text2: 'Please try again or contact administrator',
        });
      }
    } catch (error: any) {
      console.log('error', error);
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: 'Please try again or contact administrator',
      });
    } finally {
      setIsRegistering(false);
    }
  };

  return {
    isRegistering,
    handleRegisterDevice,
  };
}; 