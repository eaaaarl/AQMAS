import { useAppSelector } from '@/libs/redux/hooks';
import {
  useGetEmployeeInfoQuery,
  useGetEmployeeProfileImageQuery,
  useGetEmployeeRoleDefaultQuery,
  useGetEmployeeRoleQuery,
} from '../api/authApi';

export const useEmployeeData = (employeeId?: string) => {
  const currentEmployee = useAppSelector(state => state.employee);

  const empId = employeeId || currentEmployee.employee_id || 0;

  const {
    data: employeeInfo,
    isLoading: isLoadingEmployee,
    error: employeeError,
    refetch: refetchEmployee,
  } = useGetEmployeeInfoQuery({ empId: empId as number }, { skip: !empId });

  const { data: employeeProfileImage } = useGetEmployeeProfileImageQuery(
    { imageUrl: employeeInfo?.results?.[0]?.picture || '' },
    { skip: !employeeInfo?.results?.[0]?.picture }
  );

  const {
    data: employeeRoles,
    isLoading: isLoadingRoles,
    error: rolesError,
    refetch: refetchRoles,
  } = useGetEmployeeRoleQuery({ emp_id: Number(empId) }, { skip: !empId });

  const {
    data: employeeRoleDefault,
    isLoading: isLoadingRoleDefault,
    error: roleDefaultError,
    refetch: refetchRoleDefault,
  } = useGetEmployeeRoleDefaultQuery(
    { emp_id: Number(empId) },
    { skip: !empId }
  );

  return {
    employeeInfo: employeeInfo?.results || [],
    employeeProfileImage: employeeProfileImage || null,
    employeeRoles: employeeRoles || [],
    employeeRoleDefault: employeeRoleDefault || [],
    isLoading: isLoadingEmployee || isLoadingRoles || isLoadingRoleDefault,
    error: employeeError || rolesError || roleDefaultError,
    refetch: () => {
      refetchEmployee();
      refetchRoles();
      refetchRoleDefault();
    },
  };
};
