import { DevelopmentTips } from '@/features/developer/components';
import ApiConfigForm from '@/features/developer/components/ApiConfigForm';
import BluetoothSettings from '@/features/developer/components/BluetoothSettings';
import ConfigDisplay from '@/features/developer/components/ConfigDisplay';
import { useDeveloperSetting } from '@/features/developer/hooks/useDeveloperSetting';
import React from 'react';
import { Dimensions, ScrollView, Text, View } from 'react-native';

export default function Setting() {
    const { currentConfig } = useDeveloperSetting();
    const { width, height } = Dimensions.get('window');
    const isLandscape = width > height;
    const isTablet = width >= 768;
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

            {isLandscape && isTablet ? (
                // Landscape Layout - Two Columns
                <View className="flex-row gap-4">
                    {/* Left Column */}
                    <View className="flex-1">
                        {/* Configuration Display */}
                        <ConfigDisplay currentConfig={currentConfig} className="mb-4" />

                        {/* API Configuration Form */}
                        <ApiConfigForm />
                    </View>

                    {/* Right Column */}
                    <View className="flex-1">
                        {/* Development Tips */}
                        <DevelopmentTips />

                        {/* Bluetooth Configuration */}
                        <BluetoothSettings />
                    </View>
                </View>
            ) : (
                // Portrait Layout - Single Column
                <View>
                    {/* Configuration Display */}
                    <ConfigDisplay currentConfig={currentConfig} className="mb-4" />

                    {/* API Configuration Form */}
                    <ApiConfigForm />

                    {/* Bluetooth Configuration */}
                    <BluetoothSettings />

                    {/* Development Tips */}
                    <DevelopmentTips />
                </View>
            )}

            <View className="h-6" />
        </ScrollView>
    );
}