import React from 'react'
import { Text, View } from 'react-native'
import { useConfigUpdate } from '../hooks/useConfig'

export default function ConfigDisplay() {
    const { currentConfig } = useConfigUpdate()
    return (
        <View className="mb-4 p-3 bg-gray-100 rounded-md">
            <Text className="text-sm text-gray-600">Current Configuration:</Text>
            <Text className="text-sm">IP: {currentConfig.ipAddress}</Text>
            <Text className="text-sm">Port: {currentConfig.port}</Text>
        </View>
    )
}