import { useConfigUpdate } from '@/features/service/hooks/useConfigUpdate';
import { router } from 'expo-router';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {

    const {
        currentConfig,
        handleSubmit,
        ipAddress,
        isUpdating,
        port,
        setIpAddress,
        setPort
    } = useConfigUpdate()

    return (
        <SafeAreaView className="flex-1 bg-white p-4">

            <TouchableOpacity
                className="mb-4 p-2 flex-row items-center"
                onPress={() => router.push('/(service)')}
            >
                {/* <ChevronLeft size={24} color="#3b82f6" /> */}
                <Text className="text-blue-500 ml-1">Back</Text>
            </TouchableOpacity>

            {currentConfig && (
                <View className="mb-4 p-3 bg-gray-100 rounded-md">
                    <Text className="text-sm text-gray-600">Current Configuration:</Text>
                    <Text className="text-sm">IP: {currentConfig.ipAddress}</Text>
                    <Text className="text-sm">Port: {currentConfig.port}</Text>
                </View>
            )}

            <View className="space-y-4">
                <View>
                    <Text className="text-gray-600 mb-2">IP Address:</Text>
                    <TextInput
                        className="border border-gray-300 rounded-md p-2"
                        value={ipAddress}
                        onChangeText={setIpAddress}
                        placeholder="Enter IP Address (e.g. 192.168.1.22)"
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!isUpdating}
                    />
                </View>

                <View>
                    <Text className="text-gray-600 mb-2">Port:</Text>
                    <TextInput
                        className="border border-gray-300 rounded-md p-2"
                        value={port}
                        onChangeText={setPort}
                        placeholder="Enter Port (e.g. 4000)"
                        keyboardType="numeric"
                        editable={!isUpdating}
                    />
                </View>

                <TouchableOpacity
                    className={`p-4 rounded-md mt-4 ${isUpdating ? 'bg-gray-400' : 'bg-blue-500'}`}
                    onPress={handleSubmit}
                    disabled={isUpdating}
                >
                    <Text className="text-white text-center font-semibold">
                        {isUpdating ? 'Updating...' : 'Update Configuration'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}