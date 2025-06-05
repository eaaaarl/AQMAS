import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile() {
    const user = {
        name: 'Kith Calo',
        email: 'kith@gmail.com',
        phone: '091-2345-6789',
        membershipSince: 'June 2025',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    };

    const handleLogout = () => {
        router.push('/auth/login');
        Alert.alert('User logged out');
    };

    return (
        <SafeAreaView className="bg-gray-50 flex-1">
            <ScrollView>
                <View className="items-center py-8 bg-white shadow-sm">
                    <View className="relative">
                        <Image
                            source={{ uri: user.avatar }}
                            className="w-32 h-32 rounded-full border-4 border-blue-500"
                        />
                        <TouchableOpacity className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full">
                            <Ionicons name="camera" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                    <Text className="text-2xl font-bold mt-4">{user.name}</Text>
                    <Text className="text-gray-500">{user.email}</Text>
                </View>

                <View className="mx-4 mt-6 bg-white rounded-xl p-6 shadow-sm">
                    <View className="mb-6">
                        <Text className="text-gray-500 text-sm">Personal Information</Text>
                        <View className="mt-4 space-y-6 gap-2">
                            <View className="flex-row items-center">
                                <Ionicons name="person" size={20} color="#6b7280" />
                                <Text className="ml-3 text-gray-700">{user.name}</Text>
                            </View>
                            <View className="flex-row items-center">
                                <Ionicons name="mail" size={20} color="#6b7280" />
                                <Text className="ml-3 text-gray-700">{user.email}</Text>
                            </View>
                            <View className="flex-row items-center">
                                <Ionicons name="call" size={20} color="#6b7280" />
                                <Text className="ml-3 text-gray-700">{user.phone}</Text>
                            </View>
                            <View className="flex-row items-center">
                                <Ionicons name="calendar" size={20} color="#6b7280" />
                                <Text className="ml-3 text-gray-700">Member since {user.membershipSince}</Text>
                            </View>
                        </View>
                    </View>

                    <View>
                        <Text className="text-gray-500 text-sm">Settings</Text>
                        <View className="mt-4 space-y-4">
                            <TouchableOpacity className="flex-row items-center justify-between py-3">
                                <View className="flex-row items-center">
                                    <Ionicons name="notifications" size={20} color="#6b7280" />
                                    <Text className="ml-3 text-gray-700">Notifications</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
                            </TouchableOpacity>
                            <TouchableOpacity className="flex-row items-center justify-between py-3">
                                <View className="flex-row items-center">
                                    <Ionicons name="lock-closed" size={20} color="#6b7280" />
                                    <Text className="ml-3 text-gray-700">Change Password</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
                            </TouchableOpacity>
                            <TouchableOpacity className="flex-row items-center justify-between py-3">
                                <View className="flex-row items-center">
                                    <Ionicons name="help-circle" size={20} color="#6b7280" />
                                    <Text className="ml-3 text-gray-700">Help & Support</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={handleLogout}
                    className="mx-4 my-8 bg-red-50 py-4 rounded-xl flex-row justify-center items-center border border-red-100"
                >
                    <Ionicons name="log-out" size={20} color="#ef4444" />
                    <Text className="text-red-500 font-medium ml-2">Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}