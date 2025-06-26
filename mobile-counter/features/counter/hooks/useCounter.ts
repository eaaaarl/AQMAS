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
import { useMemo } from 'react';

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

  const empInformation = empInfo?.results || [];

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

  // GET ROLE NAME
  const roleName = empRole?.[0]?.role_name ?? empRoleDefault?.[0]?.role_name;

  // GET COUNTER NO
  const counterNo = empRole?.[0]?.counter_no ?? empRoleDefault?.[0]?.counter_no;

  // GET EMPLOYEE ROLE TASK
  const { refetch: refetchEmpRoleTask } = useGetEmployeeRoleTaskQuery({
    customerGroup:
      empRoleDefault?.[0]?.customer_group_id ??
      empRole?.[0]?.customer_group_id ??
      0,
  });

  // GET CUSTOMER GROUP
  const { refetch: refetchCustomerGroup } = useGetCustomersGroupQuery({
    customerGroupId:
      empRoleDefault?.[0]?.customer_group_id ??
      empRole?.[0]?.customer_group_id ??
      0,
  });

  // Get settings
  const { settings } = useSettings();

  // GET QUEUE - Move this before the useEffect that calls refetchQueue
  const queryParams = useMemo(
    () => ({
      service_id: settings?.services ?? [],
      type_id: settings?.customerTypes ?? [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [settings?.services?.join(','), settings?.customerTypes?.join(',')]
  );

  // GET QUEUE with better caching control
  const {
    data: queue,
    refetch: QueueRefetch,
    isFetching: isQueueFetching,
  } = useGetQueueQuery(queryParams, {
    skip: !settings?.services || !settings?.customerTypes,
    // Force refetch every time to avoid stale data
    refetchOnMountOrArgChange: true,
    // Don't use cached data for this critical query
    refetchOnFocus: true,
  });

  const handleRefresh = async () => {
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
  };

  return {
    config,
    emp,
    empInformation,
    roleName,
    counterNo,
    handleRefresh,
    queue,
    QueueRefetch,
    isQueueFetching,
  };
};
