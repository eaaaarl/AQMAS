import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDeveloperSetting } from '../hooks/useDeveloperSetting';

export default function ApiConfigForm() {
    const { ipAddress, port, setIpAddress, setPort, handleSave } = useDeveloperSetting();
    return (
        <View className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm mb-6">
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
                        className="rounded-lg border border-gray-300 bg-gray-50 font-bold text-black px-4 py-3 text-base"
                        keyboardType="url"
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholderTextColor="#9CA3AF"
                    />
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
                        className="rounded-lg border text-black font-bold border-gray-300 bg-gray-50 px-4 py-3 text-base"
                        keyboardType="numeric"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
                {/* Save Button */}
                <View className='flex-1'>
                    <TouchableOpacity
                        onPress={handleSave}
                        className="mt-6 rounded-lg bg-blue-600 py-3 px-4 shadow-sm active:bg-blue-700"
                        activeOpacity={0.8}
                    >
                        <View className="flex-row items-center justify-center gap-2">
                            <AntDesign name="save" size={24} color="white" />
                            <Text className="text-center text-base font-semibold text-white">
                                Save Configuration
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
} 