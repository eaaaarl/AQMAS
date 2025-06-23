import ConfigDisplay from '@/features/developer/components/ConfigDisplay';
import { useAppDispatch, useAppSelector } from '@/libs/redux/hooks';
import { setConfig } from '@/libs/redux/state/configSlice';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function Setting() {
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
    dispatch(setConfig({ ipAddress, port }));
    Toast.show({
      type: 'success',
      text1: 'Settings Saved',
      text2: 'The new configuration has been applied.',
    });
    router.push('/auth/login');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-4">
        <ConfigDisplay currentConfig={currentConfig} />
        <View className="mt-4 gap-4">
          <View>
            <Text className="mb-2 text-sm font-medium text-gray-700">
              IP Address
            </Text>
            <TextInput
              value={ipAddress}
              onChangeText={setIpAddress}
              placeholder="Enter IP Address"
              className="rounded-lg border border-gray-300 bg-white px-3 py-2"
              keyboardType="numeric"
            />
          </View>

          <View>
            <Text className="mb-2 text-sm font-medium text-gray-700">Port</Text>
            <TextInput
              value={port}
              onChangeText={setPort}
              placeholder="Enter Port"
              className="rounded-lg border border-gray-300 bg-white px-3 py-2"
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity
            onPress={handleSave}
            className="mt-4 rounded-lg bg-blue-500 py-3"
          >
            <Text className="text-center font-semibold text-white">
              Save Settings
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
