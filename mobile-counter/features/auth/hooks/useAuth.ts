import { useAppDispatch } from '@/libs/redux/hooks';
import { removeEmployee, setEmployee } from '@/libs/redux/state/employeeSlice';
import { resetAll } from '@/libs/redux/state/queueSlice';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import Toast from 'react-native-toast-message';
import { useEmployeeLoginMutation } from '../api/authApi';
import { LoginFormData } from '../types';
import { handleAuthError } from '../utils/errorHandler';
import { hasValidationErrors, validateLoginForm } from '../utils/validation';

interface AuthError {
  title?: string;
  message: string;
}

interface LoginResponse {
  success: boolean;
  data?: any;
  error?: string;
  errors?: Record<string, string>;
}

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [employeeLogin] = useEmployeeLoginMutation();

  const showToast = useCallback((type: 'success' | 'error', title: string, message: string) => {
    Toast.show({
      type,
      text1: title,
      text2: message,
    });
  }, []);

  const login = useCallback(async (formData: LoginFormData): Promise<LoginResponse> => {
    const errors = validateLoginForm(formData);
    if (hasValidationErrors(errors)) {
      const firstError = Object.values(errors)[0];
      showToast('error', 'Validation Error', firstError);
      return { success: false, errors };
    }

    setIsLoading(true);

    try {
      const res = await employeeLogin({
        id: formData.employeeId,
        pin: formData.pin,
      }).unwrap();

      if (res.ghError === 1001) {
        showToast('error', 'Login Failed', res.message || 'Invalid credentials');
        return { success: false, error: res.message };
      }

      dispatch(
        setEmployee({
          employee_id: res.employeeId,
          employee_no: formData.employeeId,
        })
      );

      showToast('success', 'Login Successful', res.message || 'Welcome back!');
      router.push('/(tabs)');

      return { success: true, data: res };
    } catch (error: unknown) {
      const authError = handleAuthError(error) as AuthError;
      showToast('error', authError.title || 'Login Failed', authError.message);
      return { success: false, error: authError.message };
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, employeeLogin, showToast]);

  const logout = useCallback(() => {
    dispatch(removeEmployee());
    dispatch(resetAll());
    router.push('/auth/login');
  }, [dispatch]);

  return {
    login,
    logout,
    isLoading,
  };
};
