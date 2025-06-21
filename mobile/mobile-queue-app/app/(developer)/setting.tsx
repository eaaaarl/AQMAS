import ConfigDisplay from '@/features/developer/components/ConfigDisplay';
import CreateConfigForm from '@/features/developer/components/CreateConfigForm';
import { useConfigUpdate } from '@/features/developer/hooks/useConfig';
import React from 'react';
import {
    Keyboard,
    ScrollView,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DeveloperSettings() {
    const { currentConfig } = useConfigUpdate();

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ padding: 16 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Current Configuration Display */}
                    <ConfigDisplay
                        currentConfig={currentConfig}
                        className="mb-6"
                    />

                    {/* Configuration Form */}
                    <View className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <CreateConfigForm />
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}