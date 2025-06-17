import ConfigDisplay from '@/features/developer/components/ConfigDisplay';
import CreateConfigForm from '@/features/developer/components/CreateConfigForm';
import React from 'react';
import {
    Keyboard,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };
    return (
        <SafeAreaView className="flex-1 bg-white">
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
                <View className="flex-1 p-4">
                    <ConfigDisplay />
                    <CreateConfigForm />
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}