import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SurveyLayoutProps {
    isLoading: boolean;
    isError: boolean;
    onBackPress: () => void;
    children: React.ReactNode;
}

export function SurveyLayout({
    isLoading,
    isError,
    onBackPress,
    children
}: SurveyLayoutProps) {
    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }

    if (isError) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
                <Text className="text-red-500 text-lg">Failed to load survey results</Text>
                <TouchableOpacity onPress={onBackPress} className="mt-4">
                    <Text className="text-blue-500">Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="bg-gray-800 py-6 px-4 relative">
                <TouchableOpacity
                    onPress={onBackPress}
                    className="absolute left-4 top-6 z-10"
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>

                <View className="items-center">
                    <View className="w-20 h-20 bg-red-500 rounded-full items-center justify-center shadow-lg">
                        <Text className="text-white font-bold text-xs text-center leading-tight">
                            SURVEY{'\n'}RESULTS
                        </Text>
                    </View>
                </View>
            </View>

            <View className="flex-1 p-4">
                {children}
            </View>
        </SafeAreaView>
    );
} 