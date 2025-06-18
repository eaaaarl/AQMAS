import DismissKeyboard from '@/components/DismissKeyboard';
import { useGetSurveyResultQuery } from '@/features/survey/api/surveyApi';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SurveyScreen() {
    const { data: surveyResultData } = useGetSurveyResultQuery()
    console.log(surveyResultData)
    const handleConfirmBack = () => {
        router.push('/(service)')
    }

    return (
        <DismissKeyboard>
            <SafeAreaView className="flex-1 bg-gray-50">
                <View className="bg-gray-800 py-6 px-4 relative">
                    <TouchableOpacity
                        onPress={handleConfirmBack}
                        className="absolute left-4 top-6 z-10"
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>

                    <View className="items-center">
                        <View className="w-20 h-20 bg-red-500 rounded-full items-center justify-center shadow-lg">
                            <Text className="text-white font-bold text-xs text-center leading-tight">
                                TAKE THE{'\n'}SURVEY
                            </Text>
                        </View>
                    </View>
                </View>

                <View>

                </View>

            </SafeAreaView>
        </DismissKeyboard>
    );
}