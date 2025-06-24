import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Service } from '../api/interface';

interface PrintReceiptButtonProps {
  selectedTransactions: Service[];
  onPrintReceipt: () => void;
}

export const PrintReceiptButton: React.FC<PrintReceiptButtonProps> = ({
  selectedTransactions,
  onPrintReceipt,
}) => {
  if (selectedTransactions.length === 0) {
    return null;
  }

  return (
    <View className="w-min px-5 mt-5">
      <TouchableOpacity
        className="bg-green-500 p-6 rounded-lg items-center"
        onPress={onPrintReceipt}
      >
        <Text className="text-white text-2xl font-bold">
          PRINT RECEIPT ({selectedTransactions.length})
        </Text>
      </TouchableOpacity>
    </View>
  );
}; 