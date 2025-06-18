import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SurveyQuestion, SurveyResult } from '../api/interface';


interface RenderQuestionProps {
    currentQuestion: SurveyQuestion | undefined;
    answers: Record<number, string | null>;
    handleAnswer: (answer: string) => void;
    surveyQuestionDetails: SurveyResult[]
}

export default function RenderQuestion(props: RenderQuestionProps) {
    const {
        answers,
        currentQuestion,
        handleAnswer,
        surveyQuestionDetails
    } = props;

    if (!currentQuestion) {
        return null;
    }

    const currentAnswer = answers[currentQuestion.survey_index];

    const onAnswerPress = (answer: string) => {
        handleAnswer(answer);
    };


    switch (currentQuestion.survey_type) {
        case 0: // Yes/No
            return (
                <View className="flex-1 justify-center px-8">
                    <Text className="text-3xl font-bold text-center mb-12">
                        {currentQuestion.survey_questions}
                    </Text>
                    <View className="flex-row gap-6">
                        <TouchableOpacity
                            className={`flex-1 py-8 px-6 rounded-2xl border-2 ${currentAnswer === 'yes' ? 'bg-green-500 border-green-500' : 'bg-white border-gray-200'
                                }`}
                            onPress={() => onAnswerPress('yes')}
                        >
                            <Text className={`text-center font-bold text-2xl ${currentAnswer === 'yes' ? 'text-white' : 'text-gray-700'
                                }`}>
                                Yes
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className={`flex-1 py-8 px-6 rounded-2xl border-2 ${currentAnswer === 'no' ? 'bg-red-500 border-red-500' : 'bg-white border-gray-200'
                                }`}
                            onPress={() => onAnswerPress('no')}
                        >
                            <Text className={`text-center font-bold text-2xl ${currentAnswer === 'no' ? 'text-white' : 'text-gray-700'
                                }`}>
                                No
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );

        case 1: // Multiple Choice
            return (
                <View className="flex-1 justify-center px-8">
                    <Text className="text-3xl font-bold text-center mb-12">
                        {currentQuestion.survey_questions}
                    </Text>
                    <View className="gap-4">
                        {surveyQuestionDetails.map((sqd) => (
                            <TouchableOpacity
                                key={sqd.choice_index}
                                className={`py-6 px-8 rounded-2xl border-2 ${currentAnswer === sqd.survey_choice ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-200'
                                    }`}
                                onPress={() => onAnswerPress(sqd.survey_choice)}
                            >
                                <Text className={`font-bold text-xl ${currentAnswer === sqd.survey_choice ? 'text-white' : 'text-gray-700'
                                    }`}>
                                    {sqd.survey_choice}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            );

        case 2: // Commentary
            return (
                <View className="flex-1 justify-center px-8">
                    <Text className="text-3xl font-bold text-center mb-12">
                        {currentQuestion.survey_questions}
                    </Text>
                    <TextInput
                        className="bg-white border-2 border-gray-200 rounded-2xl p-6 h-40 text-lg"
                        placeholder="Your comments..."
                        value={currentAnswer || ''}
                        onChangeText={(text) => {
                            handleAnswer(text);
                        }}
                        multiline
                        textAlignVertical="top"
                    />
                </View>
            );

        default:
            return null;
    }
}