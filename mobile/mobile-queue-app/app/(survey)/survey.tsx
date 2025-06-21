import DismissKeyboard from '@/components/DismissKeyboard';
import {
    useCreateSurveyAnswerMutation,
    useCreateSurveyDetailAnswerMutation,
    useGetSurveyQuestionQuery,
    useGetSurveyQuestionsDetailsQuery,
    useGetSurveyResultQuery
} from '@/features/survey/api/surveyApi';
import CustomerFormModal from '@/features/survey/components/CustomerFormModal';
import { SurveyAnswerPayload } from '@/features/survey/interface/survey.interface';
import { SurveyQuestion } from '@/features/survey/interface/surveyQuestion.interface';
import {
    SurveyQuestionDetailPayload,
    SurveyResult
} from '@/features/survey/interface/surveyQuestionDetail.interface';
import { shuffleArray } from '@/features/survey/utils/shuffleArray';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function SurveyResultsScreen() {
    const [selectedQuestion, setSelectedQuestion] = useState<SurveyQuestion | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [surveyAnswers, setSurveyAnswers] = useState<SurveyQuestionDetailPayload[]>([])
    const [openCustomerForm, setOpenCustomerForm] = useState(false);

    const [customerFormData, setCustomerFormData] = useState({
        name: '',
        address: '',
        contact: '',
        reference: ''
    })

    const { data: surveyResultData, isLoading, isError } = useGetSurveyResultQuery();
    const { data: surveyQuestion } = useGetSurveyQuestionQuery({
        survey_id: surveyResultData?.results?.[0]?.survey_id as number
    });
    const { data: surveyQuestionDetail } = useGetSurveyQuestionsDetailsQuery({
        survey_id: selectedQuestion?.survey_id as number,
        survey_index: selectedQuestion?.survey_index as number
    }, {
        skip: !selectedQuestion?.survey_id
    })

    const randomQuestions = surveyResultData?.results.find((srd) => srd.random_questions.data?.[0] === 1)
    const questionDetail = surveyQuestionDetail?.results || [];
    const isAllQuestionsAnswered = surveyQuestion?.length === surveyAnswers.length;

    const displayQuestions = useMemo(() => {
        if (!surveyQuestion?.length) return [];

        // If random questions is enabled (value is 1), shuffle the questions
        if (randomQuestions) {
            console.log('Random questions enabled - shuffling questions');
            return shuffleArray(surveyQuestion);
        }

        // Otherwise return original order
        console.log('Random questions disabled - using original order');
        return surveyQuestion;
    }, [surveyQuestion, randomQuestions]);

    const [createSurveyInfo, { isLoading: isLoadingSurvey }] = useCreateSurveyAnswerMutation();
    const [createSurveyDetail, { isLoading: isLoadingSurveyDetail }] = useCreateSurveyDetailAnswerMutation()

    const handleConfirmBack = () => {
        router.push('/(service)');
    };

    const handleQuestionPress = (question: SurveyQuestion) => {
        setSelectedQuestion(question);
        setModalVisible(true);
    };

    const handleAnswerSubmit = (answer: SurveyQuestionDetailPayload) => {
        setSurveyAnswers(prev => {
            const filteredAnswers = prev.filter(item => item.survey_index !== answer.survey_index);

            const newAnswer = {
                choice_index: answer.choice_index,
                survey_index: answer.survey_index,
                survey_id: answer.survey_id,
                survey_answer: answer.survey_answer
            };

            return [...filteredAnswers, newAnswer];
        });
        setModalVisible(false);
    };

    const handleOpenCustomerFormModal = () => {
        setOpenCustomerForm(true)
    }

    const handleCloseCustomerFormModal = () => {
        setOpenCustomerForm(false)
    }

    const handleCustomerFormChange = (field: string, value: string) => {
        setCustomerFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleCustomerFormConfirm = async () => {
        try {
            const payload: SurveyAnswerPayload = {
                repondent_name: customerFormData.name,
                respondent_ref: customerFormData.reference,
                respondent_telno: customerFormData.contact,
                respondent_address: customerFormData.address
            }

            const res = await createSurveyInfo(payload)

            const payloadDetail: SurveyQuestionDetailPayload[] = surveyAnswers.map((sv) => ({
                repondent_index: res.data?.answerId,
                choice_index: sv.choice_index,
                survey_answer: sv.survey_answer,
                survey_id: sv.survey_id,
                survey_index: sv.survey_index
            }))

            await createSurveyDetail(payloadDetail)

            Toast.show({
                type: 'success',
                text1: 'Thank you for your feedback!',
                text2: 'Your survey has been submitted successfully'
            })

            setOpenCustomerForm(false);
            setCustomerFormData({
                name: '',
                address: '',
                contact: '',
                reference: ''
            });
            setSurveyAnswers([])
            router.push('/(service)');
        } catch (error) {
            console.log(error)
            Toast.show({
                type: 'error',
                text1: 'Something went wrong!',
                text2: 'Failed to submit survey, please try again'
            })
        }
    };

    const getQuestionType = (question: SurveyQuestion) => {
        if (question.survey_type !== undefined) {
            switch (question.survey_type) {
                case 0: return 'yesno';
                case 1: return 'multiple';
                case 2: return 'text';
                default: return 'multiple';
            }
        }

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

        return 'multiple';
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

                        {randomQuestions && (
                            <View className="mt-2 bg-yellow-500 px-3 py-1 rounded-full">
                                <Text className="text-white text-xs font-medium">
                                    🎲 Random Order
                                </Text>
                            </View>
                        )}

                    </View>
                </View>

                <View className="flex-1 p-4">
                    {displayQuestions?.length ? (
                        <FlatList
                            data={displayQuestions}
                            renderItem={({ item, index }) => {
                                const currentAnswer = surveyAnswers.find(answer => answer.survey_index === item.survey_index);
                                const questionType = getQuestionType(item);

                                return (
                                    <RenderSurveyQuestion
                                        item={item}
                                        displayIndex={index + 1}
                                        onPress={() => handleQuestionPress(item)}
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

                {isAllQuestionsAnswered && (
                    <View className='justify-center items-center my-4'>
                        <TouchableOpacity
                            onPress={handleOpenCustomerFormModal}
                            className='w-56 rounded-lg p-6 bg-blue-600 items-center'
                        >
                            <Text className='text-white font-semibold'>Submit</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <RenderSurveyQuestionModal
                    visible={modalVisible}
                    question={selectedQuestion}
                    questionDetail={questionDetail}
                    onClose={() => setModalVisible(false)}
                    onAnswerSubmit={handleAnswerSubmit}
                    existingAnswer={selectedQuestion ? surveyAnswers.find(answer => answer.survey_index === selectedQuestion.survey_index) : undefined}
                />

                <CustomerFormModal
                    isOpen={openCustomerForm}
                    onCancel={handleCloseCustomerFormModal}
                    formData={customerFormData}
                    onFormChange={handleCustomerFormChange}
                    onConfirm={handleCustomerFormConfirm}
                    isLoading={isLoadingSurvey || isLoadingSurveyDetail}
                />
            </SafeAreaView>
        </DismissKeyboard>
    );
}

interface RenderSurveyQuestionProps {
    item: SurveyQuestion;
    displayIndex?: number;
    onPress: () => void;
    isAnswered?: boolean;
    isRandomized?: boolean;
    currentAnswer?: SurveyQuestionDetailPayload;
    questionType?: string;
}

export function RenderSurveyQuestion(props: RenderSurveyQuestionProps) {
    const { item, displayIndex, onPress, isAnswered, isRandomized, currentAnswer, questionType } = props;
    return (
        <TouchableOpacity onPress={onPress} className="mb-4">
            <View className={`p-6 rounded-lg bg-white border shadow-sm ${isAnswered ? 'border-green-200 bg-green-50' : 'border-gray-200'
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
                        <View className="bg-green-500 rounded-full p-1">
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
                    <View className="mt-3 p-3 bg-green-100 rounded-lg border border-green-200">
                        <View className="flex-row items-center mb-1">
                            <Ionicons name="chatbubble-ellipses" size={14} color="#059669" />
                            <Text className="text-green-700 text-xs font-medium ml-1 uppercase tracking-wide">
                                Your Answer
                            </Text>
                        </View>
                        <Text className="text-green-800 font-medium">
                            {currentAnswer.survey_answer}
                        </Text>
                    </View>
                )}

                {/* Show indicator for text questions that they have been answered */}
                {isAnswered && currentAnswer && questionType === 'text' && (
                    <View className="mt-3 p-3 bg-blue-100 rounded-lg border border-blue-200">
                        <View className="flex-row items-center">
                            <Ionicons name="document-text" size={14} color="#2563eb" />
                            <Text className="text-blue-700 text-xs font-medium ml-1 uppercase tracking-wide">
                                Commentary Provided
                            </Text>
                            <View className="ml-auto bg-blue-500 rounded-full px-2 py-1">
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

interface RenderSurveyQuestionModalProps {
    visible: boolean;
    question: SurveyQuestion | null;
    questionDetail: SurveyResult[];
    onClose: () => void;
    onAnswerSubmit: (answer: SurveyQuestionDetailPayload) => void;
    existingAnswer?: SurveyQuestionDetailPayload;
}

export function RenderSurveyQuestionModal(props: RenderSurveyQuestionModalProps) {
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