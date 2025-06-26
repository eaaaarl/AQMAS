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

export const useCounter = () => {
  console.log('[useCounter] called');
  // GET CONFIG
  const { data: config, refetch: refetchConfig } = useGetConfigQuery();

  // GET STATE EMPLOYEE INFORMATION
  const emp = useAppSelector(state => state.employee);

  // GET EMPLOYEE INFORMATION
  const { data: empInfo, refetch: refetchEmpInfo } = useGetEmployeeInfoQuery(
    {
      empId: emp.employee_id as number,
    },
    { skip: !emp.employee_id }
  );

  const empInformation = useMemo(() => empInfo?.results || [], [empInfo]);

  // GET EMPLOYEE ROLE DEFAULT BY EMPLOYEE ID
  const { data: empRoleDefault, refetch: refetchEmpRoleDefault } =
    useGetEmployeeRoleDefaultQuery(
      {
        emp_id: emp.employee_id as number,
      },
      { skip: !emp.employee_id }
    );

  // GET EMPLOYEE ROLE BY EMPLOYEE ID
  const { data: empRole, refetch: refetchEmpRole } = useGetEmployeeRoleQuery(
    {
      emp_id: emp.employee_id as number,
    },
    { skip: !emp.employee_id }
  );

  // GET ROLE NAME AND COUNTER NO
  const roleName = useMemo(
    () => empRole?.[0]?.role_name ?? empRoleDefault?.[0]?.role_name,
    [empRole, empRoleDefault]
  );

  const counterNo = useMemo(
    () => empRole?.[0]?.counter_no ?? empRoleDefault?.[0]?.counter_no,
    [empRole, empRoleDefault]
  );

  const customerGroupId = useMemo(
    () =>
      empRoleDefault?.[0]?.customer_group_id ??
      empRole?.[0]?.customer_group_id ??
      0,
    [empRoleDefault, empRole]
  );

  // GET EMPLOYEE ROLE TASK
  const { refetch: refetchEmpRoleTask } = useGetEmployeeRoleTaskQuery({
    customerGroup: customerGroupId,
  });

  // GET CUSTOMER GROUP
  const { refetch: refetchCustomerGroup } = useGetCustomersGroupQuery({
    customerGroupId,
  });

  // Get settings
  const { settings } = useSettings();

  // GET QUEUE - Move this before the useEffect that calls refetchQueue
  const queryParams = useMemo(
    () => ({
      service_id: settings?.services ?? [],
      type_id: settings?.customerTypes ?? [],
    }),
    [settings?.services, settings?.customerTypes]
  );

  // GET QUEUE with better caching control
  const {
    data: queue,
    refetch: QueueRefetch,
    isFetching: isQueueFetching,
  } = useGetQueueQuery(queryParams, {
    skip: !settings?.services || !settings?.customerTypes,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const handleRefresh = useCallback(async () => {
    try {
      // Execute refetches in sequence for better reliability
      await refetchConfig();
      await refetchEmpInfo();
      await refetchEmpRole();
      await refetchEmpRoleDefault();
      await refetchEmpRoleTask();
      await refetchCustomerGroup();

      // Queue refetch should be last and wait for completion
      const queueResult = await QueueRefetch();

      console.log('Refreshed queue data:', queueResult.data);

      return queueResult;
    } catch (error) {
      console.error('Error refreshing data:', error);
      throw error;
    }
  }, [
    refetchConfig,
    refetchEmpInfo,
    refetchEmpRole,
    refetchEmpRoleDefault,
    refetchEmpRoleTask,
    refetchCustomerGroup,
    QueueRefetch,
  ]);

  const returnValue = useMemo(
    () => ({
      config,
      emp,
      empInformation,
      roleName,
      counterNo,
      handleRefresh,
      queue,
      QueueRefetch,
      isQueueFetching,
    }),
    [
      config,
      emp,
      empInformation,
      roleName,
      counterNo,
      handleRefresh,
      queue,
      QueueRefetch,
      isQueueFetching,
    ]
  );

  return returnValue;
};
