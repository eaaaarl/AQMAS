import { useAppDispatch, useAppSelector } from '@/libs/redux/hooks';
import { removeEmployee } from '@/libs/redux/state/employeeSlice';
import { resetAll } from '@/libs/redux/state/queueSlice';
import {
  setCustomerTypes,
  setServices,
  updateCustomerType,
  updateService,
} from '@/libs/redux/state/settingsSlice';
import { router } from 'expo-router';
import { Alert } from 'react-native';

export const useSettings = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(state => state.settings);

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
            dispatch(resetAll());
            router.push('/auth/login');
          } catch (error) {
            console.error('Error during logout:', error);
            dispatch(removeEmployee());
            dispatch(resetAll());
            router.push('/auth/login');
          }
        },
      },
    ]);
  };

  const updateCustomerTypeHandler = (typeId: number, value: boolean) => {
    dispatch(updateCustomerType({ typeId, enabled: value }));
  };

  const updateServiceHandler = (serviceId: number, value: boolean) => {
    dispatch(updateService({ serviceId, enabled: value }));
  };

  const setCustomerTypesHandler = (types: number[]) => {
    dispatch(setCustomerTypes(types));
  };

  const setServicesHandler = (services: number[]) => {
    dispatch(setServices(services));
  };

  return {
    settings,
    handleLogout,
    updateCustomerType: updateCustomerTypeHandler,
    updateService: updateServiceHandler,
    setCustomerTypes: setCustomerTypesHandler,
    setServices: setServicesHandler,
  };
};
