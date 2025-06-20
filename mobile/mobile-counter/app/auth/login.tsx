import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = () => {
        setIsLoading(true);
        Alert.alert('Logging in with:', `Email: ${email}\nPassword: ${password}`);
        router.push('/(tabs)');
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

                <View className="space-y-4 gap-5">
                    <View>
                        <Text className="text-gray-700 mb-1">Employee No.</Text>
                        <View className="flex-row items-center bg-white border border-gray-200 rounded-lg px-4 py-3">
                            <Ionicons name="person" size={18} color="#6b7280" />
                            <TextInput
                                className="flex-1 ml-2 text-gray-700 p-2"
                                placeholder="Enter your employee no"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="default"
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    <View>
                        <Text className="text-gray-700 mb-1">PIN</Text>
                        <View className="flex-row items-center bg-white border border-gray-200 rounded-lg px-4 py-3">
                            <Ionicons name="lock-closed" size={18} color="#6b7280" />
                            <TextInput
                                className="flex-1 ml-2 text-gray-700 p-2"
                                placeholder="Enter your password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                keyboardType='default'
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons
                                    name={showPassword ? "eye-off" : "eye"}
                                    size={18}
                                    color="#6b7280"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={handleLogin}
                        disabled={isLoading}
                        className={`p-4 rounded-lg ${isLoading ? 'bg-blue-400' : 'bg-blue-600'} items-center`}
                    >
                        <Text className="text-white font-medium">
                            {isLoading ? 'Logging in...' : 'Login'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}