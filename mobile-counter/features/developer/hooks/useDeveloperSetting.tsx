import { useAppDispatch, useAppSelector } from '@/libs/redux/hooks';
import { setConfig } from '@/libs/redux/state/configSlice';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';

export const useDeveloperSetting = () => {
  const dispatch = useAppDispatch();
  const currentConfig = useAppSelector(state => state.config);
  const [ipAddress, setIpAddress] = useState('');
  const [port, setPort] = useState('');

  useEffect(() => {
    if (currentConfig.ipAddress) {
      setIpAddress(currentConfig.ipAddress);
    }
    if (currentConfig.port) {
      setPort(currentConfig.port);
    }
  }, [currentConfig]);

  const handleSave = () => {
    try {
      dispatch(setConfig({ ipAddress, port }));
      Toast.show({
        type: 'success',
        text1: 'Settings Saved',
        text2: 'The new configuration has been applied.',
      });
      router.push('/auth/login');
    } catch (error) {
      console.error('Error saving settings:', error);
      Toast.show({
        type: 'error',
        text1: 'Error Saving Settings',
        text2: 'Please check your input and try again.',
      });
    }
  };

  return {
    currentConfig,
    ipAddress,
    port,
    handleSave,
    setIpAddress,
    setPort,
  };
};
