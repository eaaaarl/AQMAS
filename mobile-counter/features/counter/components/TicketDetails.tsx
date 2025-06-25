import React from 'react';
import { Text, View } from 'react-native';

interface Service {
  button_caption: string;
}

interface TicketDetailsProps {
  hasActiveTicket: boolean;
  services?: Service[];
  customerType?: string;
}

export const TicketDetails: React.FC<TicketDetailsProps> = ({
  hasActiveTicket,
  services,
  customerType,
}) => {
  return (
    <View className="px-6 pb-6">
      <View className="mb-4 rounded-xl border border-gray-300 bg-gray-50 p-4">
        <View className="mb-4 items-center">
          <Text className="mb-1 text-sm text-gray-500">Service</Text>
          <Text style={{ color: '#1c3f83' }} className="text-lg font-semibold">
            {(hasActiveTicket &&
              services?.map(service => service.button_caption)) ||
              '---'}
          </Text>
        </View>
        <View className="items-center">
          <Text className="mb-1 text-sm text-gray-500">Customer Type</Text>
          <Text style={{ color: '#1c3f83' }} className="text-center font-medium">
            {(hasActiveTicket && customerType) || '---'}
          </Text>
        </View>
      </View>
    </View>
  );
}; 