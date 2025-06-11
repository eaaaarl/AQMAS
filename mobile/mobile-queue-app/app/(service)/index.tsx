import { useConfig } from '@/features/config/hooks/useConfig';
import { useGetCustomerTypeQuery } from '@/features/customer/api/customerApi';
import CustomerNameModal from '@/features/queue/components/CustomerNameModal';
import CustomerTypeModal from '@/features/queue/components/CustomerTypeModal';
import { useQueue } from '@/features/queue/hooks/useQueue';
import { PaginationControls } from '@/features/service/components/PaginationControl';
import { ServiceItem } from '@/features/service/components/ServiceItem';
import { useService } from '@/features/service/hooks/useService';
import { renderError } from '@/features/service/utils/errorUtils';
import { renderLoading, renderNoServices } from '@/features/service/utils/loadingUtils';
import { useState } from 'react';
import { Dimensions, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Transaction() {
  const {
    additionalServices,
    isError,
    isLoading,
    mainServices,
    onRefresh,
    refreshing,
    services,
    setShowMore,
    showMore,
  } = useService()

  const {
    isConfigsError,
    isConfigsLoading,
    shouldShowAllServices,
  } = useConfig()

  const {
    toggleTransactions,
    selectedTransactions,
    handleSubmitReceipt,
    showCustomerType,
    handleCancelType,
    customerType,
    handleSetCustomerType,
    handleCustomerTypeConfirm,

    handleCustomerNameConfirm,
    handleSetCustomerName,
    handleCancelName,
    customerName,
    showCustomerName
  } = useQueue()

  const { data: customerTypeData } = useGetCustomerTypeQuery({ is_show: '1' })
  const [currentPage, setCurrentPage] = useState(0);

  const { width, height } = Dimensions.get('window');
  const isLandscape = width > height;
  const cardWidth = isLandscape ? (width - 60) / 3 : (width - 40) / 2;

  const SERVICES_PER_PAGE = 4;
  const totalPages = Math.ceil(services.length / SERVICES_PER_PAGE);

  const paginatedServices = services.slice(
    currentPage * SERVICES_PER_PAGE,
    (currentPage + 1) * SERVICES_PER_PAGE
  );

  if (isLoading || isConfigsLoading) {
    return (
      renderLoading()
    );
  }

  if (services.length === 0) {
    return (
      renderNoServices()
    );
  }

  if (isError || isConfigsError) {
    return (
      renderError()
    );
  }

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 10,
          paddingVertical: 20,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#0000FF']}
            tintColor="#0000FF"
          />
        }
      >
        <View className="flex-1 justify-center items-center">
          <View className='gap-4' style={{
            width: '100%',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: isLandscape ? '90%' : '100%',
          }}>
            {shouldShowAllServices ? (
              <>
                {paginatedServices.map((service) => (
                  <View key={service.service_id} style={{ width: cardWidth, minWidth: isLandscape ? 180 : cardWidth }}>
                    <ServiceItem
                      service={service}
                      cardWidth={cardWidth}
                      isSelected={selectedTransactions.some(item => item.service_id === service.service_id)}
                      onPress={() => toggleTransactions(service)}
                    />
                  </View>
                ))}
              </>
            ) : (
              <>
                {!showMore ? (
                  <>
                    {mainServices.map((service) => (
                      <View key={service.service_id} style={{ width: cardWidth, minWidth: isLandscape ? 180 : cardWidth }}>
                        <ServiceItem
                          service={service}
                          cardWidth={cardWidth}
                          isSelected={selectedTransactions.some(item => item.service_id === service.service_id)}
                          onPress={() => toggleTransactions(service)}
                        />
                      </View>
                    ))}
                    {additionalServices.length > 0 && (
                      <View style={{ width: cardWidth }}>
                        <TouchableOpacity
                          className="h-32 m-1 rounded-full items-center shadow-lg border border-gray-300 justify-center bg-gray-100"
                          onPress={() => setShowMore(true)}
                        >
                          <Text className="mt-2 text-3xl font-medium text-center text-gray-800">More</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </>
                ) : (
                  <>
                    {additionalServices.map((service) => (
                      <View key={service.service_id} style={{ width: cardWidth, minWidth: isLandscape ? 180 : cardWidth }}>
                        <ServiceItem
                          service={service}
                          cardWidth={cardWidth}
                          isSelected={selectedTransactions.some(item => item.service_id === service.service_id)}
                          onPress={() => toggleTransactions(service)}
                        />
                      </View>
                    ))}
                    <View style={{ width: cardWidth, minWidth: isLandscape ? 180 : cardWidth }}>
                      <TouchableOpacity
                        className="h-32 m-1 rounded-full shadow-lg border border-gray-300 items-center justify-center bg-gray-100"
                        onPress={() => setShowMore(false)}
                      >
                        <Text className="mt-2 font-medium text-center text-3xl text-gray-800">Back</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </>
            )}
          </View>

          {
            shouldShowAllServices && totalPages > 1 &&
            <PaginationControls
              currentPage={currentPage}
              onPrev={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
              onNext={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
              totalPages={totalPages}
            />
          }

          {selectedTransactions.length > 0 && (
            <View className="w-min px-5 mt-5">
              <TouchableOpacity
                className="bg-green-500 p-6 rounded-lg items-center"
                onPress={() => handleSubmitReceipt()}
              >
                <Text className="text-white text-2xl font-bold">PRINT RECEIPT ({selectedTransactions.length})</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Text className='text-center'>{selectedTransactions.map((st) => st.service_name).join(' | ')}</Text>
      </ScrollView>

      <CustomerNameModal
        isShowName={showCustomerName}
        customerName={customerName}
        onCustomerNameChange={handleSetCustomerName}
        onCancel={handleCancelName}
        onConfirm={handleCustomerNameConfirm}
      />

      <CustomerTypeModal
        isVisible={showCustomerType}
        customerTypes={customerTypeData ?? []}
        onCancel={handleCancelType}
        onSelectCustomerType={handleSetCustomerType}
        selectedCustomerType={customerType}
        onConfirm={handleCustomerTypeConfirm}
      />
    </SafeAreaView>
  );
}