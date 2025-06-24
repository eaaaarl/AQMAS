import DismissKeyboard from '@/components/DismissKeyboard';
import React from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface CustomerNameModalProps {
    isShowName: boolean;
    customerName: string;
    onCustomerNameChange: (name: string) => void;
    onConfirm: () => void;
    onCancel: () => void;
    errMsg: string;
}

export default function CustomerNameModal({
    isShowName,
    customerName,
    onCustomerNameChange,
    onConfirm,
    onCancel,
    errMsg
}: CustomerNameModalProps) {
    return (
        <Modal
            visible={isShowName}
            transparent={true}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View className="flex-1 justify-center items-center bg-black/50">
                <DismissKeyboard>
                    <View className="bg-white rounded-lg p-6 w-4/5 max-w-md">
                        <Text className="text-gray-600 text-center mb-4">
                            Please enter customer name for record keeping
                        </Text>
                        {errMsg && (
                            <Text className="text-red-500 text-xs mb-4 mt-1">
                                {errMsg}
                            </Text>
                        )}
                        <TextInput
                            className={`border ${errMsg ? 'border-red-400' : 'border-gray-300'} rounded-lg p-3 mb-2 text-lg`}
                            placeholder="Customer Name"
                            value={customerName}
                            onChangeText={onCustomerNameChange}
                            autoFocus={true}
                            autoCapitalize="words"
                        />

                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                className="flex-1 bg-gray-500 p-3 rounded-lg"
                                onPress={onCancel}
                            >
                                <Text className="text-white text-center font-bold">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="flex-1 bg-blue-500 p-3 rounded-lg"
                                onPress={onConfirm}
                            >
                                <Text className="text-white text-center font-bold">Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </DismissKeyboard>
            </View>
        </Modal>
    )
}