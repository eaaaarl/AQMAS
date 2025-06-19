import { ApiConfig } from '@/libs/redux/state/configSlice';
import React from 'react';
import { Text, View } from 'react-native';

interface ConfigDisplayProps {
    currentConfig: ApiConfig;
}

export default function ConfigDisplay(props: ConfigDisplayProps) {
    const {
        currentConfig
    } = props
    return (
        <View className="mb-4 p-3 bg-gray-100 rounded-md">
            <Text className="text-sm text-gray-600">Current Configuration:</Text>
            <Text className="text-sm">IP: {currentConfig.ipAddress}</Text>
            <Text className="text-sm">Port: {currentConfig.port}</Text>
        </View>
    )
}