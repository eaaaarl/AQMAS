import { router } from 'expo-router';
import React from 'react';
import { Image, TouchableOpacity } from 'react-native';

export default function SurveyButton() {
    const handlePress = () => {
        router.push('/(survey)/survey');
    };
    return (
        <TouchableOpacity
            className="absolute bottom-1 left-5 rounded-full"
            onPress={handlePress}
            activeOpacity={0.7}
            accessibilityLabel="Take survey"
            accessibilityRole="button"
        >
            <Image
                source={require('@/assets/img/survey_button.png')}
                className="w-32 h-32"
            />
        </TouchableOpacity>
    );
}