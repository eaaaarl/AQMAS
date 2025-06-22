import { useAppSelector } from '@/libs/redux/hooks';
import {
  useGetEmployeeInfoQuery,
  useGetEmployeeRoleQuery,
} from '../api/authApi';

export const useEmployeeData = (employeeId?: number) => {
  const currentEmployee = useAppSelector(state => state.auth.employee);

  // Use provided employeeId or fall back to current employee
  const empId = employeeId || currentEmployee?.employee_id || 0;

  const {
    data: employeeInfo,
    isLoading: isLoadingEmployee,
    error: employeeError,
    refetch: refetchEmployee,
  } = useGetEmployeeInfoQuery({ empId }, { skip: !empId });

  const {
    data: employeeRoles,
    isLoading: isLoadingRoles,
    error: rolesError,
    refetch: refetchRoles,
  } = useGetEmployeeRoleQuery({ emp_id: empId }, { skip: !empId });

  return {
    employeeInfo: employeeInfo?.results?.[0] || null,
    employeeRoles: employeeRoles || [],
    isLoading: isLoadingEmployee || isLoadingRoles,
    error: employeeError || rolesError,
    refetch: () => {
      refetchEmployee();
      refetchRoles();
    },
  };
};
