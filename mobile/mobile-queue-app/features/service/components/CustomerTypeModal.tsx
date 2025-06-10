import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface CustomerType {
    id: string | number;
    name: string;
    description?: string;
    discount?: number;
}

interface CustomerTypeModalProps {
    isVisible: boolean;
    customerTypes?: CustomerType[];
    selectedCustomerType?: CustomerType | null;
    onSelectCustomerType?: (customerType: CustomerType) => void;
    onCancel?: () => void;
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
            <View className="flex-1 justify-center items-center bg-black/50">
                <View className="bg-white rounded-lg p-6 w-4/5 max-w-md max-h-96">
                    <Text className="text-gray-600 text-center mb-4">
                        Please select customer type for record keeping
                    </Text>

                    {isLoading ? (
                        <View className="py-8">
                            <Text className="text-center text-gray-500">Loading customer types...</Text>
                        </View>
                    ) : (
                        <ScrollView className="max-h-48 mb-4">
                            {customerTypes.map((customerType) => (
                                <TouchableOpacity
                                    key={customerType.id}
                                    className={`p-3 mb-2 rounded-lg border ${selectedCustomerType?.id === customerType.id
                                        ? 'bg-blue-100 border-blue-500'
                                        : 'bg-gray-50 border-gray-300'
                                        }`}
                                    onPress={() => onSelectCustomerType(customerType)}
                                >
                                    <Text className={`font-medium ${selectedCustomerType?.id === customerType.id
                                        ? 'text-blue-700'
                                        : 'text-gray-800'
                                        }`}>
                                        {customerType.name}
                                    </Text>
                                    {customerType.description && (
                                        <Text className="text-sm text-gray-600 mt-1">
                                            {customerType.description}
                                        </Text>
                                    )}
                                    {customerType.discount && (
                                        <Text className="text-sm text-green-600 mt-1">
                                            {customerType.discount}% discount
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}

                    <View className="flex-row gap-3">
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