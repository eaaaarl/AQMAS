import { useCheckDeviceQuery } from '@/features/device/api/deviceApi';
import { DeviceType } from '@/features/device/constants';
import { ServiceLayout } from '@/features/service/components/ServiceLayout';
import { ServiceModals } from '@/features/service/components/ServiceModals';
import { useServicePage } from '@/features/service/hooks/useServicePage';
import { RenderError } from '@/features/service/utils/errorUtils';
import { RenderLoading } from '@/features/service/utils/loadingUtils';
import { RenderNoServices } from '@/features/service/utils/RenderNoServices';
import { useAppSelector } from '@/libs/redux/hooks';
import * as Application from 'expo-application';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';

const ServiceScreen: React.FC = () => {
  // Config and device check logic
  const config = useAppSelector((state) => state.config);
  const deviceId = Platform.OS === 'android'
    ? Application.getAndroidId()
    : Application.applicationId || '';
  const { data: deviceStatus, isLoading: isLoadingDevice } = useCheckDeviceQuery({
    id: deviceId,
    type: DeviceType.KIOSK,
  });

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

  // Derived state for navigation/redirects
  const needsConfig = !config.ipAddress || !config.port;
  const needsAuthorization = !isLoadingDevice && !deviceStatus?.registered;

  useEffect(() => {
    if (needsConfig) {
      router.replace('/(developer)/setting');
      return;
    }
    /* if (needsAuthorization) {
      router.replace('/(service)/unauthorize');
    } */
  }, [needsConfig, /* needsAuthorization */]);

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