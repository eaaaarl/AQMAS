import { SurveyQuestion as SurveyQuestionType } from '@/features/survey/interface/surveyQuestion.interface';
import { SurveyQuestionDetailPayload } from '@/features/survey/interface/surveyQuestionDetail.interface';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface SurveyQuestionProps {
    item: SurveyQuestionType;
    displayIndex?: number;
    onPress: () => void;
    isAnswered?: boolean;
    isRandomized?: boolean;
    currentAnswer?: SurveyQuestionDetailPayload;
    questionType?: string;
}

export function SurveyQuestion(props: SurveyQuestionProps) {
    const { item, displayIndex, onPress, isAnswered, isRandomized, currentAnswer, questionType } = props;

    return (
        <TouchableOpacity onPress={onPress} className="mb-4">
            <View className={`p-6 rounded-lg bg-white border shadow-sm ${isAnswered ? 'border-gray-200 bg-gray-50' : 'border-gray-200'
                }`}>
                <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1 mr-2">
                        <View className="flex-row items-center mb-2">
                            <View className="bg-gray-100 rounded-full px-2 py-1 mr-2">
                                <Text className="text-gray-600 text-xs font-medium">
                                    {isRandomized ? `#${displayIndex}` : `Q${item.survey_index}`}
                                </Text>
                            </View>

                            {isRandomized && (
                                <View className="bg-yellow-100 rounded-full px-2 py-1 mr-2">
                                    <Text className="text-yellow-700 text-xs font-medium">
                                        Originally Q{item.survey_index}
                                    </Text>
                                </View>
                            )}
                        </View>

                        <Text className="text-gray-800 font-semibold text-lg">
                            {item.survey_questions}
                        </Text>
                    </View>

                    {isAnswered && (
                        <View className="bg-yellow-500 rounded-full p-1">
                            <Ionicons name="checkmark" size={16} color="white" />
                        </View>
                    )}
                </View>

                {item.strType && (
                    <View className="flex-row items-center mb-3">
                        <View className="bg-blue-100 px-2 py-1 rounded-full">
                            <Text className="text-blue-700 text-sm font-medium">
                                {item.strType}
                            </Text>
                        </View>
                    </View>
                )}

                {/* Display Answer Preview (except for text/commentary questions) */}
                {isAnswered && currentAnswer && questionType !== 'text' && (
                    <View className="mt-3 p-3 bg-yellow-100 rounded-lg border border-yellow-200">
                        <View className="flex-row items-center mb-1">
                            <Ionicons name="chatbubble-ellipses" size={14} color="#CA8A04" />
                            <Text className="text-yellow-700 text-xs font-medium ml-1 uppercase tracking-wide">
                                Your Answer
                            </Text>
                        </View>
                        <Text className="text-yellow-800 font-medium">
                            {currentAnswer.survey_answer}
                        </Text>
                    </View>
                )}

                {/* Show indicator for text questions that they have been answered */}
                {isAnswered && currentAnswer && questionType === 'text' && (
                    <View className="mt-3 p-3 bg-yellow-100 rounded-lg border border-yellow-200">
                        <View className="flex-row items-center">
                            <Ionicons name="document-text" size={14} color="#CA8A04" />
                            <Text className="text-yellow-700 text-xs font-medium ml-1 uppercase tracking-wide">
                                Commentary Provided
                            </Text>
                            <View className="ml-auto bg-yellow-500 rounded-full px-2 py-1">
                                <Text className="text-white text-xs font-medium">
                                    {currentAnswer.survey_answer?.length || 0} chars
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

                <View className="flex-row items-center justify-between mt-3">
                    <Text className="text-gray-500 text-sm">
                        Choices: #{item.no_of_choices}
                    </Text>
                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </View>
            </View>
        </TouchableOpacity>
    );
} 