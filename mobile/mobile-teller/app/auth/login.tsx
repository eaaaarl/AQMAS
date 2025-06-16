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
                    {/* <Image
                        source={require('../assets/bank-logo.png')}
                        className="w-32 h-32 mb-4"
                        resizeMode="contain"
                    /> */}
                    <Text className="text-2xl font-bold text-gray-800">Counter Portal</Text>
                    <Text className="font-bold mt-2">Sign in to your account</Text>
                </View>

                <View className="space-y-4 gap-5">
                    <View>
                        <Text className="text-gray-700 mb-1">Email</Text>
                        <View className="flex-row items-center bg-white border border-gray-200 rounded-lg px-4 py-3">
                            <Ionicons name="mail" size={18} color="#6b7280" />
                            <TextInput
                                className="flex-1 ml-2 text-gray-700"
                                placeholder="Enter your email"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    <View>
                        <Text className="text-gray-700 mb-1">Password</Text>
                        <View className="flex-row items-center bg-white border border-gray-200 rounded-lg px-4 py-3">
                            <Ionicons name="lock-closed" size={18} color="#6b7280" />
                            <TextInput
                                className="flex-1 ml-2 text-gray-700"
                                placeholder="Enter your password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
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

                    <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center">
                            <TouchableOpacity className="w-5 h-5 border border-gray-300 rounded mr-2">
                            </TouchableOpacity>
                            <Text className="text-gray-600 font-semibold">Remember me</Text>
                        </View>
                        <TouchableOpacity className='p-2'>
                            <Text className="text-blue-600 font-bold">Forgot passwod?</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        onPress={handleLogin}
                        disabled={isLoading}
                        className={`py-3 rounded-lg ${isLoading ? 'bg-blue-400' : 'bg-blue-600'} items-center`}
                    >
                        <Text className="text-white font-medium">
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </Text>
                    </TouchableOpacity>
                </View>
                <Text className="text-center text-gray-400 mt-8">v1.0.0</Text>
            </View>
        </KeyboardAvoidingView>
    );
}