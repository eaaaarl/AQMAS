import React from 'react';
import { Text, View } from 'react-native';

interface DevelopmentTipsProps {
    className?: string;
}

export default function DevelopmentTips({ className = '' }: DevelopmentTipsProps) {
    return (
        <View className={`rounded-lg border border-blue-100 bg-blue-50 p-4 ${className}`}>
            <View className="flex-row items-start">
                <View className="mr-3 mt-0.5 h-4 w-4 rounded-full bg-blue-400 flex items-center justify-center">
                    <Text className="text-xs font-bold text-white">i</Text>
                </View>
                <View className="flex-1">
                    <Text className="text-sm font-medium text-blue-800 mb-1">
                        Development Tips
                    </Text>
                    <Text className="text-xs text-blue-700 leading-relaxed">
                        • Make sure your development server is running and accessible{''}
                        • Use your computer&apos;s local IP address (not localhost) for device testing{''}
                        • Ensure both device and server are on the same network{''}
                        • Check firewall settings if connection fails{''}
                        • Enable Bluetooth and location permissions for device discovery{''}
                        • Keep devices close during pairing and connection{''}
                        • For thermal printing: ensure printer is powered on and has paper{''}
                        • Use Quick Test for basic connectivity, Full Test for comprehensive testing
                    </Text>
                </View>
            </View>
        </View>
    );
} 