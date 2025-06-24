import { CustomerTypeResponse } from '@/features/customer/api/interface';
import ConfirmationToast from '@/features/queue/components/ConfirmationToast';
import CustomerNameModal from '@/features/queue/components/CustomerNameModal';
import CustomerTypeModal from '@/features/queue/components/CustomerTypeModal';
import TicketModal from '@/features/queue/components/TicketModal';
import React from 'react';

interface ServiceModalsProps {
  // Customer name modal
  showCustomerName: boolean;
  customerName: string;
  customerNameError: string | null;
  onCustomerNameChange: (name: string) => void;
  onCancelName: () => void;
  onCustomerNameConfirm: () => void;
  
  // Customer type modal
  showCustomerType: boolean;
  customerTypeData: CustomerTypeResponse[];
  customerType: CustomerTypeResponse | null;
  onCancelType: () => void;
  onSetCustomerType: (type: CustomerTypeResponse) => void;
  onCustomerTypeConfirm: () => void;
  
  // Confirmation toast
  openConfirmationToast: boolean;
  surveyMessage: string;
  onCloseConfirmationToast: () => void;
  
  // Ticket modal
  openTicketModal: boolean;
  currentTicket: string | null;
  onCloseTicketModal: () => void;
}

export const ServiceModals: React.FC<ServiceModalsProps> = ({
  showCustomerName,
  customerName,
  customerNameError,
  onCustomerNameChange,
  onCancelName,
  onCustomerNameConfirm,
  showCustomerType,
  customerTypeData,
  customerType,
  onCancelType,
  onSetCustomerType,
  onCustomerTypeConfirm,
  openConfirmationToast,
  surveyMessage,
  onCloseConfirmationToast,
  openTicketModal,
  currentTicket,
  onCloseTicketModal,
}) => {
  return (
    <>
      <CustomerNameModal
        isShowName={showCustomerName}
        customerName={customerName}
        onCustomerNameChange={onCustomerNameChange}
        onCancel={onCancelName}
        onConfirm={onCustomerNameConfirm}
        errMsg={customerNameError || ''}
      />

      <CustomerTypeModal
        isVisible={showCustomerType}
        customerTypes={customerTypeData}
        onCancel={onCancelType}
        onSelectCustomerType={onSetCustomerType}
        selectedCustomerType={customerType}
        onConfirm={onCustomerTypeConfirm}
      />

      <ConfirmationToast
        visible={openConfirmationToast}
        message={surveyMessage}
        onClose={onCloseConfirmationToast}
      />

      <TicketModal
        onClose={onCloseTicketModal}
        visible={openTicketModal}
        ticket={currentTicket || undefined}
        confirmText='OK'
        customerName={customerName}
      />
    </>
  );
}; 