import { configApi } from "@/features/config/api/configApi";
import { customerApi } from "@/features/customer/api/customerApi";
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

  const [showMore, setShowMore] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState(false);

  const services = response?.results || [];
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        dispatch(serviceApi.util.invalidateTags(["Services"])),
        dispatch(configApi.util.invalidateTags(["Configs"])),
        dispatch(customerApi.util.invalidateTags(["Customer"])),
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  const mainServices = services.filter((service) => service.header_id === 0);
  const additionalServices = services.filter(
    (service) => service.header_id === 1
  );

  return {
    isLoading: isServicesLoading,
    isError: isServicesError,
    services,
    refreshing,
    onRefresh,
    showMore,
    mainServices,
    additionalServices,
    setShowMore,
  };
};
