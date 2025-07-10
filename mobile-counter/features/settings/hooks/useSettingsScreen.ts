import { useEmployeeData } from '@/features/auth';
import { useGetEmployeeRoleTaskQuery } from '@/features/auth/api/authApi';
import { useGetCustomersGroupQuery } from '@/features/customer/api/customerApi';
import { useGlobalError } from '@/features/error';
import { useSettings } from '@/features/settings/hooks/useSettings';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export function useSettingsScreenLogic() {
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

  return {
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
  };
} 