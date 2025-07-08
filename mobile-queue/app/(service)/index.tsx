import { ServiceLayout } from '@/features/service/components/ServiceLayout';
import { ServiceModals } from '@/features/service/components/ServiceModals';
import { useServicePage } from '@/features/service/hooks/useServicePage';
import { RenderError } from '@/features/service/utils/errorUtils';
import { RenderLoading } from '@/features/service/utils/loadingUtils';
import { RenderNoServices } from '@/features/service/utils/RenderNoServices';
import React from 'react';

export default function ServiceScreen() {
  const {
    // Layout
    cardWidth,
    isLandscape,

    // Service data
    services,
    mainServices,
    additionalServices,
    paginatedServices,
    selectedTransactions,
    showMore,
    shouldShowAllServices,

    // Loading and error states
    isLoadingPage,
    hasError,
    refreshing,
    isLoadingMutation,

    // Pagination
    currentPage,
    totalPages,

    // Queue state
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

    // Event handlers
    onRefresh,
    onServicePress,
    onShowMore,
    onShowLess,
    onPrintReceipt,
    onPrevPage,
    onNextPage,

    // Modal handlers
    onCustomerNameChange,
    onCancelName,
    onCustomerNameConfirm,
    onCancelType,
    onSetCustomerType,
    onCustomerTypeConfirm,
    onCloseConfirmationToast,
    onCloseTicketModal,

    // Configuration
    enabledSurvey,
  } = useServicePage();

  // Loading state
  if (isLoadingPage) {
    return <RenderLoading />;
  }

  // Error state
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