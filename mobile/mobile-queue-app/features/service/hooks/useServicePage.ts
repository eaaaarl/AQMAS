import { useConfig } from '@/features/config/hooks/useConfig';
import { useGetCustomerTypeQuery } from '@/features/customer/api/customerApi';
import { useQueue } from '@/features/queue/hooks/useQueue';
import { Dimensions } from 'react-native';
import { useService } from './useService';

export const useServicePage = () => {
  const { width, height } = Dimensions.get('window');
  const isLandscape = width > height;
  const cardWidth = isLandscape ? (width - 60) / 3 : (width - 40) / 2;

  // Service management
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
  } = useService();

  // Configuration
  const {
    isConfigsError,
    isConfigsLoading,
    shouldShowAllServices,
    enabledSurvey,
  } = useConfig();

  // Queue management
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
  } = useQueue();

  // Customer type data
  const { data: customerTypeData } = useGetCustomerTypeQuery({ is_show: '1' });

  // Computed values
  const isLoadingPage = isLoading || isConfigsLoading;
  const hasError = isError || isConfigsError || customerTypeDataError;

  // Event handlers
  const handleServicePress = (service: any) => {
    toggleTransactions(service);
  };

  const handleShowMore = () => {
    setShowMore(true);
  };

  const handleShowLess = () => {
    setShowMore(false);
  };

  const handlePrintReceipt = () => {
    handleSubmitReceipt();
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
  };

  return {
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
    customerTypeData: customerTypeData ?? [],
    
    // Event handlers
    onRefresh,
    onServicePress: handleServicePress,
    onShowMore: handleShowMore,
    onShowLess: handleShowLess,
    onPrintReceipt: handlePrintReceipt,
    onPrevPage: handlePrevPage,
    onNextPage: handleNextPage,
    
    // Modal handlers
    onCustomerNameChange: handleSetCustomerName,
    onCancelName: handleCancelName,
    onCustomerNameConfirm: handleCustomerNameConfirm,
    onCancelType: handleCancelType,
    onSetCustomerType: handleSetCustomerType,
    onCustomerTypeConfirm: handleCustomerTypeConfirm,
    onCloseConfirmationToast: handleCloseConfirmationToast,
    onCloseTicketModal: handleCloseTicketModal,
    
    // Configuration
    enabledSurvey,
  };
}; 