import React from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface DeveloperConfigFormProps {
  ipAddress: string;
  port: string;
  setIpAddress: (ip: string) => void;
  setPort: (port: string) => void;
  handleSave: () => void;
  isCheckingDevice: boolean;
}

export const DeveloperConfigForm: React.FC<DeveloperConfigFormProps> = ({
  ipAddress,
  port,
  setIpAddress,
  setPort,
  handleSave,
  isCheckingDevice,
}) => (
  <View className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
    <View className="mb-4">
      <Text className="text-lg font-semibold text-gray-900 mb-1">
        API Configuration
      </Text>
      <Text className="text-sm text-gray-600">
        Enter your server details to establish connection
      </Text>
    </View>
    <View className="space-y-4">
      {/* IP Address Input */}
      <View>
        <Text className="mb-2 text-sm font-medium text-gray-700">
          IP Address
        </Text>
        <TextInput
          value={ipAddress}
          onChangeText={setIpAddress}
          placeholder="e.g., 192.168.1.100"
          className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-base"
          keyboardType="url"
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor="#9CA3AF"
        />
        <Text className="mt-1 text-xs text-gray-500">
          Enter the IP address of your development server
        </Text>
      </View>
      {/* Port Input */}
      <View>
        <Text className="mb-2 text-sm font-medium text-gray-700">
          Port
        </Text>
        <TextInput
          value={port}
          onChangeText={setPort}
          placeholder="e.g., 3000"
          className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-base"
          keyboardType="numeric"
          placeholderTextColor="#9CA3AF"
        />
        <Text className="mt-1 text-xs text-gray-500">
          Port number where your server is running
        </Text>
      </View>
      {/* Save Button */}
      <TouchableOpacity
        onPress={handleSave}
        className="mt-6 rounded-lg bg-blue-600 py-3 px-4 shadow-sm active:bg-blue-700 flex-row items-center justify-center"
        activeOpacity={0.8}
        disabled={isCheckingDevice}
      >
        {isCheckingDevice ? (
          <ActivityIndicator size="small" color="#fff" className="mr-2" />
        ) : null}
        <Text className="text-center text-base font-semibold text-white">
          {isCheckingDevice ? 'Saving...' : 'Save Configuration'}
        </Text>
      </TouchableOpacity>
    </View>
  </View>
); 