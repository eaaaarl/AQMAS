import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function Settings() {
    // Customer type toggles
    const [seniorCitizen, setSeniorCitizen] = useState(true);
    const [vip, setVip] = useState(true);
    const [regularCustomer, setRegularCustomer] = useState(true);

    // Service toggles
    const [cash, setCash] = useState(true);
    const [credit, setCredit] = useState(true);

    // Counter user information (this would typically come from props, context, or API)
    const counterUserInfo = {
        name: "Maria Santos",
        counterNumber: "C-03",
        employeeId: "EMP-2024-001",
        shift: "Morning Shift",
        status: "Active",
        loginTime: "08:00 AM"
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: () => {
                        router.push('/auth/login')
                    },
                },
            ]
        );
    };

    type SettingRowProps = {
        label: string;
        value: boolean;
        onValueChange: (value: boolean) => void;
    };

    const SettingRow: React.FC<SettingRowProps> = ({ label, value, onValueChange }) => (
        <View className="flex-row items-center justify-between py-4 px-1">
            <Text style={{ color: '#1c3f83' }} className="text-base font-medium flex-1">
                {label}
            </Text>
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{ false: '#e5e7eb', true: '#1c3f83' }}
                thumbColor={value ? '#ffffff' : '#f9fafb'}
                ios_backgroundColor="#e5e7eb"
            />
        </View>
    );

    const SectionHeader = ({ title }: { title: string }) => (
        <Text className="text-gray-600 text-sm font-medium mb-4 uppercase tracking-wide">
            {title}
        </Text>
    );

    const InfoRow = ({ label, value }: { label: string; value: string }) => (
        <View className="flex-row justify-between items-center py-3 px-1">
            <Text className="text-gray-600 text-sm font-medium">
                {label}
            </Text>
            <Text style={{ color: '#1c3f83' }} className="text-sm font-semibold">
                {value}
            </Text>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
            >
                <View className="px-5 py-6 mx-4">
                    {/* Counter User Information Section */}
                    <View className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
                        <SectionHeader title="Counter Information" />

                        <View className="space-y-1">
                            <InfoRow label="Counter" value={counterUserInfo.counterNumber} />
                            <View className="h-px bg-gray-100 mx-1" />

                            <InfoRow label="Operator" value={counterUserInfo.name} />
                            <View className="h-px bg-gray-100 mx-1" />

                            <InfoRow label="Employee ID" value={counterUserInfo.employeeId} />
                            <View className="h-px bg-gray-100 mx-1" />

                            <InfoRow label="Shift" value={counterUserInfo.shift} />
                            <View className="h-px bg-gray-100 mx-1" />

                            <InfoRow label="Login Time" value={counterUserInfo.loginTime} />
                            <View className="h-px bg-gray-100 mx-1" />

                            <View className="flex-row justify-between items-center py-3 px-1">
                                <Text className="text-gray-600 text-sm font-medium">
                                    Status
                                </Text>
                                <View className="flex-row items-center">
                                    <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                                    <Text className="text-green-600 text-sm font-semibold">
                                        {counterUserInfo.status}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Customer Type Settings */}
                    <View className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
                        <SectionHeader title="Queue only by selected customer type" />

                        <View className="space-y-1">
                            <SettingRow
                                label="Senior Citizens"
                                value={seniorCitizen}
                                onValueChange={setSeniorCitizen}
                            />

                            <View className="h-px bg-gray-100 mx-1" />

                            <SettingRow
                                label="VIP Customers"
                                value={vip}
                                onValueChange={setVip}
                            />

                            <View className="h-px bg-gray-100 mx-1" />

                            <SettingRow
                                label="Regular Customers"
                                value={regularCustomer}
                                onValueChange={setRegularCustomer}
                            />
                        </View>
                    </View>

                    {/* Service Settings */}
                    <View className="bg-white rounded-2xl p-5 mb-8 shadow-sm">
                        <SectionHeader title="Queue only by selected service" />

                        <View className="space-y-1">
                            <SettingRow
                                label="Cash"
                                value={cash}
                                onValueChange={setCash}
                            />

                            <View className="h-px bg-gray-100 mx-1" />

                            <SettingRow
                                label="Credit"
                                value={credit}
                                onValueChange={setCredit}
                            />
                        </View>
                    </View>

                    {/* Logout Button */}
                    <View className="px-2 mt-4">
                        <TouchableOpacity
                            onPress={handleLogout}
                            className="bg-red-500 active:bg-red-600 py-4 rounded-2xl shadow-sm"
                            activeOpacity={0.8}
                        >
                            <Text className="text-white font-semibold text-center text-base">
                                Sign Out
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}