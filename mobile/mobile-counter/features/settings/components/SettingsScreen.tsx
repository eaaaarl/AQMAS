import { OfflineIndicator, useGlobalError } from '@/features/error';
import React, { useState } from 'react';
import {
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSettings } from '../hooks';
import { InfoRowProps, SettingRowProps } from '../types';

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

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
    <View className="flex-row justify-between items-center py-3 px-1">
        <Text className="text-gray-600 text-sm font-medium">
            {label}
        </Text>
        <Text style={{ color: '#1c3f83' }} className="text-sm font-semibold">
            {value}
        </Text>
    </View>
);

export default function SettingsScreen() {
    const [refreshing, setRefreshing] = useState(false);
    const { hasConnectionError } = useGlobalError();
    const {
        empInformation,
        settings,
        handleRefresh,
        handleLogout,
        updateCustomerType,
        updateService,
    } = useSettings();

    const onRefresh = async () => {
        setRefreshing(true);
        await handleRefresh();
        setRefreshing(false);
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
            <OfflineIndicator isOffline={hasConnectionError} />
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#1c3f83']}
                        tintColor="#1c3f83"
                    />
                }
            >
                <View className="px-5 py-6 mx-4">
                    {/* Counter User Information Section */}
                    <View className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
                        <SectionHeader title="Counter Information" />

                        <View className="space-y-1">
                            <InfoRow label="Counter" value={empInformation?.[0]?.employee_no} />
                            <View className="h-px bg-gray-100 mx-1" />

                            <InfoRow label="Operator" value={`${empInformation?.[0]?.first_name} ${empInformation?.[0]?.mid_name} ${empInformation?.[0]?.last_name}`} />
                            <View className="h-px bg-gray-100 mx-1" />

                            <InfoRow label="Employee ID" value={`${empInformation?.[0]?.employee_id}`} />
                            <View className="h-px bg-gray-100 mx-1" />

                            <View className="h-px bg-gray-100 mx-1" />

                            <View className="flex-row justify-between items-center py-3 px-1">
                                <Text className="text-gray-600 text-sm font-medium">
                                    Status
                                </Text>
                                <View className="flex-row items-center">
                                    <View
                                        className={`w-2 h-2 rounded-full mr-2 ${empInformation?.[0]?.is_active?.data?.[0] === 1
                                            ? 'bg-green-500'
                                            : 'bg-red-500'
                                            }`}
                                    />
                                    <Text
                                        className={`${empInformation?.[0]?.is_active?.data?.[0] === 1
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                            } text-sm font-semibold`}
                                    >
                                        {empInformation?.[0]?.is_active?.data?.[0] === 1 ? 'Active' : 'Inactive'}
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
                                value={settings.customerTypes.seniorCitizen}
                                onValueChange={(value) => updateCustomerType('seniorCitizen', value)}
                            />

                            <View className="h-px bg-gray-100 mx-1" />

                            <SettingRow
                                label="VIP Customers"
                                value={settings.customerTypes.vip}
                                onValueChange={(value) => updateCustomerType('vip', value)}
                            />

                            <View className="h-px bg-gray-100 mx-1" />

                            <SettingRow
                                label="Regular Customers"
                                value={settings.customerTypes.regularCustomer}
                                onValueChange={(value) => updateCustomerType('regularCustomer', value)}
                            />
                        </View>
                    </View>

                    {/* Service Settings */}
                    <View className="bg-white rounded-2xl p-5 mb-8 shadow-sm">
                        <SectionHeader title="Queue only by selected service" />

                        <View className="space-y-1">
                            <SettingRow
                                label="Cash"
                                value={settings.services.cash}
                                onValueChange={(value) => updateService('cash', value)}
                            />

                            <View className="h-px bg-gray-100 mx-1" />

                            <SettingRow
                                label="Credit"
                                value={settings.services.credit}
                                onValueChange={(value) => updateService('credit', value)}
                            />
                        </View>
                    </View>

                    {/* Logout Button */}
                    <View className="px-2 mt-4">
                        <TouchableOpacity
                            onPress={handleLogout}
                            style={{ backgroundColor: '#ef4444' }}
                            className="py-4 rounded-xl active:opacity-80"
                        >
                            <Text className="text-white font-semibold text-center text-base">
                                Logout
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
} 