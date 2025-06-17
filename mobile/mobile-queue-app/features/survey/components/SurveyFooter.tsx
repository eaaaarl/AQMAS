import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useSurvey } from '../hooks/useSurvey'


export default function SurveyFooter() {
    const { handleSubmit, currentQuestion, handlePrevious, handleNext, isLastQuestion, canGoNext } = useSurvey()
    return (
        <View className="flex-row justify-between items-center px-8 pb-8">
            <TouchableOpacity
                className={`py-4 px-8 rounded-xl ${currentQuestion === 0 ? 'bg-gray-200' : 'bg-gray-600'
                    }`}
                onPress={handlePrevious}
                disabled={currentQuestion === 0}
            >
                <Text className={`font-bold text-lg ${currentQuestion === 0 ? 'text-gray-400' : 'text-white'
                    }`}>
                    Previous
                </Text>
            </TouchableOpacity>

            {isLastQuestion ? (
                <TouchableOpacity
                    className="py-4 px-8 rounded-xl bg-green-600"
                    onPress={handleSubmit}
                >
                    <Text className="text-white font-bold text-lg">Submit</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    className={`py-4 px-8 rounded-xl ${canGoNext() ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                    onPress={handleNext}
                    disabled={!canGoNext()}
                >
                    <Text className={`font-bold text-lg ${canGoNext() ? 'text-white' : 'text-gray-500'
                        }`}>
                        Next
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    )
}