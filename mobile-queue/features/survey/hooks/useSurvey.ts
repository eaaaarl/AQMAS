import {
    useCreateSurveyAnswerMutation,
    useCreateSurveyDetailAnswerMutation,
    useGetSurveyQuestionQuery,
    useGetSurveyQuestionsDetailsQuery,
    useGetSurveyResultQuery,
} from "@/features/survey/api/surveyApi";
import { SurveyAnswerPayload } from "@/features/survey/interface/survey.interface";
import { SurveyQuestion } from "@/features/survey/interface/surveyQuestion.interface";
import { SurveyQuestionDetailPayload } from "@/features/survey/interface/surveyQuestionDetail.interface";
import { shuffleArray } from "@/features/survey/utils/shuffleArray";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import Toast from "react-native-toast-message";

export const useSurvey = () => {
  const [selectedQuestion, setSelectedQuestion] =
    useState<SurveyQuestion | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [surveyAnswers, setSurveyAnswers] = useState<
    SurveyQuestionDetailPayload[]
  >([]);
  const [openCustomerForm, setOpenCustomerForm] = useState(false);

  const [customerFormData, setCustomerFormData] = useState({
    name: "",
    address: "",
    contact: "",
    reference: "",
  });

  const {
    data: surveyResultData,
    isLoading,
    isError,
  } = useGetSurveyResultQuery();
  const { data: surveyQuestion } = useGetSurveyQuestionQuery({
    survey_id: surveyResultData?.results?.[0]?.survey_id as number,
  });
  const { data: surveyQuestionDetail } = useGetSurveyQuestionsDetailsQuery(
    {
      survey_id: selectedQuestion?.survey_id as number,
      survey_index: selectedQuestion?.survey_index as number,
    },
    {
      skip: !selectedQuestion?.survey_id,
    }
  );

  const randomQuestions = surveyResultData?.results.find(
    (srd) => srd.random_questions.data?.[0] === 1
  );
  const questionDetail = surveyQuestionDetail?.results || [];
  const isAllQuestionsAnswered =
    surveyQuestion?.length === surveyAnswers.length;

  const displayQuestions = useMemo(() => {
    if (!surveyQuestion?.length) return [];

    // If random questions is enabled (value is 1), shuffle the questions
    if (randomQuestions) {
      console.log("Random questions enabled - shuffling questions");
      return shuffleArray(surveyQuestion);
    }

    // Otherwise return original order
    console.log("Random questions disabled - using original order");
    return surveyQuestion;
  }, [surveyQuestion, randomQuestions]);

  const [createSurveyInfo, { isLoading: isLoadingSurvey }] =
    useCreateSurveyAnswerMutation();
  const [createSurveyDetail, { isLoading: isLoadingSurveyDetail }] =
    useCreateSurveyDetailAnswerMutation();

  const handleConfirmBack = () => {
    router.push("/(service)");
  };

  const handleQuestionPress = (question: SurveyQuestion) => {
    setSelectedQuestion(question);
    setModalVisible(true);
  };

  const handleAnswerSubmit = (answer: SurveyQuestionDetailPayload) => {
    setSurveyAnswers((prev) => {
      const filteredAnswers = prev.filter(
        (item) => item.survey_index !== answer.survey_index
      );

      const newAnswer = {
        choice_index: answer.choice_index,
        survey_index: answer.survey_index,
        survey_id: answer.survey_id,
        survey_answer: answer.survey_answer,
      };

      return [...filteredAnswers, newAnswer];
    });
    setModalVisible(false);
  };

  const handleOpenCustomerFormModal = () => {
    setOpenCustomerForm(true);
  };

  const handleCloseCustomerFormModal = () => {
    setOpenCustomerForm(false);
  };

  const handleCustomerFormChange = (field: string, value: string) => {
    setCustomerFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCustomerFormConfirm = async () => {
    try {
      const payload: SurveyAnswerPayload = {
        repondent_name: customerFormData.name,
        respondent_ref: customerFormData.reference,
        respondent_telno: customerFormData.contact,
        respondent_address: customerFormData.address,
      };

      const res = await createSurveyInfo(payload);

      const payloadDetail: SurveyQuestionDetailPayload[] = surveyAnswers.map(
        (sv) => ({
          repondent_index: res.data?.answerId,
          choice_index: sv.choice_index,
          survey_answer: sv.survey_answer,
          survey_id: sv.survey_id,
          survey_index: sv.survey_index,
        })
      );

      await createSurveyDetail(payloadDetail);

      Toast.show({
        type: "success",
        text1: "Thank you for your feedback!",
        text2: "Your survey has been submitted successfully",
      });

      setOpenCustomerForm(false);
      setCustomerFormData({
        name: "",
        address: "",
        contact: "",
        reference: "",
      });
      setSurveyAnswers([]);
      router.push("/(service)");
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Something went wrong!",
        text2: "Failed to submit survey, please try again",
      });
    }
  };

  const getQuestionType = (question: SurveyQuestion) => {
    if (question.survey_type !== undefined) {
      switch (question.survey_type) {
        case 0:
          return "yesno";
        case 1:
          return "multiple";
        case 2:
          return "text";
        default:
          return "multiple";
      }
    }

    if (question.strType) {
      const type = question.strType.toLowerCase();
      if (type.includes("yes") || type.includes("no")) {
        return "yesno";
      } else if (
        type.includes("commentary") ||
        type.includes("text") ||
        type.includes("comment")
      ) {
        return "text";
      } else if (type.includes("multiple")) {
        return "multiple";
      }
    }

    return "multiple";
  };

  return {
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
    setModalVisible,
  };
};
