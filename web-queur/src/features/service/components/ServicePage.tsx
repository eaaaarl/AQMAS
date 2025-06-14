import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import type { Service } from '../api/interface';
import { useService } from '../hooks/useService';
import CustomerNameModal from './CustomerNameModal';
import { setModalOpen } from '@/lib/redux/state/modalSlice';
import { useConfig } from '@/features/config/hooks/useConfig';
import { useState } from 'react';


export default function ServicePage() {
    const dispatch = useAppDispatch()
    const { open } = useAppSelector((state) => state.modal)
    const {
        additionalServices,
        isError,
        isLoading,
        mainServices,
        selectedTransactions,
        setShowMore,
        showMore,
        toggleTransaction,
        setSelectedTransactions
    } = useService()

    const { AskCustomerName } = useConfig()
    const [customerName, setCustomerName] = useState('');

    const handleCancelCustomerNameModal = () => {
        dispatch(setModalOpen(false))
        setCustomerName("")
    }
    const handlePrintReceipt = async () => {
        if (AskCustomerName && !customerName) {
            dispatch(setModalOpen(true))
            return;
        }
        await callQueueConfirm()
    }

    const handleConfirmCustomerName = async () => {
        await callQueueConfirm()
    }

    const callQueueConfirm = async () => {
        let ticket;
        const count = 1;
        if (selectedTransactions.length === 1) {
            ticket = `${selectedTransactions[0].service_format}${count}`
        } else {
            ticket = `${count}`
        }

        alert(ticket)


        // Reset state
        setCustomerName("")
        dispatch(setModalOpen(false))
        setSelectedTransactions([])
    }

    const renderServiceItem = (service: Service) => (
        <button
            key={service.service_id}
            className={`h-42 rounded-lg flex flex-col items-center justify-center 
                ${selectedTransactions.find((t) => t.service_name === service.service_name)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
                transition-colors duration-200 w-full`}
            onClick={() => toggleTransaction(service)}
        >
            <span className="mt-2 font-bold">{service.button_caption}</span>
        </button>
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white p-4 flex flex-col items-center justify-center">
                <div className="text-xl font-medium">Loading services...</div>
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
                                    className={`h-42 rounded-lg flex flex-col items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors w-full`}
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
                                    className="h-32 rounded-lg flex items-center justify-center bg-gray-100 hover:bg-gray-200 w-full"
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
                            className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg w-full font-bold"
                            onClick={() => handlePrintReceipt()}
                        >
                            PRINT RECEIPT ({selectedTransactions.length})
                        </button>
                    </div>
                )}
            </div>



            <CustomerNameModal
                open={open}
                onCancel={handleCancelCustomerNameModal}
                name={customerName}
                setName={setCustomerName}
                onConfirm={handleConfirmCustomerName}
            />

        </div>
    );
}