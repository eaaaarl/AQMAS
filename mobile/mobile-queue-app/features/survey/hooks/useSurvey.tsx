import { useState } from "react";
import { Alert } from "react-native";

export const useSurvey = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [satisfaction, setSatisfaction] = useState(null);
    const [branch, setBranch] = useState(null);
    const [comment, setComment] = useState('');

    const questions = [
        {
            id: 1,
            question: "Are you satisfied with our service?",
            type: "yesno"
        },
        {
            id: 2,
            question: "Which branch is the most reactive?",
            type: "choice"
        },
        {
            id: 3,
            question: "What is your comment about this branch?",
            type: "text"
        }
    ];

    const isLastQuestion = currentQuestion === questions.length - 1;
    const canGoNext = () => {
        if (currentQuestion === 0) return satisfaction !== null;
        if (currentQuestion === 1) return branch !== null;
        return true;
    };

    const current = questions[currentQuestion];

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleSubmit = () => {
        if (!satisfaction || !branch) {
            Alert.alert('Please answer all required questions');
            return;
        }

        Alert.alert('Thank you!', 'Survey submitted successfully');
        console.log({ satisfaction, branch, comment });
    };

    return {
        // DATA
        questions,
        currentQuestion,
        satisfaction,
        branch,
        comment,
        isLastQuestion,
        current,

        // SET
        setCurrentQuestion,
        setSatisfaction,
        setBranch,
        setComment,

        // HANDLER
        handleNext,
        handlePrevious,
        handleSubmit,
        canGoNext
    }
}