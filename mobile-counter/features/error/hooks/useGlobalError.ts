import { useGetEmployeeInfoQuery } from '@/features/auth/api/authApi';
import { useGetConfigQuery } from '@/features/config/api/configApi';
import { useAppSelector } from '@/libs/redux/hooks';
import { useCallback, useMemo, useState } from 'react';

export const useGlobalError = () => {
  const [hasConnectionError, setHasConnectionError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const empId = useAppSelector(state => state.employee.employee_id);

  const { error: configError, refetch: refetchConfig } = useGetConfigQuery();
  const { error: empInfoError, refetch: refetchEmpInfo } =
    useGetEmployeeInfoQuery({ empId: empId as number }, { skip: !empId });

  const connectionError = useMemo(() => {
    const isConfigError =
      configError &&
      'status' in configError &&
      configError.status === 'FETCH_ERROR';

    const isEmpInfoError =
      empInfoError &&
      'status' in empInfoError &&
      empInfoError.status === 'FETCH_ERROR';

    return Boolean(isConfigError || isEmpInfoError);
  }, [configError, empInfoError]);

  useMemo(() => {
    setHasConnectionError(connectionError);
  }, [connectionError]);

  const handleRetry = useCallback(async () => {
    setIsRetrying(true);

    try {
      const refetchPromises = [refetchConfig()];

      if (empId) {
        refetchPromises.push(refetchEmpInfo() as any);
      }

      await Promise.all(refetchPromises);
      setHasConnectionError(false);
    } catch (error) {
      console.error('Retry failed:', error);
    } finally {
      setIsRetrying(false);
    }
  }, [refetchConfig, refetchEmpInfo, empId]);

  const handleDismiss = useCallback(() => {
    setHasConnectionError(false);
  }, []);

  return useMemo(
    () => ({
      hasConnectionError,
      isRetrying,
      handleRetry,
      handleDismiss,
    }),
    [hasConnectionError, isRetrying, handleRetry, handleDismiss]
  );
};
