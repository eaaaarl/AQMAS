import { useState } from "react";
import { useGetServicesQuery } from "../api/serviceApi";


export const useService = () => {
    const { data: services = [], isError, isLoading } = useGetServicesQuery();
    const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
    const [showMore, setShowMore] = useState<boolean>(false);

    const activeServices = services.filter(service =>
        service.is_active?.data?.[0] === 1
    );

    const mainServices = activeServices.filter(service => service.header_id === 1);
    const additionalServices = activeServices.filter(service => service.header_id === 0);

    const getServiceIcon = (serviceName: string): string => {
        const iconMap: Record<string, string> = {
            'New Accounts': '📝',
            'Encashment': '💵',
            'Withdrawal': '🏧',
            'Account Inquiries': '🔍',
            'Loans': '🏦',
            'Deposit': '💰',
            'Transfer': '↔️',
            'Bill Payment': '🧾',
            'Statement': '📄',
            'Card Services': '💳',
            'Settings': '⚙️',
            'Service Name 1': '📋',
            'Service Name 3': '📋',
            'Widthrawal': '🏧'
        };
        return iconMap[serviceName] || '📋';
    };

    const toggleTransaction = (name: string) => {
        setSelectedTransactions(prev => {
            if (prev.includes(name)) {
                return prev.filter(item => item !== name);
            } else {
                return [...prev, name];
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
        activeServices,
        mainServices,
        additionalServices,
        getServiceIcon,
        toggleTransaction
    }
}