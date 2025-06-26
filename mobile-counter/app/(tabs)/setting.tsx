import { useEmployeeData } from '@/features/auth';
import { useGetEmployeeRoleTaskQuery } from '@/features/auth/api/authApi';
import { useGetCustomersGroupQuery } from '@/features/customer/api/customerApi';
import { OfflineIndicator, useGlobalError } from '@/features/error';
import { useSettings } from '@/features/settings/hooks/useSettings';
import { InfoRowProps, SettingRowProps } from '@/features/settings/types';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
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

// Memoized components
const SettingRow = React.memo<SettingRowProps>(({
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
));
SettingRow.displayName = 'SettingRow';

const SectionHeader = React.memo<{ title: string }>(({ title }) => (
  <Text className="mb-4 text-sm font-medium uppercase tracking-wide text-gray-600">
    {title}
  </Text>
));
SectionHeader.displayName = 'SectionHeader';

const InfoRow = React.memo<InfoRowProps>(({ label, value }) => (
  <View className="flex-row items-center justify-between px-1 py-3">
    <Text className="text-sm font-medium text-gray-600">{label}</Text>
    <Text style={{ color: '#1c3f83' }} className="text-sm font-semibold">
      {value}
    </Text>
  </View>
));
InfoRow.displayName = 'InfoRow';

const Divider = React.memo(() => (
  <View className="mx-1 h-px bg-gray-100" />
));
Divider.displayName = 'Divider';

// Memoized sections
const CounterInformationSection = React.memo<{
  empInformation: any;
}>(({ empInformation }) => (
  <View className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
    <SectionHeader title="Counter Information" />
    <View className="space-y-1">
      <InfoRow
        label="Counter"
        value={empInformation?.[0]?.employee_no}
      />
      <Divider />
      <InfoRow
        label="Operator"
        value={`${empInformation?.[0]?.first_name} ${empInformation?.[0]?.mid_name} ${empInformation?.[0]?.last_name}`}
      />
      <Divider />
      <InfoRow
        label="Employee ID"
        value={`${empInformation?.[0]?.employee_id}`}
      />
    </View>
  </View>
));
CounterInformationSection.displayName = 'CounterInformationSection';

const QueueSettingsSummarySection = React.memo<{
  customerTypesCount: number;
  servicesCount: number;
  totalCustomerGroups: number;
  totalEmployeeRoleTasks: number;
}>(({
  customerTypesCount,
  servicesCount,
  totalCustomerGroups,
  totalEmployeeRoleTasks
}) => (
  <View className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
    <SectionHeader title="Queue Settings Summary" />
    <View className="space-y-1">
      <InfoRow
        label="Enabled Customer Types"
        value={`${customerTypesCount} of ${totalCustomerGroups}`}
      />
      <Divider />
      <InfoRow
        label="Enabled Services"
        value={`${servicesCount} of ${totalEmployeeRoleTasks}`}
      />
    </View>
  </View>
));
QueueSettingsSummarySection.displayName = 'QueueSettingsSummarySection';

const CustomerTypeSettingsSection = React.memo<{
  customerGroups: any[];
  enabledCustomerTypes: number[];
  onCustomerTypeChange: (typeId: number, value: boolean) => void;
}>(({ customerGroups, enabledCustomerTypes, onCustomerTypeChange }) => (
  <View className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
    <SectionHeader title="Queue only by selected customer type" />
    <Text className="mb-4 text-sm text-gray-600">
      All customer types are enabled by default. Disable the types you
      don&apos;t want to see in your queue.
    </Text>
    <View className="space-y-1">
      {customerGroups.map(group => (
        <SettingRow
          key={group.type_id}
          label={group.type_name}
          value={enabledCustomerTypes.includes(group.type_id)}
          onValueChange={value => onCustomerTypeChange(group.type_id, value)}
        />
      ))}
      <Divider />
    </View>
  </View>
));
CustomerTypeSettingsSection.displayName = 'CustomerTypeSettingsSection';

const ServiceSettingsSection = React.memo<{
  employeeRoleTasks: any[];
  enabledServices: number[];
  onServiceChange: (serviceId: number, value: boolean) => void;
}>(({ employeeRoleTasks, enabledServices, onServiceChange }) => (
  <View className="mb-8 rounded-2xl bg-white p-5 shadow-sm">
    <SectionHeader title="Queue only by selected service" />
    <Text className="mb-4 text-sm text-gray-600">
      All services are enabled by default. Disable the services you
      don&apos;t want to see in your queue.
    </Text>
    <View className="space-y-1">
      {employeeRoleTasks.map(task => (
        <SettingRow
          key={task.service_id}
          label={task.service_name}
          value={enabledServices.includes(task.service_id)}
          onValueChange={value => onServiceChange(task.service_id, value)}
        />
      ))}
      <Divider />
    </View>
  </View>
));
ServiceSettingsSection.displayName = 'ServiceSettingsSection';

const LogoutSection = React.memo<{
  onLogout: () => void;
}>(({ onLogout }) => (
  <View className="mt-4 px-2">
    <TouchableOpacity
      onPress={onLogout}
      style={{ backgroundColor: '#ef4444' }}
      className="rounded-xl py-4 active:opacity-80"
    >
      <Text className="text-center text-base font-semibold text-white">
        Logout
      </Text>
    </TouchableOpacity>
  </View>
));
LogoutSection.displayName = 'LogoutSection';

const ProfileImage = React.memo<{
  empInformation: any;
}>(({ empInformation }) => (
  <View className="mb-6 items-center">
    <View className="h-24 w-24 overflow-hidden rounded-full">
      <Image
        source={require('@/assets/images/adaptive-icon.png')}
        className="h-full w-full"
        resizeMode="cover"
      />
    </View>
    <Text className="mt-2 text-center text-lg font-semibold" style={{ color: '#1c3f83' }}>
      {`${empInformation?.[0]?.first_name} ${empInformation?.[0]?.last_name}`}
    </Text>
  </View>
));
ProfileImage.displayName = 'ProfileImage';

export default function SettingsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const { hasConnectionError } = useGlobalError();
  const customerTypesInitialized = useRef(false);
  const servicesInitialized = useRef(false);

  const {
    settings,
    handleLogout,
    updateCustomerType,
    updateService,
    setCustomerTypes,
    setServices,
  } = useSettings();

  const {
    employeeRoleDefault,
    employeeRoles,
    employeeInfo: empInformation,
  } = useEmployeeData();

  const customerGroupId = useMemo(() =>
    employeeRoleDefault?.[0]?.customer_group_id ?? employeeRoles?.[0]?.customer_group_id,
    [employeeRoleDefault, employeeRoles]
  );

  const { data: customerGroups, refetch: refetchCustomerGroups } =
    useGetCustomersGroupQuery(
      { customerGroupId },
      { skip: !customerGroupId }
    );

  const { data: employeeRoleTask, refetch: refetchEmployeeRoleTask } =
    useGetEmployeeRoleTaskQuery(
      { customerGroup: customerGroupId },
      { skip: !customerGroupId }
    );

  // Memoized callback for refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      refetchCustomerGroups(),
      refetchEmployeeRoleTask(),
    ]);
    setRefreshing(false);
  }, [refetchCustomerGroups, refetchEmployeeRoleTask]);

  // Memoized callback for customer type changes
  const handleCustomerTypeChange = useCallback((typeId: number, value: boolean) => {
    updateCustomerType(typeId, value);
  }, [updateCustomerType]);

  // Memoized callback for service changes
  const handleServiceChange = useCallback((serviceId: number, value: boolean) => {
    updateService(serviceId, value);
  }, [updateService]);

  // Memoized counts for summary section
  const summaryData = useMemo(() => ({
    customerTypesCount: settings.customerTypes.length,
    servicesCount: settings.services.length,
    totalCustomerGroups: customerGroups?.length || 0,
    totalEmployeeRoleTasks: employeeRoleTask?.length || 0,
  }), [settings.customerTypes.length, settings.services.length, customerGroups?.length, employeeRoleTask?.length]);

  // Memoized arrays to prevent unnecessary re-renders
  const memoizedCustomerGroups = useMemo(() => customerGroups || [], [customerGroups]);
  const memoizedEmployeeRoleTasks = useMemo(() => employeeRoleTask || [], [employeeRoleTask]);

  useEffect(() => {
    if (customerGroups && !customerTypesInitialized.current) {
      setCustomerTypes(customerGroups.map(g => g.type_id));
      customerTypesInitialized.current = true;
    }
  }, [customerGroups, setCustomerTypes]);

  useEffect(() => {
    if (employeeRoleTask && !servicesInitialized.current) {
      setServices(employeeRoleTask.map(t => t.service_id));
      servicesInitialized.current = true;
    }
  }, [employeeRoleTask, setServices]);

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
            {/* Profile Image Section */}
            <ProfileImage empInformation={empInformation} />

            {/* Counter User Information Section */}
            <CounterInformationSection empInformation={empInformation} />

            {/* Queue Settings Summary */}
            <QueueSettingsSummarySection
              customerTypesCount={summaryData.customerTypesCount}
              servicesCount={summaryData.servicesCount}
              totalCustomerGroups={summaryData.totalCustomerGroups}
              totalEmployeeRoleTasks={summaryData.totalEmployeeRoleTasks}
            />

            {/* Customer Type Settings */}
            {memoizedCustomerGroups.length > 0 && (
              <CustomerTypeSettingsSection
                customerGroups={memoizedCustomerGroups}
                enabledCustomerTypes={settings.customerTypes}
                onCustomerTypeChange={handleCustomerTypeChange}
              />
            )}

            {/* Service Settings */}
            {memoizedEmployeeRoleTasks.length > 0 && (
              <ServiceSettingsSection
                employeeRoleTasks={memoizedEmployeeRoleTasks}
                enabledServices={settings.services}
                onServiceChange={handleServiceChange}
              />
            )}

            {/* Logout Button */}
            <LogoutSection onLogout={handleLogout} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}