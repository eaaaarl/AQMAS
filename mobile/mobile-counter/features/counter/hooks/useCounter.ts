import { useGetEmployeeInfoQuery, useGetEmployeeRoleQuery } from '@/features/auth/api/authApi';
import { useGetConfigQuery } from '@/features/config/api/configApi';
import { useAppSelector } from '@/libs/redux/hooks';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Ticket } from '../types';

export const useCounter = () => {
  // GET CONFIG
  const { data: config } = useGetConfigQuery();

  // GET STATE EMPLOYEE INFORMATION
  const emp = useAppSelector((state) => state.employee);

  // GET EMPLOYEE INFORMATION 
  const { data: empInfo } = useGetEmployeeInfoQuery({ empId: emp.employee_id as number });
  const empInformation = empInfo?.results || [];

  // GET EMPLOYEE ROLE BY EMPLOYEE ID
  const { data: empRole } = useGetEmployeeRoleQuery({ emp_id: empInformation?.[0]?.employee_id });

  // GET ROLE NAME
  const roleName = empRole?.[0]?.role_name;

  // GET COUNTER NO
  const counterNo = empRole?.[0]?.counter_no;

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
    remaining: 16
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
      remaining: prev.remaining - 1
    }));
  };

  const handleSkip = () => {
    Alert.alert('Skip', 'Skipping current customer');
    setCurrentTicket(prev => ({
      ...prev,
      skipped: prev.skipped + 1,
      remaining: prev.remaining - 1
    }));
  };

  return {
    config,
    empInformation,
    roleName,
    counterNo,
    currentTime,
    currentTicket,
    handleNext,
    handleRecall,
    handleFinished,
    handleSkip
  };
}; 