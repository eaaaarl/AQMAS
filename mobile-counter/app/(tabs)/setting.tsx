import { useEmployeeData } from '@/features/auth';
import { useGetEmployeeRoleTaskQuery } from '@/features/auth/api/authApi';
import { useGetCustomersGroupQuery } from '@/features/customer/api/customerApi';
import { OfflineIndicator, useGlobalError } from '@/features/error';
import { useSettings } from '@/features/settings/hooks/useSettings';
import { InfoRowProps, SettingRowProps } from '@/features/settings/types';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const SettingRow: React.FC<SettingRowProps> = ({
  label,
  value,
  onValueChange,
}) => (
  <View className="flex-row items-center justify-between px-1 py-4">
    <Text style={{ color: '#1c3f83' }} className="flex-1 text-base font-medium">
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
  <Text className="mb-4 text-sm font-medium uppercase tracking-wide text-gray-600">
    {title}
  </Text>
);

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
  <View className="flex-row items-center justify-between px-1 py-3">
    <Text className="text-sm font-medium text-gray-600">{label}</Text>
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
    setCustomerTypes,
    setServices,
  } = useSettings();

  const onRefresh = async () => {
    setRefreshing(true);
    await handleRefresh();
    await refetchCustomerGroups();
    await refetchEmployeeRoleTask();
    setRefreshing(false);
  };

  const { employeeRoleDefault, employeeRoles } = useEmployeeData();

  const { data: customerGroups, refetch: refetchCustomerGroups } =
    useGetCustomersGroupQuery({
      customerGroupId:
        employeeRoleDefault?.[0]?.customer_group_id ??
        employeeRoles?.[0]?.customer_group_id,
    });

  const { data: employeeRoleTask, refetch: refetchEmployeeRoleTask } =
    useGetEmployeeRoleTaskQuery({
      customerGroup:
        employeeRoleDefault?.[0]?.customer_group_id ??
        employeeRoles?.[0]?.customer_group_id,
    });

  useEffect(() => {
    if (customerGroups) {
      setCustomerTypes(customerGroups.map(g => g.type_name));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerGroups]);

  useEffect(() => {
    if (employeeRoleTask) {
      setServices(employeeRoleTask.map(t => t.service_name));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeRoleTask]);

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
            {/* Counter User Information Section */}
            <View className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
              <SectionHeader title="Counter Information" />

              <View className="space-y-1">
                <InfoRow
                  label="Counter"
                  value={empInformation?.[0]?.employee_no}
                />
                <View className="mx-1 h-px bg-gray-100" />

                <InfoRow
                  label="Operator"
                  value={`${empInformation?.[0]?.first_name} ${empInformation?.[0]?.mid_name} ${empInformation?.[0]?.last_name}`}
                />
                <View className="mx-1 h-px bg-gray-100" />

                <InfoRow
                  label="Employee ID"
                  value={`${empInformation?.[0]?.employee_id}`}
                />
              </View>
            </View>

            {/* Customer Type Settings */}
            <View className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
              <SectionHeader title="Queue only by selected customer type" />

              <View className="space-y-1">
                {customerGroups?.map(group => (
                  <SettingRow
                    key={group.type_id}
                    label={group.type_name}
                    value={
                      settings.customerTypes[
                        group.type_name as keyof typeof settings.customerTypes
                      ] ?? false
                    }
                    onValueChange={value =>
                      updateCustomerType(
                        group.type_name as keyof typeof settings.customerTypes,
                        value
                      )
                    }
                  />
                ))}
                <View className="mx-1 h-px bg-gray-100" />
              </View>
            </View>

            {/* Service Settings */}
            <View className="mb-8 rounded-2xl bg-white p-5 shadow-sm">
              <SectionHeader title="Queue only by selected service" />

              <View className="space-y-1">
                {employeeRoleTask?.map(task => (
                  <SettingRow
                    key={task.service_id}
                    label={task.service_name}
                    value={
                      settings.services[
                        task.service_name as keyof typeof settings.services
                      ] ?? false
                    }
                    onValueChange={value =>
                      updateService(
                        task.service_name as keyof typeof settings.services,
                        value
                      )
                    }
                  />
                ))}
                <View className="mx-1 h-px bg-gray-100" />
              </View>
            </View>

            {/* Logout Button */}
            <View className="mt-4 px-2">
              <TouchableOpacity
                onPress={handleLogout}
                style={{ backgroundColor: '#ef4444' }}
                className="rounded-xl py-4 active:opacity-80"
              >
                <Text className="text-center text-base font-semibold text-white">
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
