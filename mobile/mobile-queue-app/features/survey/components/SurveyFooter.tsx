import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface SurveyFooterProps {
    onPrev: () => void;
    onNext: () => void;
    onSubmit: () => void;
    currentQuestionIndex: number;
    canProceed: boolean;
    isLastQuestion: boolean;
}

export default function SurveyFooter(props: SurveyFooterProps) {
    const {
        onPrev,
        onNext,
        onSubmit,
        currentQuestionIndex,
        canProceed,
        isLastQuestion
    } = props;

    return (
        <View className="p-6">
            <View className="flex-row justify-between gap-4">
                <TouchableOpacity
                    className={`flex-1 py-4 px-6 rounded-xl ${currentQuestionIndex > 0
                        ? 'bg-gray-200'
                        : 'bg-gray-100 opacity-50'
                        }`}
                    onPress={onPrev}
                    disabled={currentQuestionIndex === 0}
                >
                    <Text className={`text-center font-semibold ${currentQuestionIndex > 0
                        ? 'text-gray-700'
                        : 'text-gray-400'
                        }`}>
                        Previous
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className={`flex-1 py-4 px-6 rounded-xl ${canProceed
                        ? 'bg-blue-500'
                        : 'bg-gray-300'
                        }`}
                    onPress={isLastQuestion ? onSubmit : onNext}
                    disabled={!canProceed}
                >
                    <Text className={`text-center font-semibold ${canProceed
                        ? 'text-white'
                        : 'text-gray-500'
                        }`}>
                        {isLastQuestion ? 'Submit' : 'Next'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}