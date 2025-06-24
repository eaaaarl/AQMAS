import ConfigDisplay from '@/features/developer/components/ConfigDisplay';
import { useDeveloperSetting } from '@/features/developer/hooks/useDeveloperSetting';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Setting() {
  const { currentConfig, ipAddress, port, setIpAddress, setPort, handleSave } =
    useDeveloperSetting();
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
