import { configApi, useGetConfigsQuery } from "@/features/config/api/configApi";
import { useAppDispatch } from "@/libs/redux/hooks";
import { useState } from "react";
import { serviceApi, useGetServicesQuery } from "../api/serviceApi";

export const useService = () => {
  const dispatch = useAppDispatch();
  const {
    data: response,
    isLoading: isServicesLoading,
    isError: isServicesError,
  } = useGetServicesQuery();

  const {
    isLoading: isConfigsLoading,
    isError: isConfigsError,
    data: configData,
  } = useGetConfigsQuery();

  const [selectedTransactions, setSelectedTransactions] = useState<string[]>(
    []
  );
  const [showMore, setShowMore] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState(false);

  const services = response || [];
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        dispatch(serviceApi.util.invalidateTags(["Services"])),
        dispatch(configApi.util.invalidateTags(["Configs"])),
      ]);
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
    configData,
  };
};
