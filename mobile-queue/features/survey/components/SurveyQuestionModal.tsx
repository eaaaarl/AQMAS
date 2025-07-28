import { SurveyQuestion } from '@/features/survey/interface/surveyQuestion.interface';
import { SurveyQuestionDetailPayload, SurveyResult } from '@/features/survey/interface/surveyQuestionDetail.interface';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect, useState } from 'react';
import { Modal, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface SurveyQuestionModalProps {
    visible: boolean;
    question: SurveyQuestion | null;
    questionDetail: SurveyResult[];
    onClose: () => void;
    onAnswerSubmit: (answer: SurveyQuestionDetailPayload) => void;
    existingAnswer?: SurveyQuestionDetailPayload;
}

export function SurveyQuestionModal(props: SurveyQuestionModalProps) {
    const { visible, question, onClose, questionDetail, onAnswerSubmit, existingAnswer } = props;
    const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
    const [textResponse, setTextResponse] = useState<string>('');

    useEffect(() => {
        if (existingAnswer && question) {
            const questionType = getQuestionType();

            if (questionType === 'text') {
                setTextResponse(existingAnswer.survey_answer || '');
                setSelectedAnswer(null);
            } else {
                setSelectedAnswer(existingAnswer.survey_answer || null);
                setTextResponse('');
            }
        } else {
            setSelectedAnswer(null);
            setTextResponse('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [question?.survey_index, existingAnswer]);

    if (!question) return null;

    const getQuestionType = () => {
        // First check survey_type (most reliable)
        if (question.survey_type !== undefined) {
            switch (question.survey_type) {
                case 0: return 'yesno';      // Yes/No questions
                case 1: return 'multiple';   // Multiple choice questions
                case 2: return 'text';       // Text/Commentary questions
                default: return 'multiple';
            }
        }

        // Fallback to strType if survey_type is not available
        if (question.strType) {
            const type = question.strType.toLowerCase();
            if (type.includes('yes') || type.includes('no')) {
                return 'yesno';
            } else if (type.includes('commentary') || type.includes('text') || type.includes('comment')) {
                return 'text';
            } else if (type.includes('multiple')) {
                return 'multiple';
            }
        }

        // Final fallback: detect based on questionDetail content
        if (questionDetail.length === 0) return 'text';
        if (questionDetail.length === 2 &&
            questionDetail.some(qd => qd.survey_choice?.toLowerCase().includes('yes') || qd.survey_choice?.toLowerCase().includes('no'))) {
            return 'yesno';
        }
        return 'multiple';
    };

    const questionType = getQuestionType();

    const handleSubmit = () => {
        let answerPayload: SurveyQuestionDetailPayload;

        if (questionType === 'yesno') {
            answerPayload = {
                choice_index: selectedAnswer === 'Yes' ? 'Y' : 'N',
                survey_index: question.survey_index,
                survey_id: question.survey_id,
                survey_answer: selectedAnswer
            };
        } else if (questionType === 'multiple') {
            const selectedDetail = questionDetail.find(qd => qd.survey_choice === selectedAnswer);
            answerPayload = {
                choice_index: String(selectedDetail?.choice_index || 0),
                survey_index: question.survey_index,
                survey_id: question.survey_id,
                survey_answer: selectedAnswer
            };
        } else if (questionType === 'text') {
            answerPayload = {
                choice_index: questionDetail?.[0]?.choice_index || '1',
                survey_index: question.survey_index,
                survey_id: question.survey_id,
                survey_answer: textResponse
            };
        } else {
            return;
        }

        onAnswerSubmit(answerPayload);
    };

    const canSubmit = selectedAnswer || textResponse.trim();

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <SafeAreaView className="flex-1 bg-gray-50">
                <View className="bg-white px-6 py-4 border-b border-gray-100">
                    <View className="flex-row items-center justify-between">
                        <View>
                            <Text className="text-sm text-gray-400 font-medium">
                                Question {question.survey_index}
                            </Text>
                            <Text className="text-lg font-bold text-gray-900 mt-1">
                                Survey Details
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={onClose}
                            className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
                        >
                            <Ionicons name="close" size={20} color="#6B7280" />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    <View className="bg-white mx-4 mt-4 rounded-xl p-6 shadow-sm">
                        <Text className="text-lg font-semibold text-gray-900 leading-6">
                            {question.survey_questions}
                        </Text>

                        {question.strType && (
                            <View className="mt-4">
                                <Text className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">
                                    Question Type
                                </Text>
                                <View className="self-start bg-blue-50 px-3 py-2 rounded-lg">
                                    <Text className="text-blue-700 font-medium text-sm">
                                        {question.strType}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>

                    <View className="mx-4 mt-4">
                        <Text className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-3 px-2">
                            Answer Options
                        </Text>

                        {/* Dynamic Question Rendering */}
                        {questionType === 'yesno' && (
                            <View className="gap-4">
                                {/* Always use default Yes/No for survey_type 0 since API returns empty survey_choice */}
                                <TouchableOpacity
                                    onPress={() => setSelectedAnswer('Yes')}
                                    className={`bg-white rounded-xl p-4 shadow-sm border active:scale-95 ${selectedAnswer === 'Yes' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                                        }`}
                                >
                                    <View className="flex-row items-center">
                                        <View className={`w-5 h-5 rounded-full items-center justify-center mr-3 ${selectedAnswer === 'Yes' ? 'bg-green-500' : 'bg-gray-300'
                                            }`}>
                                            <Ionicons name="checkmark" size={14} color="white" />
                                        </View>
                                        <Text className={`font-medium ${selectedAnswer === 'Yes' ? 'text-green-700' : 'text-gray-900'
                                            }`}>Yes</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => setSelectedAnswer('No')}
                                    className={`bg-white rounded-xl p-4 shadow-sm border active:scale-95 ${selectedAnswer === 'No' ? 'border-red-500 bg-red-50' : 'border-gray-200'
                                        }`}
                                >
                                    <View className="flex-row items-center">
                                        <View className={`w-5 h-5 rounded-full items-center justify-center mr-3 ${selectedAnswer === 'No' ? 'bg-red-500' : 'bg-gray-300'
                                            }`}>
                                            <Ionicons name="close" size={14} color="white" />
                                        </View>
                                        <Text className={`font-medium ${selectedAnswer === 'No' ? 'text-red-700' : 'text-gray-900'
                                            }`}>No</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )}

                        {questionType === 'multiple' && (
                            <View className="gap-4">
                                {questionDetail.map((qd, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => setSelectedAnswer(qd.survey_choice)}
                                        className={`bg-white rounded-xl p-4 shadow-sm border active:scale-95 ${selectedAnswer === qd.survey_choice ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                            }`}
                                    >
                                        <View className="flex-row items-center">
                                            <View className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${selectedAnswer === qd.survey_choice
                                                ? 'border-blue-500 bg-blue-500'
                                                : 'border-gray-300'
                                                }`}>
                                                {selectedAnswer === qd.survey_choice && (
                                                    <View className="w-2 h-2 rounded-full bg-white" />
                                                )}
                                            </View>
                                            <Text className={`font-medium ${selectedAnswer === qd.survey_choice ? 'text-blue-700' : 'text-gray-900'}`}>{qd.choice_index}.</Text>
                                            <Text className={`font-medium flex-1 ${selectedAnswer === qd.survey_choice ? 'text-blue-700' : 'text-gray-900'
                                                }`}>
                                                {qd.survey_choice}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {questionType === 'text' && (
                            <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                                <Text className="text-sm text-gray-500 mb-3">Your Response</Text>
                                <TextInput
                                    value={textResponse}
                                    onChangeText={setTextResponse}
                                    placeholder="Share your thoughts..."
                                    multiline
                                    numberOfLines={4}
                                    className="text-gray-900 text-base leading-6 min-h-24"
                                    placeholderTextColor="#9CA3AF"
                                    textAlignVertical="top"
                                />
                                {textResponse.length > 0 && (
                                    <Text className="text-xs text-gray-400 mt-2">
                                        {textResponse.length} characters
                                    </Text>
                                )}
                            </View>
                        )}
                    </View>
                </ScrollView>

                <View className="bg-white px-6 py-4 border-t border-gray-100">
                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={!canSubmit}
                        className={`py-4 rounded-xl shadow-sm active:scale-95 ${canSubmit ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                    >
                        <Text className={`text-center font-semibold text-base ${canSubmit ? 'text-white' : 'text-gray-500'
                            }`}>
                            {canSubmit ? 'Submit Answer' : 'Select an Answer'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onClose}
                        className="mt-3 py-3"
                    >
                        <Text className="text-gray-500 text-center font-medium">
                            Close
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </Modal>
    );
} 