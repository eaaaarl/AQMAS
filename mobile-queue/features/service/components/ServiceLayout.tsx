import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Service } from '../api/interface';
import { PaginationControls } from './PaginationControl';
import { PrintReceiptButton } from './PrintReceiptButton';
import { ServiceItem } from './ServiceItem';
import { ServiceNavigation } from './ServiceNavigation';
import SurveyButton from './SurveyButton';

interface ServiceLayoutProps {
  // Layout props
  cardWidth: number;
  isLandscape: boolean;
  // Service display props
  shouldShowAllServices: boolean;
  showMore: boolean;
  services: Service[];
  mainServices: Service[];
  additionalServices: Service[];
  paginatedServices: Service[];
  selectedTransactions: Service[];
  // Loading and error states
  isLoadingMutation: boolean;
  refreshing: boolean;
  // Pagination props
  currentPage: number;
  totalPages: number;
  // Event handlers
  onRefresh: () => void;
  onServicePress: (service: Service) => void;
  onShowMore: () => void;
  onShowLess: () => void;
  onPrintReceipt: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  onHelpPress: () => void;
  // Configuration
  enabledSurvey: boolean;
}

export const ServiceLayout: React.FC<ServiceLayoutProps> = ({
  cardWidth,
  isLandscape,
  shouldShowAllServices,
  showMore,
  services,
  mainServices,
  additionalServices,
  paginatedServices,
  selectedTransactions,
  isLoadingMutation,
  refreshing,
  currentPage,
  totalPages,
  onRefresh,
  onServicePress,
  onShowMore,
  onShowLess,
  onPrintReceipt,
  onPrevPage,
  onNextPage,
  onHelpPress,
  enabledSurvey,
}) => {
  const getDisplayServices = () => {
    if (shouldShowAllServices) {
      return paginatedServices;
    }
    if (showMore) {
      return additionalServices;
    }
    return mainServices;
  };

  const displayServices = getDisplayServices();

  return (
    <SafeAreaView className='flex-1 bg-white'>
      {/* <View className="flex-row justify-between items-center px-4 py-2 border-b border-gray-200">
        <View className="flex-1" />
        <TouchableOpacity
          onPress={onHelpPress}
          className="flex-row items-center bg-blue-500 rounded-full px-4 py-2 shadow-md"
          style={{
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <Ionicons name="help-circle-outline" size={20} color="white" style={{ marginRight: 6 }} />
          <Text className="text-white font-medium text-sm">Need Help?</Text>
        </TouchableOpacity>
      </View> */}

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
          {/* Main content container with consistent width */}
          <View style={{
            width: '100%',
            maxWidth: isLandscape ? '90%' : '100%',
            alignItems: 'center',
          }}>
            {/* Service Grid with Navigation integrated */}
            <View className='gap-4' style={{
              width: '100%',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              maxWidth: isLandscape ? '90%' : '100%',
            }}>
              {/* Render all services */}
              {displayServices.map((service) => (
                <View key={service.service_id} style={{ width: cardWidth, minWidth: isLandscape ? 180 : cardWidth }}>
                  <ServiceItem
                    isLoading={isLoadingMutation}
                    service={service}
                    cardWidth={cardWidth}
                    isSelected={selectedTransactions.some(item => item.service_id === service.service_id)}
                    onPress={() => onServicePress(service)}
                  />
                </View>
              ))}

              {/* Service Navigation as part of the same grid */}
              {!shouldShowAllServices && (
                <View style={{ width: cardWidth, minWidth: isLandscape ? 180 : cardWidth }}>
                  <ServiceNavigation
                    showMore={showMore}
                    additionalServicesCount={additionalServices.length}
                    isLoadingMutation={isLoadingMutation}
                    onShowMore={onShowMore}
                    onShowLess={onShowLess}
                    cardWidth={cardWidth}
                    isLandscape={isLandscape}
                  />
                </View>
              )}
            </View>

            {/* Pagination Controls */}
            {shouldShowAllServices && totalPages > 1 && (
              <View style={{ width: '100%', alignItems: 'center', marginTop: 16 }}>
                <PaginationControls
                  currentPage={currentPage}
                  onPrev={onPrevPage}
                  onNext={onNextPage}
                  totalPages={totalPages}
                />
              </View>
            )}

            {/* Print Receipt Button */}
            <View style={{ width: '100%', alignItems: 'center', marginTop: 16 }}>
              <PrintReceiptButton
                selectedTransactions={selectedTransactions}
                onPrintReceipt={onPrintReceipt}
              />
            </View>

            {/* Help Button Alternative - Bottom Section */}
            <View style={{ width: '100%', alignItems: 'center', marginTop: 24 }}>
              <TouchableOpacity
                onPress={onHelpPress}
                className="flex-row items-center bg-blue-50 border-2 border-blue-200 rounded-xl px-8 py-4 shadow-sm"
                style={{
                  shadowColor: '#3B82F6',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                  transform: [{ scale: 1 }],
                }}
                activeOpacity={0.8}
                onPressIn={(e) => {
                  // Add subtle scale animation on press
                  e.currentTarget.setNativeProps({
                    style: {
                      transform: [{ scale: 0.98 }],
                    }
                  });
                }}
                onPressOut={(e) => {
                  e.currentTarget.setNativeProps({
                    style: {
                      transform: [{ scale: 1 }],
                    }
                  });
                }}
              >
                {/* Icon with subtle animation container */}
                <View className="mr-3 p-1 bg-blue-100 rounded-full">
                  <Ionicons
                    name="help-circle"
                    size={24}
                    color="#3B82F6"
                  />
                </View>

                {/* Text with better typography */}
                <Text className="text-blue-700 font-semibold text-base tracking-wide">
                  Need Help?
                </Text>

                {/* Optional subtle arrow indicator */}
                <View className="ml-2">
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color="#3B82F6"
                  />
                </View>
              </TouchableOpacity>

              {/* Optional subtitle */}
              <Text className="text-gray-500 text-sm mt-2 text-center">
                Get assistance with your services
              </Text>
            </View>
          </View>

          {/* Selected transactions text */}
          <Text className='text-center' style={{ marginTop: 16 }}>
            {selectedTransactions.map((st) => st.service_name).join(' | ')}
          </Text>
        </View>
      </ScrollView>

      {enabledSurvey && <SurveyButton />}
    </SafeAreaView>
  );
};