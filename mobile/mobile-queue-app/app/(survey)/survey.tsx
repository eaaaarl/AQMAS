import DismissKeyboard from '@/components/DismissKeyboard';
import { useGetSurveyQuestionQuery, useGetSurveyQuestionsDetailsQuery, useGetSurveyResultQuery } from '@/features/survey/api/surveyApi';
import { SurveyQuestion } from '@/features/survey/interface/surveyQuestion.interface';
import { SurveyResult } from '@/features/survey/interface/surveyQuestionDetail.interface';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SurveyResultsScreen() {
    const [selectedQuestion, setSelectedQuestion] = useState<SurveyQuestion | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const { data: surveyResultData, isLoading, isError } = useGetSurveyResultQuery();
    const { data: surveyQuestion } = useGetSurveyQuestionQuery({
        survey_id: surveyResultData?.results?.[0]?.survey_id as number
    });
    const { data: surveyQuestionDetail } = useGetSurveyQuestionsDetailsQuery({ survey_id: selectedQuestion?.survey_id as number, survey_index: selectedQuestion?.survey_index as number }, {
        skip: !selectedQuestion?.survey_id
    })
    const questionDetail = surveyQuestionDetail?.results || [];

    const handleConfirmBack = () => {
        router.push('/(service)');
    };

    const handleQuestionPress = (question: SurveyQuestion) => {
        setSelectedQuestion(question);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedQuestion(null);
    };

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
                <TouchableOpacity onPress={handleConfirmBack} className="mt-4">
                    <Text className="text-blue-500">Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
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
                                SURVEY{'\n'}RESULTS
                            </Text>
                        </View>
                    </View>
                </View>

                <View className="flex-1 p-4">
                    {surveyQuestion?.length ? (
                        <FlatList
                            data={surveyQuestion}
                            renderItem={({ item }) => (
                                <RenderSurveyQuestion
                                    item={item}
                                    onPress={() => handleQuestionPress(item)}
                                />
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            ListHeaderComponent={
                                <Text className="text-xl font-bold mb-4">Your Survey Responses</Text>
                            }
                            showsVerticalScrollIndicator={false}
                        />
                    ) : (
                        <View className="flex-1 justify-center items-center">
                            <Text className="text-gray-500 text-lg">No survey results available</Text>
                            <TouchableOpacity
                                onPress={() => router.push('/survey')}
                                className="mt-4 bg-blue-500 px-4 py-2 rounded"
                            >
                                <Text className="text-white">Take Survey</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <RenderSurveyQuestionModal
                    visible={modalVisible}
                    question={selectedQuestion}
                    questionDetail={questionDetail}
                    onClose={closeModal}
                />

            </SafeAreaView>
        </DismissKeyboard>
    );
}

interface RenderSurveyQuestionProps {
    item: SurveyQuestion;
    onPress: () => void;
}

export function RenderSurveyQuestion(props: RenderSurveyQuestionProps) {
    const { item, onPress } = props;

    return (
        <TouchableOpacity onPress={onPress} className="mb-4">
            <View className="p-6 rounded-lg bg-white border border-gray-200 shadow-sm">
                <Text className="text-gray-800 font-semibold text-lg mb-2">
                    {item.survey_questions}
                </Text>
                {item.strType && (
                    <View className="flex-row items-center">
                        <View className="bg-blue-100 px-2 py-1 rounded-full">
                            <Text className="text-blue-700 text-sm font-medium">
                                {item.strType}
                            </Text>
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

interface RenderSurveyQuestionModalProps {
    visible: boolean;
    question: SurveyQuestion | null;
    questionDetail: SurveyResult[] | [];
    onClose: () => void;
}

export function RenderSurveyQuestionModal(props: RenderSurveyQuestionModalProps) {
    const { visible, question, onClose, questionDetail } = props;

    console.log(questionDetail)

    if (!question) return null;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <SafeAreaView className="flex-1 bg-white">
                <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
                    <Text className="text-lg font-semibold">Question Details</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={24} color="#374151" />
                    </TouchableOpacity>
                </View>

                <ScrollView className="flex-1 p-4">
                    <View className="mb-6">
                        <Text className="text-sm text-gray-500 mb-2">
                            Question #{question.survey_index}
                        </Text>
                        <Text className="text-xl font-semibold text-gray-800 mb-4">
                            {question.survey_questions}
                        </Text>

                        {question.strType && (
                            <View className="flex-row items-center mb-4">
                                <Text className="text-gray-600 mr-2">Type:</Text>
                                <View className="bg-blue-100 px-3 py-1 rounded-full">
                                    <Text className="text-blue-700 font-medium">
                                        {question.strType}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>

                    <View className="bg-gray-50 p-4 rounded-lg">
                        <Text className="text-lg font-semibold mb-3">Your Response</Text>
                        <View className="bg-white p-4 rounded-lg border border-gray-200">
                            <Text className="text-gray-600">
                                {/*  How to render the answer detail in here */}
                            </Text>
                        </View>
                    </View>

                    <View className="mt-6 space-y-4">
                        <View className="flex-row justify-between items-center py-2">
                            <Text className="text-gray-600">Survey ID:</Text>
                            <Text className="font-medium">{question.survey_id || 'N/A'}</Text>
                        </View>

                        <View className="flex-row justify-between items-center py-2">
                            <Text className="text-gray-600">Question Index:</Text>
                            <Text className="font-medium">{question.survey_index}</Text>
                        </View>
                    </View>
                </ScrollView>

                <View className="p-4 border-t border-gray-200">
                    <TouchableOpacity
                        onPress={onClose}
                        className="bg-blue-500 py-3 px-6 rounded-lg"
                    >
                        <Text className="text-white text-center font-semibold">Close</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </Modal>
    );
}