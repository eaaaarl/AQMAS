import { ServiceResponse } from '@/features/service/api/interface';
import { useGetServicesQuery } from '@/features/service/api/serviceApi';
import React, { useState } from 'react';
import { Alert, Dimensions, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Transaction() {
  const { data: services = [], isLoading, isError, refetch } = useGetServicesQuery();
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [showMore, setShowMore] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const screenWidth = Dimensions.get('window').width;
  const cardWidth = (screenWidth - 40) / 2;

  const mainServices = services.filter(service => service.header_id === 1);
  const additionalServices = services.filter(service => service.header_id === 0);

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

  const renderServiceItem = (service: ServiceResponse) => (
    <TouchableOpacity
      key={service.service_id}
      style={{ width: cardWidth }}
      className={`h-32 m-1 rounded-lg items-center justify-center 
        ${selectedTransactions.includes(service.service_name) ? 'bg-blue-500' : 'bg-gray-100'}`}
      onPress={() => toggleTransaction(service.service_name)}
    >
      <Text className="text-2xl">{getServiceIcon(service.service_name)}</Text>
      <Text className={`mt-2 font-medium text-center ${selectedTransactions.includes(service.service_name) ? 'text-white' : 'text-gray-800'}`}>
        {service.button_caption}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white p-4 justify-center items-center">
        <Text className="text-lg text-gray-500">Loading services...</Text>
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
          <View className='gap-2' style={{
            width: '100%',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            {!showMore ? (
              <>
                {mainServices.map((service) => (
                  <View key={service.service_id} style={{ width: cardWidth }}>
                    {renderServiceItem(service)}
                  </View>
                ))}
                {additionalServices.length > 0 && (
                  <View style={{ width: cardWidth }}>
                    <TouchableOpacity
                      className="h-32 m-1 rounded-lg items-center justify-center bg-gray-100"
                      onPress={() => setShowMore(true)}
                    >
                      <Text className="text-2xl">➕</Text>
                      <Text className="mt-2 font-medium text-center text-gray-800">MORE</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            ) : (
              <>
                {additionalServices.map((service) => (
                  <View key={service.service_id} style={{ width: cardWidth }}>
                    {renderServiceItem(service)}
                  </View>
                ))}
                <View className='flex-row  justify-center'>
                  <TouchableOpacity
                    className="h-32 m-1 rounded-lg items-center justify-center bg-gray-100 w-1/2"
                    onPress={() => setShowMore(false)}
                  >
                    <Text className="text-gray-800 font-bold">Back</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>

          {selectedTransactions.length > 0 && (
            <View className="w-full px-4 mt-4">
              <TouchableOpacity
                className="bg-green-500 p-4 rounded-lg items-center"
                onPress={() => Alert.alert('Selected Transactions', JSON.stringify(selectedTransactions))}
              >
                <Text className="text-white font-bold">PRINT RECEIPT ({selectedTransactions.length})</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}