import { ApiConfig } from '@/libs/redux/state/configSlice';
import React from 'react';
import { Text, View } from 'react-native';

interface ConfigDisplayProps {
    currentConfig: ApiConfig;
    className?: string;
}

export default function ConfigDisplay({ currentConfig, className = "" }: ConfigDisplayProps) {
    const hasConfig = currentConfig?.ipAddress && currentConfig?.port;
    
    if (!hasConfig) {
        return (
            <View className={`p-5 bg-amber-50 border border-amber-200 rounded-xl ${className}`}>
                <View className="flex-row items-center mb-2">
                    <View className="w-2 h-2 bg-amber-400 rounded-full mr-3" />
                    <Text className="text-sm text-amber-800 font-medium">No Configuration Set</Text>
                </View>
                <Text className="text-xs text-amber-700 ml-5">
                    Please configure the API settings below to connect to your server
                </Text>
            </View>
        );
    }

    return (
        <View className={`p-5 bg-emerald-50 border border-emerald-200 rounded-xl ${className}`}>
            <View className="flex-row items-center mb-3">
                <View className="w-2 h-2 bg-emerald-500 rounded-full mr-3" />
                <Text className="text-sm text-emerald-800 font-medium">Current Configuration</Text>
            </View>
            <View className="space-y-2 ml-5">
                <View className="flex-row justify-between items-center">
                    <Text className="text-xs text-emerald-700 font-medium">IP Address</Text>
                    <Text className="text-xs text-emerald-900 font-mono bg-emerald-100 px-2 py-1 rounded">
                        {currentConfig.ipAddress}
                    </Text>
                </View>
                <View className="flex-row justify-between items-center">
                    <Text className="text-xs text-emerald-700 font-medium">Port</Text>
                    <Text className="text-xs text-emerald-900 font-mono bg-emerald-100 px-2 py-1 rounded">
                        {currentConfig.port}
                    </Text>
                </View>
            </View>
        </View>
    );
}