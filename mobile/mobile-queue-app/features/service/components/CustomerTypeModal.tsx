import { CustomerTypeResponse } from '@/features/customer/api/interface';
import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface CustomerTypeModalProps {
    isVisible: boolean;
    customerTypes: CustomerTypeResponse[];
    selectedCustomerType: CustomerTypeResponse | null;
    onSelectCustomerType: (customerType: CustomerTypeResponse) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export default function CustomerTypeModal({
    isVisible,
    customerTypes,
    selectedCustomerType,
    onSelectCustomerType,
    onCancel,
    isLoading = false
}: CustomerTypeModalProps) {
    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View className="flex-1 justify-center items-center bg-black/50 p-4">
                <View className="bg-white rounded-lg p-6 w-full h-4/5 max-w-screen-sm">
                    <Text className="text-gray-600 text-center mb-4 text-lg">
                        Please select customer type for record keeping
                    </Text>

                    {isLoading ? (
                        <View className="py-8">
                            <Text className="text-center text-gray-500">Loading customer types...</Text>
                        </View>
                    ) : (
                        <ScrollView className="mb-4 flex-1">
                            {customerTypes.map((customerType) => (
                                <TouchableOpacity
                                    key={customerType.type_id}
                                    className={`p-6 mb-3 rounded-lg border ${selectedCustomerType?.type_id === customerType.type_id
                                        ? 'bg-blue-100 border-blue-500'
                                        : 'bg-gray-50 border-gray-300'
                                        }`}
                                    onPress={() => onSelectCustomerType(customerType)}
                                >
                                    <Text className={`font-bold text-base ${selectedCustomerType?.type_id === customerType.type_id
                                        ? 'text-blue-700'
                                        : 'text-gray-800'
                                        }`}>
                                        {customerType.type_name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}

                    <View className="flex-row gap-3 mt-4">
                        <TouchableOpacity
                            className="flex-1 bg-gray-500 p-3 rounded-lg"
                            onPress={onCancel}
                        >
                            <Text className="text-white text-center font-bold">Skip</Text>
                        </TouchableOpacity>

                        {selectedCustomerType && (
                            <TouchableOpacity
                                className="flex-1 bg-blue-500 p-3 rounded-lg"
                                onPress={() => {
                                    onSelectCustomerType(selectedCustomerType);
                                    onCancel();
                                }}
                            >
                                <Text className="text-white text-center font-bold">Confirm</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    )
}