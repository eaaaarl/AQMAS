import { LoginForm } from '@/features/auth/components';
import { DeviceNotRegisteredMessage } from '@/features/auth/components/DeviceNotRegisteredMessage';
import { LoginHeader } from '@/features/auth/components/LoginHeader';
import { useLoginScreen } from '@/features/auth/hooks/useLoginScreen';
import { useAppSelector } from '@/libs/redux/hooks';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';

export default function Login() {
  const {
    isDeviceRegistered,
    isLoading,
    handleLogin,
    errorMessage,
  } = useLoginScreen();

  const config = useAppSelector((state) => state.config)
  const needsConfig = !config.ipAddress || !config.port;
  const needAuthorizationDevice = !isDeviceRegistered;

  useEffect(() => {
    if (needsConfig) {
      router.replace('/(developer)/setting');
      return;
    }

    if (needAuthorizationDevice) {
      router.replace('/auth/unauthorize');
      return;
    }

  }, [needsConfig, needAuthorizationDevice]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50"
    >
      <View className="flex-1 justify-center px-8">
        <LoginHeader />
        <LoginForm
          onSubmit={handleLogin}
          isLoading={isLoading}
          isDeviceRegistered={isDeviceRegistered}
        />
        {errorMessage && (
          <DeviceNotRegisteredMessage message={errorMessage} />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
