import { useAppDispatch, useAppSelector } from "@/libs/redux/hooks";
import { nextQuestion, previousQuestion, resetSurvey, setAnswer } from "@/libs/redux/state/surveySlice";
import { useMemo } from "react";
import { Alert } from "react-native";
import { useGetSurveyQuestionQuery, useGetSurveyQuestionsDetailsQuery, useGetSurveyResultQuery } from "../api/surveyApi";

export const useSurvey = () => {
    const dispatch = useAppDispatch();
    const { currentQuestionIndex, answers } = useAppSelector((state) => state.survey);
    const { data: SurveyResult } = useGetSurveyResultQuery();
    const survey = SurveyResult?.results?.[0];
    const { data: surveyQuestions = [] } = useGetSurveyQuestionQuery(
        { survey_id: survey?.survey_id as number },
        { skip: !survey?.survey_id }
    );

    const { data: surveyQuestionDetail } = useGetSurveyQuestionsDetailsQuery(
        {
            survey_id: surveyQuestions?.[0]?.survey_id,
            survey_index: surveyQuestions?.[1]?.survey_index
        },
        {
            skip: !(surveyQuestions?.[0]?.survey_id && surveyQuestions?.[1]?.survey_index)
        }
    );

    const surveyQuestionDetails = surveyQuestionDetail?.results || [];
    const currentQuestion = surveyQuestions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === surveyQuestions.length - 1;

    const canProceed = useMemo(() => {
        if (!currentQuestion) return false;
        const currentAnswer = answers[currentQuestion.survey_index];

        if (currentQuestion.survey_type === 0 || currentQuestion.survey_type === 1) {
            return !!currentAnswer && currentAnswer.trim() !== '';
        }
        return currentQuestion.survey_type === 2;
    }, [currentQuestion, answers]);

    const handleAnswer = (answer: string) => {
        if (!currentQuestion) return;
        dispatch(setAnswer({ answer, questionIndex: currentQuestion.survey_index }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < surveyQuestions.length - 1) {
            dispatch(nextQuestion());
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            dispatch(previousQuestion());
        }
    };

    const validateSurvey = () => {
        const requiredQuestions = surveyQuestions.filter(q => q.survey_type !== 2);
        const allRequiredAnswered = requiredQuestions.every(q => !!answers[q.survey_index]);

        if (!allRequiredAnswered) {
            Alert.alert('Please answer all required questions');
            return false;
        }
        return true;
    };

    const handleResetSurvey = () => {
        dispatch(resetSurvey())
    }

    const handleSubmit = async (customerData: any) => {
        if (!validateSurvey()) return;
        try {
            console.log('Submitting survey with:', { answers, customerData });
        } catch {
            Alert.alert('Submission failed', 'Please try again');
        }
    };

    return {
        surveyQuestionDetails,
        surveyQuestions,
        currentQuestionIndex,
        currentQuestion,
        answers,
        isLastQuestion,
        canProceed,
        handleAnswer,
        handleNext,
        handlePrevious,
        handleSubmit,
        handleResetSurvey
    };
};