import Ionicons from '@expo/vector-icons/Ionicons';
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
  onDismiss,
}) => {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View className="flex-1 items-center justify-center bg-black/50 px-6">
        <View className="w-full max-w-sm rounded-2xl bg-white p-6">
          {/* Error Icon */}
          <View className="mb-4 items-center">
            <View className="mb-3 h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <Ionicons name="cloud-offline" size={32} color="#ef4444" />
            </View>
            <Text className="text-center text-xl font-bold text-gray-800">
              Connection Error
            </Text>
          </View>

          {/* Error Message */}
          <Text className="mb-6 text-center leading-5 text-gray-600">
            Unable to connect to the server. Please check your internet
            connection and try again.
          </Text>

          {/* Action Buttons */}
          <View className="gap-3">
            <TouchableOpacity
              onPress={onRetry}
              style={{ backgroundColor: '#1c3f83' }}
              className="rounded-xl py-3 active:opacity-80"
            >
              <Text className="text-center font-semibold text-white">
                Try Again
              </Text>
            </TouchableOpacity>

            {onDismiss && (
              <TouchableOpacity
                onPress={onDismiss}
                className="rounded-xl border border-gray-300 py-3 active:opacity-80"
              >
                <Text className="text-center font-medium text-gray-600">
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
