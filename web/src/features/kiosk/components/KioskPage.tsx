import type { Service } from '../interface/service.interface';
import { useService } from '../hooks/useService';
import { useConfig } from '@/features/config/hooks/useConfig';
import { useState } from 'react';
import { useCallQueueMutation, useGetAllServiceCountQuery, useGetByServiceCountQuery, useGetQueueCountQuery } from '../api/queueApi';
import { useGetAllCustomerTypeQuery } from '../api/customerApi';
import { useToast } from "@/lib/redux/hooks/useUI";
import { Toast } from "@/components/ui/toast";
import { useNavigate } from 'react-router-dom';


export default function KioskPage() {
    //console.log('Parent Component Rendered')
    const router = useNavigate();
    const [selectedTransactions, setSelectedTransactions] = useState<Service[]>([]);

    const {
        additionalServices,
        isError,
        isLoading,
        mainServices,
        setShowMore,
        showMore,
        toggleTransaction,
    } = useService()

    const { AskCustomerName, SequenceByServices } = useConfig()
    const { data: allCustomerType } = useGetAllCustomerTypeQuery();
    const customerTypeDefault = allCustomerType?.data.find(def => def?.default?.data[0] === 1);
    const { data: allServiceCount, refetch: refetchAllServiceCount } = useGetAllServiceCountQuery()
    const { data: byServiceCount, refetch: refetchByServiceCount } = useGetByServiceCountQuery({ service_id: selectedTransactions?.[0]?.service_id || 0 })
    const { data: queueCount, refetch: refetchQueueCount } = useGetQueueCountQuery({ type_id: customerTypeDefault?.type_id.toString() || '' })

    const [callQueue, { isLoading: isCallQueueLoading }] = useCallQueueMutation()

    const singleTransOnly = selectedTransactions.length === 1 ? 1 : 0;
    const selectedServiceFormat = selectedTransactions?.[0]?.service_format;

    const generateTicketNumber = () => {
        let Ticket;
        let CountQueue;
        let CountAllService;
        let CountByService;

        if (customerTypeDefault?.own_sequence?.data[0] === 1) {
            CountQueue = queueCount?.data?.count + 1 || 0
            if (singleTransOnly) {
                Ticket = `${selectedServiceFormat}${CountQueue}${customerTypeDefault?.suffix}`
            } else {
                Ticket = `${CountQueue}${customerTypeDefault?.suffix}`
            }
        } else {
            if (!SequenceByServices) {
                CountAllService = allServiceCount?.data?.count + 1 || 0
                if (singleTransOnly) {
                    Ticket = `${selectedServiceFormat}${CountAllService}${customerTypeDefault?.suffix}`
                } else {
                    Ticket = `${CountAllService}${customerTypeDefault?.suffix}`
                }
            } else {
                CountByService = byServiceCount?.data?.count + 1 || 0
                if (singleTransOnly) {
                    Ticket = `${selectedServiceFormat}${CountByService}${customerTypeDefault?.suffix}`
                } else {
                    Ticket = `${CountByService}${customerTypeDefault?.suffix}`
                }
            }
        }

        return Ticket;
    };

    const handlePrintReceipt = async () => {
        if (AskCustomerName) {
            router('/customer-name?Ticket=' + generateTicketNumber() + '&ServiceId=' + selectedTransactions.map(st => st.service_id).join(','))
        }
    }


    const renderServiceItem = (service: Service) => (
        <button
            key={service.service_id}
            className={`rounded-lg flex flex-col items-center justify-center h-24 uppercase
                ${selectedTransactions.find((t) => t.service_name === service.service_name)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
                transition-colors duration-200 w-full`}
            onClick={() => toggleTransaction(service, (transactions) => {
                setSelectedTransactions(transactions)
            })}
        >
            <span className="mt-2 font-bold">{service.button_caption}</span>
        </button>
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white p-4 flex flex-col items-center justify-center">
                <div className="w-full max-w-2xl">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((index) => (
                            <div key={index} className="w-full">
                                <div className="rounded-lg h-24 bg-gray-200 animate-pulse flex items-center justify-center">
                                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-white p-4 flex flex-col items-center justify-center">
                <div className="text-xl font-medium text-red-500">Error loading services</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white p-4 flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl">
                <div className='mb-4'>
                    {selectedTransactions.map((st) => st.service_name).join(' | ')}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {!showMore ? (
                        <>
                            {mainServices.map((service) => (
                                <div key={service.service_id} className="w-full">
                                    {renderServiceItem(service)}
                                </div>
                            ))}
                            {additionalServices.length > 0 && (
                                <button
                                    className={`rounded-lg flex flex-col items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors w-full`}
                                    onClick={() => setShowMore(true)}
                                >
                                    <span className="mt-2 font-bold">MORE</span>
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            {additionalServices.map((service) => (
                                <div key={service.service_id} className="w-full">
                                    {renderServiceItem(service)}
                                </div>
                            ))}
                            <div className="col-span-2 md:col-span-3 w-full">
                                <button
                                    className="h-24 rounded-lg flex items-center justify-center bg-gray-100 hover:bg-gray-200 w-full"
                                    onClick={() => setShowMore(false)}
                                >
                                    <span className="font-bold">Back to Main Services</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {selectedTransactions.length > 0 && (
                    <div className="w-full my-8">
                        <button
                            disabled={isCallQueueLoading}
                            className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg w-full font-bold"
                            onClick={() => handlePrintReceipt()}
                        >
                            {isCallQueueLoading ? 'PRINTING...' : `PRINT RECEIPT (${selectedTransactions.length})`}
                        </button>
                    </div>
                )}
            </div>


            <Toast id="kiosk-notification" />

        </div>
    );
}