import React from 'react';
import { Image, Text, View } from 'react-native';
import { useSurvey } from '../hooks/useSurvey';

export default function SurveyHeader() {
    const { questions, currentQuestion } = useSurvey();
    return (
        <View className="bg-white mx-4 mt-20 mb-4 rounded-2xl p-6 shadow-sm items-center">
            <View className="w-20 h-20 bg-gray-200 rounded-full shadow-lg mb-4 items-center justify-center">
                <Image source={require('@/assets/img/survey_button.png')}
                    className="w-28 h-28" />
            </View>
            <Text className="text-lg text-gray-600">
                {currentQuestion + 1} of {questions.length}
            </Text>
        </View>
    )
}