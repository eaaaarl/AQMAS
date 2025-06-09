import { useState } from "react";
import { useGetServicesQuery } from "../api/serviceApi";

export const useService = () => {
  const { data: response, isLoading, isError, refetch } = useGetServicesQuery();
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>(
    []
  );
  const [showMore, setShowMore] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState(false);

  const services = response?.results || [];

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
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
    isLoading,
    services,
    isError,
    refreshing,
    onRefresh,
    showMore,
    mainServices,
    additionalServices,
    setShowMore,
  };
};
