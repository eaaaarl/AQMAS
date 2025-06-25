import { TickitSkipped } from '@/features/queue/api/interface';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface SkippedTicketsProps {
  skippedData: TickitSkipped | TickitSkipped[] | null;
  onReturnTicket: (ticket: TickitSkipped) => void;
}

export const SkippedTickets: React.FC<SkippedTicketsProps> = ({
  skippedData,
  onReturnTicket,
}) => {
  return (
    <View className="px-6 pb-6">
      <Text className="mb-4 text-center text-sm font-medium text-gray-500">
        Skipped Tickets
      </Text>
      {skippedData ? (
        <View className="gap-3">
          {[skippedData].flat().map((ticket: TickitSkipped) => (
            <View
              key={ticket.trans_id}
              className="rounded-lg border border-gray-200 bg-gray-50 p-3"
            >
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-lg font-semibold text-orange-500">
                    {ticket.trans_id}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    {ticket.time_start} | {ticket.customer_name}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => onReturnTicket(ticket)}
                  className="rounded-lg bg-blue-500 px-3 py-2"
                >
                  <Text className="text-sm font-medium text-white">Return</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <Text className="text-center text-gray-500">No skipped tickets</Text>
      )}
    </View>
  );
}; 