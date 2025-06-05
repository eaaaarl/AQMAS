import { useState } from 'react';

interface ServiceItem {
    service_id: number;
    service_name: string;
    button_caption: string;
    header_id: number; // 1 for main, 0 for additional
}

// Mock data
const mockServices: ServiceItem[] = [
    { service_id: 1, service_name: 'New Accounts', button_caption: 'New Accounts', header_id: 1 },
    { service_id: 2, service_name: 'Encashment', button_caption: 'Encashment', header_id: 1 },
    { service_id: 3, service_name: 'Withdrawal', button_caption: 'Withdrawal', header_id: 1 },
    { service_id: 4, service_name: 'Account Inquiries', button_caption: 'Inquiries', header_id: 1 },
    { service_id: 5, service_name: 'Loans', button_caption: 'Loans', header_id: 0 },
    { service_id: 6, service_name: 'Deposit', button_caption: 'Deposit', header_id: 0 },
    { service_id: 7, service_name: 'Transfer', button_caption: 'Transfer', header_id: 0 },
    { service_id: 8, service_name: 'Bill Payment', button_caption: 'Bills', header_id: 0 },
    { service_id: 9, service_name: 'Statement', button_caption: 'Statement', header_id: 0 },
    { service_id: 10, service_name: 'Card Services', button_caption: 'Cards', header_id: 0 },
    { service_id: 11, service_name: 'Settings', button_caption: 'Settings', header_id: 0 },
];

export default function ServicePage() {
    const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
    const [showMore, setShowMore] = useState<boolean>(false);

    const mainServices = mockServices.filter(service => service.header_id === 1);
    const additionalServices = mockServices.filter(service => service.header_id === 0);

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

    const renderServiceItem = (service: ServiceItem) => (
        <button
            key={service.service_id}
            className={`h-32 m-1 rounded-lg flex flex-col items-center justify-center 
        ${selectedTransactions.includes(service.service_name)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
        transition-colors duration-200 w-full`}
            onClick={() => toggleTransaction(service.service_name)}
        >
            <span className="text-2xl">{getServiceIcon(service.service_name)}</span>
            <span className="mt-2 font-medium">{service.button_caption}</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-white p-4">
            <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-2 gap-4">
                    {!showMore ? (
                        <>
                            {mainServices.map((service) => (
                                <div key={service.service_id}>
                                    {renderServiceItem(service)}
                                </div>
                            ))}
                            {additionalServices.length > 0 && (
                                <button
                                    className="h-32 m-1 rounded-lg flex flex-col items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors"
                                    onClick={() => setShowMore(true)}
                                >
                                    <span className="text-2xl">➕</span>
                                    <span className="mt-2 font-medium">MORE</span>
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            {additionalServices.map((service) => (
                                <div key={service.service_id}>
                                    {renderServiceItem(service)}
                                </div>
                            ))}
                            <div className="col-span-2 flex justify-center">
                                <button
                                    className="h-32 m-1 rounded-lg flex items-center justify-center bg-gray-100 hover:bg-gray-200 px-8"
                                    onClick={() => setShowMore(false)}
                                >
                                    <span className="font-bold">Back to Main Services</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {selectedTransactions.length > 0 && (
                    <div className="w-full px-4 mt-8">
                        <button
                            className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg w-full font-bold"
                            onClick={() => alert(`Selected Services: ${selectedTransactions.join(', ')}`)}
                        >
                            PRINT RECEIPT ({selectedTransactions.length})
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}