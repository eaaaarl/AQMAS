import { LoginForm } from '@/features/auth/components';
import { useAuth } from '@/features/auth/hooks';
import { useDeveloperSetting } from '@/features/developer/hooks/useDeveloperSetting';
import * as Application from 'expo-application';
import * as Device from 'expo-device';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function Login() {
  const { login, isLoading } = useAuth();
  const { checkDevice } = useDeveloperSetting();
  const [isDeviceRegistered, setIsDeviceRegistered] = useState(false);

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
        router.push('/auth/unauthorize');
      }
    } catch (error) {
      console.error('Device check error:', error);
      setIsDeviceRegistered(false);
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

  const handleLogin = async (formData: any) => {
    try {
      await login(formData);
    } catch (error) {
      console.error('Login error:', error);
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: 'Please check your credentials and try again',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50"
    >
      <View className="flex-1 justify-center px-8">
        <View className="mb-12 items-center">
          <Text className="text-4xl font-bold text-gray-800 mt-4">
            Counter Portal
          </Text>
        </View>

        <LoginForm
          onSubmit={handleLogin}
          isLoading={isLoading}
          isDeviceRegistered={isDeviceRegistered}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
