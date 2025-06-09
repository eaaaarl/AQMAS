import { useGetConfigsQuery } from "@/features/config/api/configApi";
import { useState } from "react";
import { useGetServicesQuery } from "../api/serviceApi";

export const useService = () => {
  const {
    data: response,
    isLoading: isServicesLoading,
    isError: isServicesError,
    refetch: refetchServices,
  } = useGetServicesQuery();

  const {
    refetch: refetchConfigs,
    isLoading: isConfigsLoading,
    isError: isConfigsError,
  } = useGetConfigsQuery();

  const [selectedTransactions, setSelectedTransactions] = useState<string[]>(
    []
  );
  const [showMore, setShowMore] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState(false);

  const services = response?.results || [];
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchServices(), refetchConfigs()]);
    } finally {
      setRefreshing(false);
    }
  };

  const mainServices = services.filter((service) => service.header_id === 0);

  const additionalServices = services.filter(
    (service) => service.header_id === 1
  );

  const toggleTransaction = (name: string) => {
    setSelectedTransactions((prev) => {
      if (prev.includes(name)) {
        return prev.filter((item) => item !== name);
      } else {
        return [...prev, name];
      }
    });
  };

  return {
    selectedTransactions,
    toggleTransaction,
    isLoading: isServicesLoading || isConfigsLoading,
    isError: isServicesError || isConfigsError,
    services,
    refreshing,
    onRefresh,
    showMore,
    mainServices,
    additionalServices,
    setShowMore,
  };
};
