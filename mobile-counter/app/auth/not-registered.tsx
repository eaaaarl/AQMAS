// app/auth/not-registered.tsx
import { useDeveloperSetting } from '@/features/developer/hooks/useDeveloperSetting';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function NotRegistered() {
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
        router.push('/auth/login');
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

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 justify-center items-center px-8">
        <View className="bg-white rounded-lg p-8 shadow-lg w-full max-w-sm">
          <View className="items-center mb-6">
            <Text className="text-6xl mb-4">📱</Text>
            <Text className="text-xl font-bold text-gray-800 text-center">
              Device Not Registered
            </Text>
            <Text className="text-gray-600 text-center mt-2">
              Your device needs to be registered before you can continue.
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleRegisterDevice}
            disabled={isRegistering}
            className={`py-3 px-6 rounded-lg ${isRegistering ? 'bg-gray-400' : 'bg-blue-500'
              }`}
          >
            <Text className="text-white text-center font-semibold">
              {isRegistering ? 'Registering...' : 'OK - Register Device'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}