import React, { memo } from 'react';
import { Text, View } from 'react-native';

interface TicketDisplayProps {
  ticketNo: string;
  customerName: string;
  hasActiveTicket: boolean;
}

export const TicketDisplay = memo<TicketDisplayProps>(({
  ticketNo,
  customerName,
  hasActiveTicket,
}) => {
  const displayTicketNo = hasActiveTicket && ticketNo ? ticketNo : '---';
  const displayCustomerName = hasActiveTicket && customerName ? customerName : '---';

  return (
    <View className="items-center px-6 py-8">
      <Text className="mb-2 text-sm text-gray-500">Ticket Number</Text>
      <Text className="mb-4 text-5xl font-bold tracking-widest text-orange-500">
        {displayTicketNo}
      </Text>
      <Text className="mb-1 text-sm text-gray-500">Customer Name</Text>
      <Text style={{ color: '#1c3f83' }} className="text-xl font-semibold">
        {displayCustomerName}
      </Text>
    </View>
  );
});

TicketDisplay.displayName = 'TicketDisplay'; 