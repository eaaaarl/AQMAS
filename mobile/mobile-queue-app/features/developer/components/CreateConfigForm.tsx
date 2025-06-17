import { useConfigUpdate } from '@/features/developer/hooks/useConfig'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'

export default function CreateConfigForm() {
    const {
        handleSubmit,
        ipAddress,
        isUpdating,
        port,
        setIpAddress,
        setPort
    } = useConfigUpdate()

    return (
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
    )
}