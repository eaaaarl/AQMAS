import { useConfig } from '@/features/config/hooks/useConfig';
import { useGetCustomerTypeQuery } from '@/features/customer/api/customerApi';
import ConfirmationToast from '@/features/queue/components/ConfirmationToast';
import CustomerNameModal from '@/features/queue/components/CustomerNameModal';
import CustomerTypeModal from '@/features/queue/components/CustomerTypeModal';
import TicketModal from '@/features/queue/components/TicketModal';
import { useQueue } from '@/features/queue/hooks/useQueue';
import { PaginationControls } from '@/features/service/components/PaginationControl';
import { ServiceItem } from '@/features/service/components/ServiceItem';
import SurveyButton from '@/features/service/components/SurveyButton';
import { useService } from '@/features/service/hooks/useService';
import { RenderError } from '@/features/service/utils/errorUtils';
import { RenderLoading } from '@/features/service/utils/loadingUtils';
import { RenderNoServices } from '@/features/service/utils/RenderNoServices';
import { Dimensions, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Transaction() {
  /**
   * Custom hook values for service management
   * @property {Service[]} additionalServices - Array of additional service items
   * @property {boolean} isError - Error state flag
   * @property {boolean} isLoading - Loading state flag
   * @property {Service[]} mainServices - Array of main service items
   * @property {() => void} onRefresh - Function to handle refresh action
   * @property {boolean} refreshing - Refresh state flag
   * @property {Service[]} services - Array of all service items
   * @property {(value: boolean) => void} setShowMore - Function to update show more state
   * @property {boolean} showMore - Show more state flag
   * @property {number} currentPage - Current page number in pagination
   * @property {Service[]} paginatedServices - Array of services for current pagination page
   * @property {number} totalPages - Total number of pages in pagination
   * @property {(page: number) => void} setCurrentPage - Function to update current page number
   */
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
    currentPage,
    paginatedServices,
    totalPages,
    setCurrentPage
  } = useService()

  /**
   * Configuration state and controls from useConfig hook
   * @property {boolean} isConfigsError - Indicates if there was an error loading configurations
   * @property {boolean} isConfigsLoading - Indicates if configurations are currently loading
   * @property {boolean} shouldShowAllServices - Controls whether all services should be displayed
   */
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
    showCustomerName,
    handleCloseConfirmationToast,
    openConfirmationToast,
    surveyMessage,
    openTicketModal,
    handleCloseTicketModal,
    currentTicket,
    customerNameError,
    customerTypeDataError,
    isLoadingMutation
  } = useQueue()

  const { data: customerTypeData } = useGetCustomerTypeQuery({ is_show: '1' })

  const { enabledSurvey } = useConfig()

  const { width, height } = Dimensions.get('window');
  const isLandscape = width > height;
  const cardWidth = isLandscape ? (width - 60) / 3 : (width - 40) / 2;

  if (isLoading || isConfigsLoading) return RenderLoading()

  if (isError || isConfigsError || customerTypeDataError) return RenderError({
    message: 'Something went wrong',
    description: 'We encountered an error while loading the content. Please try again.',
    onRetry: null,
    showIcon: true,
    type: 'error'
  })

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
                      isLoading={isLoadingMutation}
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
                          isLoading={isLoadingMutation}
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
                          disabled={isLoadingMutation}
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
                          isLoading={isLoadingMutation}
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
                        disabled={isLoadingMutation}
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


      {enabledSurvey && <SurveyButton />}

      {services.length === 0 && <RenderNoServices onRefresh={() => onRefresh()} />}

      <CustomerNameModal
        isShowName={showCustomerName}
        customerName={customerName}
        onCustomerNameChange={handleSetCustomerName}
        onCancel={handleCancelName}
        onConfirm={handleCustomerNameConfirm}
        errMsg={customerNameError || ''}
      />

      <CustomerTypeModal
        isVisible={showCustomerType}
        customerTypes={customerTypeData ?? []}
        onCancel={handleCancelType}
        onSelectCustomerType={handleSetCustomerType}
        selectedCustomerType={customerType}
        onConfirm={handleCustomerTypeConfirm}
      />

      <ConfirmationToast
        visible={openConfirmationToast}
        message={surveyMessage}
        onClose={() => handleCloseConfirmationToast()}
      />

      <TicketModal
        onClose={handleCloseTicketModal}
        visible={openTicketModal}
        ticket={currentTicket}
        confirmText='OK'
        customerName={customerName}
      />



    </SafeAreaView>
  );
}