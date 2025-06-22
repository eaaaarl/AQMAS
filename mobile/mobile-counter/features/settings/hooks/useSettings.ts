import { useGetEmployeeInfoQuery } from '@/features/auth/api/authApi';
import { useAppDispatch, useAppSelector } from '@/libs/redux/hooks';
import { removeEmployee } from '@/libs/redux/state/employeeSlice';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import { SettingsState } from '../types';

export const useSettings = () => {
  const dispatch = useAppDispatch();
  const emp = useAppSelector(state => state.employee);
  const { data: empInfo, refetch: refetchEmpInfo } = useGetEmployeeInfoQuery({
    empId: emp.employee_id as number,
  });
  const empInformation = empInfo?.results || [];

  const [settings, setSettings] = useState<SettingsState>({
    customerTypes: {
      seniorCitizen: true,
      vip: true,
      regularCustomer: true,
    },
    services: {
      cash: true,
      credit: true,
    },
  });

  const handleRefresh = async () => {
    try {
      await refetchEmpInfo();
    } catch (error) {
      console.error('Error refreshing employee data:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            dispatch(removeEmployee());
            router.push('/auth/login');
          } catch (error) {
            console.error('Error during logout:', error);
            dispatch(removeEmployee());
            router.push('/auth/login');
          }
        },
      },
    ]);
  };

  const updateCustomerType = (
    type: keyof SettingsState['customerTypes'],
    value: boolean
  ) => {
    setSettings(prev => ({
      ...prev,
      customerTypes: {
        ...prev.customerTypes,
        [type]: value,
      },
    }));
  };

  const updateService = (
    service: keyof SettingsState['services'],
    value: boolean
  ) => {
    setSettings(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [service]: value,
      },
    }));
  };

  return {
    empInformation,
    settings,
    handleRefresh,
    handleLogout,
    updateCustomerType,
    updateService,
  };
};
