import { useState } from "react";
import { useGetServicesQuery } from "../api/serviceApi";
import type { Service } from "../interface/service.interface";


export const useService = () => {
    const { data: services, isError, isLoading } = useGetServicesQuery();
    const [selectedTransactions, setSelectedTransactions] = useState<Service[]>([]);
    const [showMore, setShowMore] = useState<boolean>(false);
    const transService = services?.data || []
    const mainServices = transService.filter(service => service.header_id === 1);
    const additionalServices = transService.filter(service => service.header_id === 0);

    const toggleTransaction = (service: Service, callback?: (transactions: Service[]) => void) => {
        setSelectedTransactions(prev => {
            const newTransactions = prev.some(item => item.service_name === service.service_name)
                ? prev.filter(item => item.service_name !== service.service_name)
                : [...prev, service];

            if (callback) {
                callback(newTransactions);
            }

            return newTransactions;
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