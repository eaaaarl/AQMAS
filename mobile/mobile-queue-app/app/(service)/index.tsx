import { useGetConfigsQuery } from '@/features/config/api/configApi';
import { Service } from '@/features/service/api/interface';
import { useService } from '@/features/service/hooks/useService';
import { useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Transaction() {
  const {
    additionalServices,
    isError,
    isLoading,
    mainServices,
    onRefresh,
    refreshing,
    selectedTransactions,
    services,
    setShowMore,
    showMore,
    toggleTransaction
  } = useService()

  const { data: configs } = useGetConfigsQuery()
  const [currentPage, setCurrentPage] = useState(0);

  const screenType = configs?.find(
    config => config.SectionName === "Kiosk" && config.KeyName === "Screen_type"
  )?.Value;

  const shouldShowAllServices = screenType === "1";

  const { width, height } = Dimensions.get('window');
  const isLandscape = width > height;
  const cardWidth = isLandscape ? (width - 60) / 3 : (width - 40) / 2;

  const SERVICES_PER_PAGE = 4;
  const totalPages = Math.ceil(services.length / SERVICES_PER_PAGE);

  const paginatedServices = services.slice(
    currentPage * SERVICES_PER_PAGE,
    (currentPage + 1) * SERVICES_PER_PAGE
  );

  const renderServiceItem = (service: Service) => (
    <TouchableOpacity
      key={service.service_id}
      style={{ width: cardWidth }}
      className={`h-32 m-1 rounded-full items-center justify-center shadow-lg border border-gray-300
        ${selectedTransactions.includes(service.service_name) ? 'bg-blue-500' : 'bg-gray-100'}`}
      onPress={() => toggleTransaction(service.service_name)}
    >
      <Text className={`mt-2 font-medium text-3xl text-center ${selectedTransactions.includes(service.service_name) ? 'text-white' : 'text-gray-800'}`}>
        {service.button_caption}
      </Text>
    </TouchableOpacity>
  );

  const renderPaginationControls = () => (
    <View className="flex-row justify-center items-center my-4 space-x-2 gap-4">
      {/*  {currentPage > 0 && (
        <TouchableOpacity
          className="px-6 py-3 rounded-lg bg-blue-100"
          onPress={() => setCurrentPage(0)}
        >
          <Text className="text-xl font-bold">⏮ First</Text>
        </TouchableOpacity>
      )} */}

      <TouchableOpacity
        className="px-6 py-3 rounded-lg bg-blue-100"
        onPress={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
        disabled={currentPage === 0}
      >
        <Text className={`text-xl font-bold ${currentPage === 0 ? 'text-gray-400' : 'text-blue-800'}`}>◀ Prev</Text>
      </TouchableOpacity>

      <View className="px-4 py-2 bg-blue-500 rounded-full">
        <Text className="text-xl font-bold text-white">
          {currentPage + 1} / {totalPages}
        </Text>
      </View>

      <TouchableOpacity
        className="px-6 py-3 rounded-lg bg-blue-100"
        onPress={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
        disabled={currentPage === totalPages - 1}
      >
        <Text className={`text-xl font-bold ${currentPage === totalPages - 1 ? 'text-gray-400' : 'text-blue-800'}`}>Next ▶</Text>
      </TouchableOpacity>

      {/*    {currentPage < totalPages - 1 && (
        <TouchableOpacity
          className="px-6 py-3 rounded-lg bg-blue-100"
          onPress={() => setCurrentPage(totalPages - 1)}
        >
          <Text className="text-xl font-bold">Last ⏭</Text>
        </TouchableOpacity>
      )} */}
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white p-4 justify-center items-center">
        <ActivityIndicator size="large" color="#0000FF" />
      </SafeAreaView>
    );
  }

  if (services.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white p-4 justify-center items-center">
        <Text className="text-lg text-gray-500">No services available</Text>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-white p-4 justify-center items-center">
        <Text className="text-lg text-red-500">Error loading services</Text>
      </SafeAreaView>
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
                    {renderServiceItem(service)}
                  </View>
                ))}
              </>
            ) : (
              <>
                {!showMore ? (
                  <>
                    {mainServices.map((service) => (
                      <View key={service.service_id} style={{ width: cardWidth, minWidth: isLandscape ? 180 : cardWidth }}>
                        {renderServiceItem(service)}
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
                        {renderServiceItem(service)}
                      </View>
                    ))}
                    <View style={{ width: cardWidth, minWidth: isLandscape ? 180 : cardWidth }}>
                      <TouchableOpacity
                        className="h-32 m-1 rounded-full border border-gray-300 items-center justify-center bg-gray-100"
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

          {shouldShowAllServices && totalPages > 1 && renderPaginationControls()}

          {selectedTransactions.length > 0 && (
            <View className="w-min px-5 mt-5">
              <TouchableOpacity
                className="bg-green-500 p-6 rounded-lg items-center"
                onPress={() => Alert.alert('Selected Transactions', JSON.stringify(selectedTransactions))}
              >
                <Text className="text-white text-2xl font-bold">PRINT RECEIPT ({selectedTransactions.length})</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Text className='text-center'>{selectedTransactions.map((st) => st).join(' | ')}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}