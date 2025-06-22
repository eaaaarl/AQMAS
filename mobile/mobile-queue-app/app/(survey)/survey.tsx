import DismissKeyboard from '@/components/DismissKeyboard';
import { CustomerFormModal, SurveyContent, SurveyLayout, SurveyQuestionModal } from '@/features/survey/components';
import { useSurvey } from '@/features/survey/hooks/useSurvey';
import React from 'react';

export default function SurveyResultsScreen() {
    const {
        // State
        selectedQuestion,
        modalVisible,
        surveyAnswers,
        openCustomerForm,
        customerFormData,
        isLoading,
        isError,
        questionDetail,
        randomQuestions,
        isAllQuestionsAnswered,
        displayQuestions,
        isLoadingSurvey,
        isLoadingSurveyDetail,

        // Actions
        handleConfirmBack,
        handleQuestionPress,
        handleAnswerSubmit,
        handleOpenCustomerFormModal,
        handleCloseCustomerFormModal,
        handleCustomerFormChange,
        handleCustomerFormConfirm,
        getQuestionType,

        // Setters
        setModalVisible
    } = useSurvey();

    return (
        <DismissKeyboard>
            <SurveyLayout
                isLoading={isLoading}
                isError={isError}
                onBackPress={handleConfirmBack}
            >
                <SurveyContent
                    displayQuestions={displayQuestions}
                    surveyAnswers={surveyAnswers}
                    randomQuestions={randomQuestions}
                    isAllQuestionsAnswered={isAllQuestionsAnswered}
                    onQuestionPress={handleQuestionPress}
                    onOpenCustomerForm={handleOpenCustomerFormModal}
                    getQuestionType={getQuestionType}
                />

                <SurveyQuestionModal
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
            </SurveyLayout>
        </DismissKeyboard>
    );
}