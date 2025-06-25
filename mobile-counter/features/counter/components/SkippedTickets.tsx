import { TickitSkipped } from '@/features/queue/api/interface';
import { Ionicons } from '@expo/vector-icons';
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
      <Text className="mb-6 text-center text-base font-semibold tracking-wide text-gray-700">
        Skipped Tickets
      </Text>
      {skippedData ? (
        <View className="gap-4">
          {[skippedData].flat().map((ticket: TickitSkipped) => (
            <View
              key={ticket.trans_id}
              className="rounded-xl border border-gray-200 bg-gray-50/80 p-4 shadow-sm"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-4">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-lg font-bold text-orange-500">
                      {ticket.trans_id}
                    </Text>
                    <View className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                    <Text className="text-sm font-medium text-gray-500">
                      {ticket.time_start}
                    </Text>
                  </View>
                  <Text className="mt-1 text-base font-medium text-gray-700">
                    {ticket.customer_name}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{ backgroundColor: '#1c3f83' }}
                  onPress={() => onReturnTicket(ticket)}
                  className="rounded-lg p-3"
                >
                  <Ionicons name="return-up-back" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <Text className="text-center text-base text-gray-500">
          No skipped tickets
        </Text>
      )}
    </View>
  );
}; 