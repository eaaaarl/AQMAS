import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

interface GlobalErrorOverlayProps {
    isVisible: boolean;
    onRetry: () => void;
    onDismiss?: () => void;
}

export const GlobalErrorOverlay: React.FC<GlobalErrorOverlayProps> = ({
    isVisible,
    onRetry,
    onDismiss
}) => {
    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="fade"
            statusBarTranslucent
        >
            <View className="flex-1 bg-black/50 justify-center items-center px-6">
                <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
                    {/* Error Icon */}
                    <View className="items-center mb-4">
                        <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-3">
                            <Ionicons name="cloud-offline" size={32} color="#ef4444" />
                        </View>
                        <Text className="text-xl font-bold text-gray-800 text-center">
                            Connection Error
                        </Text>
                    </View>

                    {/* Error Message */}
                    <Text className="text-gray-600 text-center mb-6 leading-5">
                        Unable to connect to the server. Please check your internet connection and try again.
                    </Text>

                    {/* Action Buttons */}
                    <View className="space-y-3">
                        <TouchableOpacity
                            onPress={onRetry}
                            style={{ backgroundColor: '#1c3f83' }}
                            className="py-3 rounded-xl active:opacity-80"
                        >
                            <Text className="text-white font-semibold text-center">
                                Try Again
                            </Text>
                        </TouchableOpacity>

                        {onDismiss && (
                            <TouchableOpacity
                                onPress={onDismiss}
                                className="py-3 rounded-xl border border-gray-300 active:opacity-80"
                            >
                                <Text className="text-gray-600 font-medium text-center">
                                    Dismiss
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
}; 