import { useGetEmployeeInfoQuery } from "@/features/auth/api/authApi";
import { useGetConfigQuery } from "@/features/config/api/configApi";
import { useAppSelector } from "@/libs/redux/hooks";
import { useEffect, useState } from "react";

export const useGlobalError = () => {
  const [hasConnectionError, setHasConnectionError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  // Get employee from Redux state
  const emp = useAppSelector((state) => state.employee);

  // API queries that we'll monitor for errors
  const { error: configError, refetch: refetchConfig } = useGetConfigQuery();
  const { error: empInfoError, refetch: refetchEmpInfo } =
    useGetEmployeeInfoQuery(
      { empId: emp.employee_id as number },
      { skip: !emp.employee_id }
    );

  // Check for connection errors
  useEffect(() => {
    const checkForConnectionError = () => {
      const hasError =
        (configError &&
          "status" in configError &&
          configError.status === "FETCH_ERROR") ||
        (empInfoError &&
          "status" in empInfoError &&
          empInfoError.status === "FETCH_ERROR");

      setHasConnectionError(hasError || false);
    };

    checkForConnectionError();
  }, [configError, empInfoError]);

  // Retry function to attempt reconnection
  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await Promise.all([
        refetchConfig(),
        emp.employee_id ? refetchEmpInfo() : Promise.resolve(),
      ]);
      setHasConnectionError(false);
    } catch (error) {
      console.error("Retry failed:", error);
      // Keep error state if retry fails
    } finally {
      setIsRetrying(false);
    }
  };

  // Dismiss error (temporary)
  const handleDismiss = () => {
    setHasConnectionError(false);
  };

  return {
    hasConnectionError,
    isRetrying,
    handleRetry,
    handleDismiss,
  };
};
