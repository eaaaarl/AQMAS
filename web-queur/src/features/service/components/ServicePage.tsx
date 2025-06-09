
import type { ServiceResponse } from '../api/interface';
import { useService } from '../hooks/useService';


export default function ServicePage() {

    const { additionalServices,
        getServiceIcon,
        isError,
        isLoading,
        mainServices,
        selectedTransactions,
        setShowMore,
        showMore,
        toggleTransaction
    } = useService()

    const renderServiceItem = (service: ServiceResponse) => (
        <button
            key={service.service_id}
            className={`h-42 rounded-lg flex flex-col items-center justify-center 
                ${selectedTransactions.includes(service.service_name)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
                transition-colors duration-200 w-full`}
            onClick={() => toggleTransaction(service.service_name)}
        >
            <span className="text-4xl">{getServiceIcon(service.service_name)}</span>
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
                    {selectedTransactions.map((st) => st).join(' | ')}
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
                                    <span className="text-2xl">➕</span>
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
                    <div className="w-full mt-8">
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