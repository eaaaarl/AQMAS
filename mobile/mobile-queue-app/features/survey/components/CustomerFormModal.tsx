import DismissKeyboard from '@/components/DismissKeyboard';
import React from 'react';
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface CustomerFormModalProps {
    isOpen: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    formData: {
        name: string;
        address: string;
        contact: string;
        reference: string;
    };
    onFormChange: (field: string, value: string) => void;
}

export default function CustomerFormModal({
    isOpen,
    onCancel,
    onConfirm,
    formData,
    onFormChange,
}: CustomerFormModalProps) {
    const { name, address, contact, reference } = formData;

    const isFormValid = () => {
        return name.trim() !== '' && contact.trim() !== '';
    };

    return (
        <Modal
            visible={isOpen}
            transparent={true}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View className="flex-1 justify-center items-center bg-black/50">
                <DismissKeyboard>
                    <View className="bg-white rounded-lg p-6 w-4/5 max-w-md max-h-4/5">
                        <Text className="text-xl font-bold text-center mb-4 text-gray-800">
                            Customer Information
                        </Text>
                        <Text className="text-gray-600 text-center mb-6">
                            Please fill in customer details for record keeping
                        </Text>

                        <ScrollView className="mb-4" showsVerticalScrollIndicator={false}>
                            <View className="mb-4">
                                <Text className="text-gray-700 font-medium mb-2">
                                    Customer Name *
                                </Text>
                                <TextInput
                                    className="border border-gray-300 rounded-lg p-3 text-lg"
                                    placeholder="Enter customer name"
                                    value={name}
                                    onChangeText={(value) => onFormChange('name', value)}
                                    autoCapitalize="words"
                                />
                            </View>

                            <View className="mb-4">
                                <Text className="text-gray-700 font-medium mb-2">
                                    Address
                                </Text>
                                <TextInput
                                    className="border border-gray-300 rounded-lg p-3 text-lg h-20"
                                    placeholder="Enter customer address"
                                    value={address}
                                    onChangeText={(value) => onFormChange('address', value)}
                                    multiline={true}
                                    textAlignVertical="top"
                                    autoCapitalize="sentences"
                                />
                            </View>

                            <View className="mb-4">
                                <Text className="text-gray-700 font-medium mb-2">
                                    Contact Number *
                                </Text>
                                <TextInput
                                    className="border border-gray-300 rounded-lg p-3 text-lg"
                                    placeholder="Enter contact number"
                                    value={contact}
                                    onChangeText={(value) => onFormChange('contact', value)}
                                    keyboardType="phone-pad"
                                />
                            </View>

                            <View className="mb-4">
                                <Text className="text-gray-700 font-medium mb-2">
                                    Reference Number
                                </Text>
                                <TextInput
                                    className="border border-gray-300 rounded-lg p-3 text-lg"
                                    placeholder="Enter reference number (optional)"
                                    value={reference}
                                    onChangeText={(value) => onFormChange('reference', value)}
                                />
                            </View>
                        </ScrollView>

                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                className="flex-1 bg-gray-500 p-3 rounded-lg"
                                onPress={onCancel}
                            >
                                <Text className="text-white text-center font-bold">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className={`flex-1 p-3 rounded-lg ${isFormValid() ? 'bg-blue-500' : 'bg-gray-300'}`}
                                onPress={onConfirm}
                                disabled={!isFormValid()}
                            >
                                <Text className={`text-center font-bold ${isFormValid() ? 'text-white' : 'text-gray-500'}`}>
                                    Confirm
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </DismissKeyboard>
            </View>
        </Modal>
    );
}