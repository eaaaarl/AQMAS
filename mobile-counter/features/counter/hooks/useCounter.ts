import {
  useGetEmployeeInfoQuery,
  useGetEmployeeRoleDefaultQuery,
  useGetEmployeeRoleQuery,
  useGetEmployeeRoleTaskQuery,
} from '@/features/auth/api/authApi';
import { useGetConfigQuery } from '@/features/config/api/configApi';
import { useGetCustomersGroupQuery } from '@/features/customer/api/customerApi';
import { useGetQueueQuery } from '@/features/queue/api/queueApi';
import { useAppSelector } from '@/libs/redux/hooks';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Ticket } from '../types';

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

  const [currentTime, setCurrentTime] = useState(new Date());

  const [currentTicket, setCurrentTicket] = useState<Ticket>({
    number: 'CR1RE',
    customerName: 'EARL1',
    service: 'CREDIT',
    customerType: 'REGULAR CUSTOMER II',
    finished: 0,
    skipped: 0,
    bestTime: '',
    worstTime: '',
    remaining: 16,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRefresh = async () => {
    try {
      await Promise.all([
        refetchConfig(),
        refetchEmpInfo(),
        refetchEmpRole(),
        refetchEmpRoleDefault(),
        refetchEmpRoleTask(),
        refetchCustomerGroup(),
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  const { data: queue, refetch: refetchQueue } = useGetQueueQuery(
    {
      service_id: [1, 2, 3],
      type_id: [3, 1],
    },
    { skip: !emp.employee_id }
  );

  const handleNext = () => {
    Alert.alert('Next', 'Moving to next customer');
  };

  const handleRecall = () => {
    Alert.alert('Recall', 'Recalling current customer');
  };

  const handleFinished = () => {
    Alert.alert('Finished', 'Marking customer as finished');
    setCurrentTicket(prev => ({
      ...prev,
      finished: prev.finished + 1,
      remaining: prev.remaining - 1,
    }));
  };

  const handleSkip = () => {
    Alert.alert('Skip', 'Skipping current customer');
    setCurrentTicket(prev => ({
      ...prev,
      skipped: prev.skipped + 1,
      remaining: prev.remaining - 1,
    }));
  };

  return {
    config,
    empInformation,
    roleName,
    counterNo,
    currentTime,
    currentTicket,
    handleRefresh,
    handleNext,
    handleRecall,
    handleFinished,
    handleSkip,
  };
};
