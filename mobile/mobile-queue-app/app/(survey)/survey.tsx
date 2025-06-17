import DismissKeyboard from '@/components/DismissKeyboard';
import BackButton from '@/features/survey/components/BackButton';
import RenderQuestion from '@/features/survey/components/RenderQuestion';
import SurveyFooter from '@/features/survey/components/SurveyFooter';
import SurveyHeader from '@/features/survey/components/SurveyHeader';
import React from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function SurveyScreen() {
    return (
        <DismissKeyboard>
            <SafeAreaView className="flex-1 bg-gray-50">
                <BackButton />
                <SurveyHeader />
                <RenderQuestion />
                <SurveyFooter />
            </SafeAreaView>
        </DismissKeyboard>
    );
}