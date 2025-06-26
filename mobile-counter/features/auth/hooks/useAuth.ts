import { useAppDispatch } from '@/libs/redux/hooks';
import { removeEmployee, setEmployee } from '@/libs/redux/state/employeeSlice';
import { resetAll } from '@/libs/redux/state/queueSlice';
import { router } from 'expo-router';
import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { useEmployeeLoginMutation } from '../api/authApi';
import { LoginFormData } from '../types';
import { handleAuthError } from '../utils/errorHandler';
import { hasValidationErrors, validateLoginForm } from '../utils/validation';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const [employeeLogin] = useEmployeeLoginMutation();

  const login = async (formData: LoginFormData) => {
    const errors = validateLoginForm(formData);
    if (hasValidationErrors(errors)) {
      const firstError = Object.values(errors)[0];
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: firstError,
      });
      return { success: false, errors };
    }

    setIsLoading(true);

    try {
      const res = await employeeLogin({
        id: formData.employeeId,
        pin: formData.pin,
      }).unwrap();
      if (res.ghError === 1001) {
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: res.message || 'Invalid credentials',
        });
        return { success: false, error: res.message };
      }

      dispatch(
        setEmployee({
          employee_id: res.employeeId,
          employee_no: formData.employeeId,
        })
      );

      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: res.message || 'Welcome back!',
      });

      // Navigate to main app
      router.push('/(tabs)');

      return { success: true, data: res };
    } catch (error: any) {
      const authError = handleAuthError(error);

      Toast.show({
        type: 'error',
        text1: authError.title || 'Login Failed',
        text2: authError.message,
      });

      return { success: false, error: authError.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    dispatch(removeEmployee());
    dispatch(resetAll());
    router.push('/auth/login');
  };

  return {
    login,
    logout,
    isLoading,
  };
};
