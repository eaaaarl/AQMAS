import React from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
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