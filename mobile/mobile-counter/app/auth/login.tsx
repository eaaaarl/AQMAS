import { LoginForm } from '@/features/auth/components';
import { useAuth } from '@/features/auth/hooks';
import React from 'react';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';

export default function Login() {
    const { login, isLoading } = useAuth();

    const handleLogin = async (formData: any) => {
        await login(formData);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-gray-50"
        >
            <View className="flex-1 justify-center px-8">
                <View className="items-center mb-12">
                    <Text className="text-4xl font-bold text-gray-800">Counter Portal</Text>
                </View>

                <LoginForm 
                    onSubmit={handleLogin}
                    isLoading={isLoading}
                />
            </View>
        </KeyboardAvoidingView>
    );
}