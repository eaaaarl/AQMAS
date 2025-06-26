import {
  useGetEmployeeInfoQuery,
  useGetEmployeeRoleDefaultQuery,
  useGetEmployeeRoleQuery,
  useGetEmployeeRoleTaskQuery,
} from '@/features/auth/api/authApi';
import { useGetConfigQuery } from '@/features/config/api/configApi';
import { useGetCustomersGroupQuery } from '@/features/customer/api/customerApi';
import { useGetQueueQuery } from '@/features/queue/api/queueApi';
import { useSettings } from '@/features/settings/hooks/useSettings';
import { useAppSelector } from '@/libs/redux/hooks';
import { useCallback, useMemo } from 'react';

interface RefreshResult {
  success: boolean;
  queueData?: any;
  error?: Error;
}

export const useCounter = () => {
  // Employee state from Redux
  const emp = useAppSelector(state => state.employee);
  const employeeId = emp.employee_id as number;
  const hasEmployeeId = Boolean(employeeId);

  // Settings
  const { settings } = useSettings();

  // Memoize query parameters to prevent unnecessary re-renders
  const queueQueryParams = useMemo(
    () => ({
      service_id: settings?.services ?? [],
      type_id: settings?.customerTypes ?? [],
    }),
    [settings?.services, settings?.customerTypes]
  );

  const shouldSkipQueries = !hasEmployeeId;
  const shouldSkipQueueQuery = !settings?.services || !settings?.customerTypes;

  // Query configurations with consistent options
  const queryOptions = useMemo(
    () => ({
      skip: shouldSkipQueries,
      refetchOnMountOrArgChange: true,
    }),
    [shouldSkipQueries]
  );

  // API Queries
  const {
    data: config,
    refetch: refetchConfig,
    isLoading: isConfigLoading,
    error: configError,
  } = useGetConfigQuery();

  const {
    data: empInfo,
    refetch: refetchEmpInfo,
    isLoading: isEmpInfoLoading,
    error: empInfoError,
  } = useGetEmployeeInfoQuery({ empId: employeeId }, queryOptions);

  const {
    data: empRoleDefault,
    refetch: refetchEmpRoleDefault,
    isLoading: isEmpRoleDefaultLoading,
    error: empRoleDefaultError,
  } = useGetEmployeeRoleDefaultQuery({ emp_id: employeeId }, queryOptions);

  const {
    data: empRole,
    refetch: refetchEmpRole,
    isLoading: isEmpRoleLoading,
    error: empRoleError,
  } = useGetEmployeeRoleQuery({ emp_id: employeeId }, queryOptions);

  // Derived employee data with better fallback logic
  const empInformation = useMemo(
    () => empInfo?.results || [],
    [empInfo?.results]
  );

  const roleName = useMemo(
    () => empRole?.[0]?.role_name ?? empRoleDefault?.[0]?.role_name ?? null,
    [empRole, empRoleDefault]
  );

  const counterNo = useMemo(
    () => empRole?.[0]?.counter_no ?? empRoleDefault?.[0]?.counter_no ?? null,
    [empRole, empRoleDefault]
  );

  const customerGroupId = useMemo(
    () =>
      empRoleDefault?.[0]?.customer_group_id ??
      empRole?.[0]?.customer_group_id ??
      0,
    [empRoleDefault, empRole]
  );

  // Secondary queries that depend on primary data
  const {
    refetch: refetchEmpRoleTask,
    isLoading: isEmpRoleTaskLoading,
    error: empRoleTaskError,
  } = useGetEmployeeRoleTaskQuery(
    { customerGroup: customerGroupId },
    { skip: !customerGroupId || shouldSkipQueries }
  );

  const {
    refetch: refetchCustomerGroup,
    isLoading: isCustomerGroupLoading,
    error: customerGroupError,
  } = useGetCustomersGroupQuery(
    { customerGroupId },
    { skip: !customerGroupId || shouldSkipQueries }
  );

  // Queue query with optimized configuration
  const {
    data: queue,
    refetch: queueRefetch,
    isFetching: isQueueFetching,
    isLoading: isQueueLoading,
    error: queueError,
  } = useGetQueueQuery(queueQueryParams, {
    skip: shouldSkipQueueQuery,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    // Add polling for real-time updates if needed
    // pollingInterval: 30000, // 30 seconds
  });

  // Optimized refresh function with better error handling
  const handleRefresh = useCallback(async (): Promise<RefreshResult> => {
    try {
      // Group related refetch operations for better performance
      const configPromise = refetchConfig();
      const employeePromises = hasEmployeeId
        ? [refetchEmpInfo(), refetchEmpRole(), refetchEmpRoleDefault()]
        : [];

      // Wait for primary employee data first
      await Promise.all([configPromise, ...employeePromises]);

      // Then refetch dependent data
      const dependentPromises = [];
      if (customerGroupId && hasEmployeeId) {
        dependentPromises.push(refetchEmpRoleTask(), refetchCustomerGroup());
      }

      if (dependentPromises.length > 0) {
        await Promise.all(dependentPromises);
      }

      // Finally, refetch queue data
      let queueResult;
      if (!shouldSkipQueueQuery) {
        queueResult = await queueRefetch();
        console.log('Refreshed queue data:', queueResult.data);
      }

      return {
        success: true,
        queueData: queueResult?.data,
      };
    } catch (error) {
      console.error('Error refreshing data:', error);
      return {
        success: false,
        error: error as Error,
      };
    }
  }, [
    refetchConfig,
    refetchEmpInfo,
    refetchEmpRole,
    refetchEmpRoleDefault,
    refetchEmpRoleTask,
    refetchCustomerGroup,
    queueRefetch,
    hasEmployeeId,
    customerGroupId,
    shouldSkipQueueQuery,
  ]);

  // Loading states aggregation
  const loadingStates = useMemo(
    () => ({
      isConfigLoading,
      isEmpInfoLoading,
      isEmpRoleLoading,
      isEmpRoleDefaultLoading,
      isEmpRoleTaskLoading,
      isCustomerGroupLoading,
      isQueueLoading,
      isQueueFetching,
      isAnyLoading:
        isConfigLoading ||
        isEmpInfoLoading ||
        isEmpRoleLoading ||
        isEmpRoleDefaultLoading ||
        isEmpRoleTaskLoading ||
        isCustomerGroupLoading ||
        isQueueLoading,
    }),
    [
      isConfigLoading,
      isEmpInfoLoading,
      isEmpRoleLoading,
      isEmpRoleDefaultLoading,
      isEmpRoleTaskLoading,
      isCustomerGroupLoading,
      isQueueLoading,
      isQueueFetching,
    ]
  );

  // Error states aggregation
  const errorStates = useMemo(
    () => ({
      configError,
      empInfoError,
      empRoleError,
      empRoleDefaultError,
      empRoleTaskError,
      customerGroupError,
      queueError,
      hasAnyError: Boolean(
        configError ||
          empInfoError ||
          empRoleError ||
          empRoleDefaultError ||
          empRoleTaskError ||
          customerGroupError ||
          queueError
      ),
    }),
    [
      configError,
      empInfoError,
      empRoleError,
      empRoleDefaultError,
      empRoleTaskError,
      customerGroupError,
      queueError,
    ]
  );

  // Memoized return value to prevent unnecessary re-renders
  return useMemo(
    () => ({
      // Data
      config,
      emp,
      empInformation,
      roleName,
      counterNo,
      customerGroupId,
      queue,

      // Functions
      handleRefresh,
      queueRefetch,

      // Loading states
      ...loadingStates,

      // Error states
      ...errorStates,

      // Computed states
      hasValidEmployee: hasEmployeeId,
      hasValidRole: Boolean(roleName && counterNo),
      hasValidQueue: Boolean(queue && !shouldSkipQueueQuery),
      isReady:
        hasEmployeeId &&
        Boolean(roleName && counterNo) &&
        !loadingStates.isAnyLoading,
    }),
    [
      config,
      emp,
      empInformation,
      roleName,
      counterNo,
      customerGroupId,
      queue,
      handleRefresh,
      queueRefetch,
      loadingStates,
      errorStates,
      hasEmployeeId,
      shouldSkipQueueQuery,
    ]
  );
};
