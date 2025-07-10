import { useDeveloperSetting } from '@/features/developer/hooks/useDeveloperSetting';
import * as Application from 'expo-application';
import * as Device from 'expo-device';
import { useCallback, useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { LoginFormData } from '../types';
import { useAuth } from './useAuth';

export const useLoginScreen = () => {
  const { login, isLoading } = useAuth();
  const { checkDevice } = useDeveloperSetting();
  const [isDeviceRegistered, setIsDeviceRegistered] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const checkDeviceRegistration = useCallback(async () => {
    try {
      const androidId = Application.getAndroidId();
      const deviceType = Device.osName === 'Android' ? 1 : 2;
      const deviceCheck = await checkDevice({
        type: deviceType,
        id: androidId,
      }).unwrap();
      setIsDeviceRegistered(deviceCheck.registered);
      if (!deviceCheck.registered) {
        setErrorMessage('This device is not registered. Please contact your administrator.');
      } else {
        setErrorMessage(null);
      }
    } catch (error) {
      setIsDeviceRegistered(false);
      setErrorMessage('Device check failed. Please try again or contact administrator.');
      Toast.show({
        type: 'error',
        text1: 'Device Check Failed',
        text2: 'Please try again or contact administrator',
      });
    }
  }, [checkDevice]);

  useEffect(() => {
    checkDeviceRegistration();
  }, [checkDeviceRegistration]);

  const handleLogin = async (formData: LoginFormData) => {
    try {
      await login(formData);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: 'Please check your credentials and try again',
      });
    }
  };

  return {
    isDeviceRegistered,
    isLoading,
    handleLogin,
    errorMessage,
  };
}; 