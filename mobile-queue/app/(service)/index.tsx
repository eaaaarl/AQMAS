import { useBluetooth } from '@/features/developer/hooks/useBluetooth';
import { useLazyCheckDeviceQuery } from '@/features/device/api/deviceApi';
import { ServiceLayout } from '@/features/service/components/ServiceLayout';
import { ServiceModals } from '@/features/service/components/ServiceModals';
import { useServicePage } from '@/features/service/hooks/useServicePage';
import { RenderError } from '@/features/service/utils/errorUtils';
import { RenderLoading } from '@/features/service/utils/loadingUtils';
import { RenderNoServices } from '@/features/service/utils/RenderNoServices';
import { useAppSelector } from '@/libs/redux/hooks';
import * as Application from 'expo-application';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';

const ServiceScreen: React.FC = () => {
  // Config and device check logic
  const config = useAppSelector((state) => state.config);
  const deviceId = Platform.OS === 'android'
    ? Application.getAndroidId()
    : Application.applicationId || '';
  const { ipAddress, port } = useAppSelector(state => state.config)

  const imageUrl = `http://${ipAddress}:${port}/uploads/company/bg_logo_transparent.png`

  const [checkDevice, { data: deviceStatus, isLoading: isLoadingDevice }] = useLazyCheckDeviceQuery();

  // Service page logic
  const {
    cardWidth,
    isLandscape,
    services,
    mainServices,
    additionalServices,
    paginatedServices,
    selectedTransactions,
    showMore,
    shouldShowAllServices,
    isLoadingPage,
    hasError,
    refreshing,
    isLoadingMutation,
    currentPage,
    totalPages,
    showCustomerType,
    customerType,
    showCustomerName,
    customerName,
    openConfirmationToast,
    surveyMessage,
    openTicketModal,
    currentTicket,
    customerNameError,
    customerTypeData,
    onRefresh,
    onServicePress,
    onShowMore,
    onShowLess,
    onPrintReceipt,
    onPrevPage,
    onNextPage,
    onCustomerNameChange,
    onCancelName,
    onCustomerNameConfirm,
    onCancelType,
    onSetCustomerType,
    onCustomerTypeConfirm,
    onCloseConfirmationToast,
    onCloseTicketModal,
    enabledSurvey,
  } = useServicePage();

  // Debug logging
  // console.log('=== DEBUG INFO ===');
  // console.log('Config:', config);
  // console.log('Services length:', services.length);
  // console.log('Main services length:', mainServices.length);
  // console.log('Additional services length:', additionalServices.length);
  // console.log('Paginated services length:', paginatedServices.length);
  // console.log('Should show all services:', shouldShowAllServices);
  // console.log('Show more:', showMore);
  // console.log('Is loading page:', isLoadingPage);
  // console.log('Has error:', hasError);
  // console.log('Services data:', services);
  // console.log('Main services:', mainServices);
  // console.log('Additional services:', additionalServices);
  // console.log('==================');

  // Derived state for navigation/redirects
  const needsConfig = !config.ipAddress || !config.port;
  const needsAuthorization = !isLoadingDevice && deviceStatus !== undefined && !deviceStatus.registered;
  const { reconnectToPersistedDevice } = useBluetooth();
  useEffect(() => {

    const initialize = async () => {
      // Always attempt printer reconnection first
      try {
        await reconnectToPersistedDevice();
        console.log('Reconnected to printer');
      } catch (error) {
        console.log('Failed to reconnect to printer:', error);
        // Continue initialization even if printer reconnection fails
      }

      // Then check device registration if config is available
      /* if (config.ipAddress && config.port) {
        checkDevice({
          id: deviceId,
          type: DeviceType.KIOSK,
        });
      } */
    }

    initialize();
  }, [config.ipAddress, config.port, deviceId, checkDevice, reconnectToPersistedDevice]);

  useEffect(() => {
    if (needsConfig) {
      router.replace('/(developer)/setting');
      return;
    }
    // if (needsAuthorization) {
    //   router.replace('/(service)/unauthorize');
    // }
  }, [needsConfig]); // needsAuthorization]);

  const handleHelpPress = async () => {
    await WebBrowser.openBrowserAsync('https://youtu.be/HVMF0rEltqA');
  };

  if (needsConfig || isLoadingDevice) {
    return <RenderLoading />;
  }

  if (isLoadingPage) {
    return <RenderLoading />;
  }

  if (hasError) {
    return (
      <RenderError
        message="Something went wrong"
        description="We encountered an error while loading the content. Please try again."
        onRetry={null}
        showIcon={true}
        type="error"
      />
    );
  }

  return (
    <>
      <ServiceLayout
        cardWidth={cardWidth}
        isLandscape={isLandscape}
        shouldShowAllServices={shouldShowAllServices}
        showMore={showMore}
        services={services}
        mainServices={mainServices}
        additionalServices={additionalServices}
        paginatedServices={paginatedServices}
        selectedTransactions={selectedTransactions}
        isLoadingMutation={isLoadingMutation}
        refreshing={refreshing}
        currentPage={currentPage}
        totalPages={totalPages}
        onRefresh={onRefresh}
        onServicePress={onServicePress}
        onShowMore={onShowMore}
        onShowLess={onShowLess}
        onPrintReceipt={onPrintReceipt}
        onPrevPage={onPrevPage}
        onNextPage={onNextPage}
        enabledSurvey={enabledSurvey}
        onHelpPress={handleHelpPress}
        imageUrl={imageUrl}
      />

      <ServiceModals
        showCustomerName={showCustomerName}
        customerName={customerName}
        customerNameError={customerNameError}
        onCustomerNameChange={onCustomerNameChange}
        onCancelName={onCancelName}
        onCustomerNameConfirm={onCustomerNameConfirm}
        showCustomerType={showCustomerType}
        customerTypeData={customerTypeData}
        customerType={customerType}
        onCancelType={onCancelType}
        onSetCustomerType={onSetCustomerType}
        onCustomerTypeConfirm={onCustomerTypeConfirm}
        openConfirmationToast={openConfirmationToast}
        surveyMessage={surveyMessage || ''}
        onCloseConfirmationToast={onCloseConfirmationToast}
        openTicketModal={openTicketModal}
        currentTicket={currentTicket}
        onCloseTicketModal={onCloseTicketModal}
      />

      {services.length === 0 && <RenderNoServices onRefresh={onRefresh} />}
    </>
  );
};

export default ServiceScreen; 