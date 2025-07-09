import { OfflineIndicator } from '@/features/error';
import { CounterInformationSection } from '@/features/settings/components/CounterInformationSection';
import { CustomerTypeSettingsSection } from '@/features/settings/components/CustomerTypeSettingsSection';
import { DeviceInformationSection } from '@/features/settings/components/DeviceInformationSection';
import { LogoutSection } from '@/features/settings/components/LogoutSection';
import { QueueSettingsSummarySection } from '@/features/settings/components/QueueSettingsSummarySection';
import { ServiceSettingsSection } from '@/features/settings/components/ServiceSettingsSection';
import { useSettingsScreenLogic } from '@/features/settings/hooks/useSettingsScreen';
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';

export default function SettingsScreen() {
  const {
    refreshing,
    hasConnectionError,
    onRefresh,
    empInformation,
    summaryData,
    memoizedCustomerGroups,
    memoizedEmployeeRoleTasks,
    settings,
    handleCustomerTypeChange,
    handleServiceChange,
    handleLogout,
  } = useSettingsScreenLogic();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      <OfflineIndicator isOffline={hasConnectionError} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
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
          <View className="mx-4 px-5 py-6">
            <CounterInformationSection empInformation={empInformation} />
            <QueueSettingsSummarySection {...summaryData} />
            {memoizedCustomerGroups.length > 0 && (
              <CustomerTypeSettingsSection
                customerGroups={memoizedCustomerGroups}
                enabledCustomerTypes={settings.customerTypes}
                onCustomerTypeChange={handleCustomerTypeChange}
              />
            )}
            {memoizedEmployeeRoleTasks.length > 0 && (
              <ServiceSettingsSection
                employeeRoleTasks={memoizedEmployeeRoleTasks}
                enabledServices={settings.services}
                onServiceChange={handleServiceChange}
              />
            )}
            <DeviceInformationSection />
            <LogoutSection onLogout={handleLogout} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}