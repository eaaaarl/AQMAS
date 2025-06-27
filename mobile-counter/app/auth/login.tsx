import { LoginForm } from '@/features/auth/components';
import { useAuth } from '@/features/auth/hooks';
import { useDeveloperSetting } from '@/features/developer/hooks/useDeveloperSetting';
import * as Application from 'expo-application';
import * as Device from 'expo-device';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';

export default function Login() {
  const { login, isLoading } = useAuth();
  const { checkDevice } = useDeveloperSetting();

  const handleLogin = async (formData: any) => {
    await login(formData);
  };


  useEffect(() => {
    const checkDeviceData = async () => {
      const androidId = Application.getAndroidId();
      const deviceType = Device.osName === 'Android' ? 1 : 2;
      const res = await checkDevice({
        type: deviceType,
        id: androidId,
      }).unwrap();
      if (res.registered === false) {
        router.push('/auth/unauthorize');
      }
    };
    checkDeviceData();
  }, [checkDevice]);

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

        <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
      </View>
    </KeyboardAvoidingView>
  );
}
