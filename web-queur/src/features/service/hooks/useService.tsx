import { useState } from "react";
import { useGetServicesQuery } from "../api/serviceApi";
import type { Service } from "../api/interface";


export const useService = () => {
    const { data: services, isError, isLoading } = useGetServicesQuery();
    const [selectedTransactions, setSelectedTransactions] = useState<Service[]>([]);
    const [showMore, setShowMore] = useState<boolean>(false);

    const transService = services?.results || []
    const mainServices = transService.filter(service => service.header_id === 1);
    const additionalServices = transService.filter(service => service.header_id === 0);

    const toggleTransaction = (service: Service) => {
        setSelectedTransactions(prev => {
            if (prev.some(item => item.service_name === service.service_name)) {
                return prev.filter(item => item.service_name !== service.service_name);
            } else {
                return [...prev, service];
            }
        });
    };


    return {
        services,
        isError,
        isLoading,
        selectedTransactions,
        setSelectedTransactions,
        showMore,
        setShowMore,
        transService,
        mainServices,
        additionalServices,
        toggleTransaction
    }
}