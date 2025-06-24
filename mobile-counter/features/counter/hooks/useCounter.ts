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
import { useEffect, useMemo, useState } from 'react';

export const useCounter = () => {
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

  // GET QUEUE
  const { data: queue, refetch: QueueRefetch } = useGetQueueQuery(queryParams, {
    skip: !settings?.services || !settings?.customerTypes,
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRefresh = async () => {
    try {
      const refetchPromises = [
        refetchConfig(),
        refetchEmpInfo(),
        refetchEmpRole(),
        refetchEmpRoleDefault(),
        refetchEmpRoleTask(),
        refetchCustomerGroup(),
        QueueRefetch(),
      ];

      await Promise.all(refetchPromises);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  return {
    config,
    empInformation,
    roleName,
    counterNo,
    currentTime,
    handleRefresh,
    queue,
    QueueRefetch,
  };
};
