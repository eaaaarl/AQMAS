import { configApi } from "@/features/config/api/configApi";
import { customerApi } from "@/features/customer/api/customerApi";
import { queueApi } from "@/features/queue/api/queueApi";
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
  const [currentPage, setCurrentPage] = useState(0);

  const services = response?.results || [];
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        dispatch(serviceApi.util.invalidateTags(["Services"])),
        dispatch(configApi.util.invalidateTags(["Configs"])),
        dispatch(customerApi.util.invalidateTags(["Customer"])),
        dispatch(queueApi.util.invalidateTags(["Queue"])),
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  const mainServices = services.filter((service) => service.header_id === 0);
  const additionalServices = services.filter(
    (service) => service.header_id === 1
  );
  const SERVICES_PER_PAGE = 4;
  const totalPages = Math.ceil(services.length / SERVICES_PER_PAGE);
  const paginatedServices = services.slice(
    currentPage * SERVICES_PER_PAGE,
    (currentPage + 1) * SERVICES_PER_PAGE
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
    totalPages,
    paginatedServices,
    currentPage,
    setCurrentPage,
  };
};
