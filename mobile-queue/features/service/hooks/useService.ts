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

  // Debug logging to understand the data structure
  // console.log("=== useService Debug ===");
  // console.log("All services:", services);
  // console.log(
  //   "Services header_ids:",
  //   services.map((s) => s.header_id)
  // );
  // console.log("Unique header_ids:", [
  //   ...new Set(services.map((s) => s.header_id)),
  // ]);
  // console.log("========================");

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

  // Updated filtering logic to handle various header_id values
  // Main services: header_id === 0 or the first group of services
  const mainServices = services.filter((service) => service.header_id === 0);

  // If no main services found, use the first group of services by header_id
  const firstHeaderId = services.length > 0 ? services[0].header_id : 0;
  const fallbackMainServices =
    mainServices.length === 0
      ? services.filter((service) => service.header_id === firstHeaderId)
      : [];

  // Additional services: header_id === 1 or other header_ids
  const additionalServices = services.filter(
    (service) => service.header_id === 1
  );

  // If no additional services found, use all other services
  const fallbackAdditionalServices =
    additionalServices.length === 0
      ? services.filter((service) => service.header_id !== firstHeaderId)
      : [];

  // Use fallback services if the original filters return empty arrays
  const finalMainServices =
    mainServices.length > 0 ? mainServices : fallbackMainServices;
  const finalAdditionalServices =
    additionalServices.length > 0
      ? additionalServices
      : fallbackAdditionalServices;

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
    mainServices: finalMainServices,
    additionalServices: finalAdditionalServices,
    setShowMore,
    totalPages,
    paginatedServices,
    currentPage,
    setCurrentPage,
  };
};
