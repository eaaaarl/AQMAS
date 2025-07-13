import { DevelopmentTips } from '@/features/developer/components';
import ApiConfigForm from '@/features/developer/components/ApiConfigForm';
import BluetoothSettings from '@/features/developer/components/BluetoothSettings';
import ConfigDisplay from '@/features/developer/components/ConfigDisplay';
import { useDeveloperSetting } from '@/features/developer/hooks/useDeveloperSetting';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

export default function Setting() {
    const { currentConfig } = useDeveloperSetting();

    return (
        <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
        >
            <View className="mb-6">
                <Text className="text-2xl font-bold text-gray-900">
                    Developer Settings
                </Text>
                <Text className="mt-1 text-sm text-gray-600">
                    Configure API connection and Bluetooth settings for development
                </Text>
            </View>

            {/* Configuration Display */}
            <ConfigDisplay currentConfig={currentConfig} className="mb-6" />

            {/* API Configuration Form */}
            <ApiConfigForm />

            {/* Bluetooth Configuration */}
            <BluetoothSettings />

            {/* Development Tips */}
            <DevelopmentTips />

            <View className="h-6" />
        </ScrollView>
    );
}