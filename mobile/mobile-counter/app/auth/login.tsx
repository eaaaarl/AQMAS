import { useEmployeeLoginMutation } from '@/features/auth/api/authApi';
import { useAppDispatch } from '@/libs/redux/hooks';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function Login() {
    const dispatch = useAppDispatch()
    const [empId, setEmpId] = useState('');
    const [empPin, setEmpPin] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [employeeLogin, { isLoading }] = useEmployeeLoginMutation();

    const validateForm = () => {
        if (!empId.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: 'Employee number is required'
            });
            return false;
        }

        if (!empPin.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: 'PIN is required'
            });
            return false;
        }

        return true;
    };

    const handleLogin = async () => {
        router.push('/(tabs)')
        /*  if (!validateForm()) {
             return;
         }
 
         try {
 
             const res = await employeeLogin({ id: empId, pin: empPin }).unwrap();
 
             dispatch(setEmployee({ employee_id: res.employeeId }))
 
             if (res.ghError === 1001) {
                 Toast.show({
                     type: 'error',
                     text1: 'Login Failed',
                     text2: res.message || 'Invalid credentials'
                 });
                 return;
             }
 
             Toast.show({
                 type: 'success',
                 text1: 'Login Successful',
                 text2: res.message || 'Welcome back!'
             });
             setEmpId('')
             setEmpPin('')
             router.push('/(tabs)')
         } catch (error: any) {
             console.log('Login ERROR Details:', {
                 error,
                 status: error?.status,
                 data: error?.data,
                 message: error?.message,
                 originalStatus: error?.originalStatus
             });
 
             let errorMessage = 'Failed to login, please try again';
             let errorTitle = 'Login Failed';
 
             if (error?.data?.message) {
                 errorMessage = error.data.message;
             } else if (error?.status === 'FETCH_ERROR') {
                 errorMessage = 'Network error - check your connection';
                 errorTitle = 'Connection Error';
             } else if (error?.status === 'PARSING_ERROR') {
                 errorMessage = 'Server response error';
             } else if (error?.status === 401) {
                 errorMessage = 'Invalid employee number or PIN';
             } else if (error?.status === 404) {
                 errorMessage = 'Employee not found';
             } else if (error?.status === 500) {
                 errorMessage = 'Server error. Please try again later';
             } else if (error?.originalStatus === 401) {
                 errorMessage = 'Invalid credentials';
             }
 
             Toast.show({
                 type: 'error',
                 text1: errorTitle,
                 text2: errorMessage
             });
         } */
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
                                value={empId}
                                onChangeText={setEmpId}
                                keyboardType="default"
                                autoCapitalize="none"
                                editable={!isLoading}
                            />
                        </View>
                    </View>

                    <View>
                        <Text className="text-gray-700 mb-1">PIN</Text>
                        <View className="flex-row items-center bg-white border border-gray-200 rounded-lg px-4 py-3">
                            <Ionicons name="lock-closed" size={18} color="#6b7280" />
                            <TextInput
                                className="flex-1 ml-2 text-gray-700 p-2"
                                placeholder="Enter your PIN"
                                value={empPin}
                                onChangeText={setEmpPin}
                                secureTextEntry={!showPassword}
                                keyboardType='default'
                                editable={!isLoading}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                            >
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
                        disabled={isLoading || !empId.trim() || !empPin.trim()}
                        className={`p-4 rounded-lg ${isLoading || !empId.trim() || !empPin.trim()
                            ? 'bg-blue-400'
                            : 'bg-blue-600'
                            } items-center`}
                    >
                        <Text className="text-white font-medium">
                            {isLoading ? <ActivityIndicator size="small" color="#fff" /> : 'Login'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}