import DismissKeyboard from '@/components/DismissKeyboard';
import BackButton from '@/features/survey/components/BackButton';
import CustomerFormModal from '@/features/survey/components/CustomerFormModal';
import RenderQuestion from '@/features/survey/components/RenderQuestion';
import SurveyFooter from '@/features/survey/components/SurveyFooter';
import SurveyHeader from '@/features/survey/components/SurveyHeader';
import { useCustomerForm } from '@/features/survey/hooks/useCustomerForm';
import { useSurvey } from '@/features/survey/hooks/useSurvey';
import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SurveyScreen() {
    const {
        openCustomerFormModal,
        formData,
        onChangeInput,
        handleClose,
    } = useCustomerForm();

    const { handleSubmit, handleResetSurvey } = useSurvey();

    const handleFormConfirm = async () => {
        const customerData = formData;
        await handleSubmit(customerData);
        handleResetSurvey()
        handleClose();
        router.push('/(service)')
    };

    return (
        <DismissKeyboard>
            <SafeAreaView className="flex-1 bg-gray-50">
                <BackButton />
                <SurveyHeader />
                <RenderQuestion />
                <SurveyFooter />
                <CustomerFormModal
                    isOpen={openCustomerFormModal}
                    onCancel={handleClose}
                    onConfirm={handleFormConfirm}
                    formData={formData}
                    onFormChange={onChangeInput}
                />
            </SafeAreaView>
        </DismissKeyboard>
    );
}