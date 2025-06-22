import { SurveyQuestion as SurveyQuestionType } from '@/features/survey/interface/surveyQuestion.interface';
import { SurveyQuestionDetailPayload } from '@/features/survey/interface/surveyQuestionDetail.interface';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SurveyQuestion } from './SurveyQuestion';

interface SurveyContentProps {
    displayQuestions: SurveyQuestionType[];
    surveyAnswers: SurveyQuestionDetailPayload[];
    randomQuestions: any;
    isAllQuestionsAnswered: boolean;
    onQuestionPress: (question: SurveyQuestionType) => void;
    onOpenCustomerForm: () => void;
    getQuestionType: (question: SurveyQuestionType) => string;
}

export function SurveyContent({
    displayQuestions,
    surveyAnswers,
    randomQuestions,
    isAllQuestionsAnswered,
    onQuestionPress,
    onOpenCustomerForm,
    getQuestionType
}: SurveyContentProps) {
    if (!displayQuestions?.length) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-gray-500 text-lg">No survey results available</Text>
            </View>
        );
    }

    return (
        <>
            <FlatList
                data={displayQuestions}
                renderItem={({ item, index }) => {
                    const currentAnswer = surveyAnswers.find(answer => answer.survey_index === item.survey_index);
                    const questionType = getQuestionType(item);

                    return (
                        <SurveyQuestion
                            item={item}
                            displayIndex={index + 1}
                            onPress={() => onQuestionPress(item)}
                            isAnswered={!!currentAnswer}
                            isRandomized={!!randomQuestions}
                            currentAnswer={currentAnswer}
                            questionType={questionType}
                        />
                    );
                }}
                keyExtractor={(item, index) => `${item.survey_index}-${index}`}
                ListHeaderComponent={
                    <Text className="text-xl font-bold mb-4">
                        Your Survey Responses
                        {randomQuestions && (
                            <Text className="text-sm text-gray-500 font-normal">
                                {'\n'}Questions are presented in random order
                            </Text>
                        )}
                    </Text>
                }
                showsVerticalScrollIndicator={false}
            />

            {isAllQuestionsAnswered && (
                <View className='justify-center items-center my-4'>
                    <TouchableOpacity
                        onPress={onOpenCustomerForm}
                        className='w-56 rounded-lg p-6 bg-blue-600 items-center'
                    >
                        <Text className='text-white font-semibold'>Submit</Text>
                    </TouchableOpacity>
                </View>
            )}
        </>
    );
} 