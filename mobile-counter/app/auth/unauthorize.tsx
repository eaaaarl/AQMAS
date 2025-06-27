import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Unauthorize() {
  const handleVerification = () => {
    router.push('/auth/verification');
  };

  const handleContactAdmin = () => {
    // Handle contact admin logic
    console.log('Contact administrator');
  };

  const handleTryAgain = () => {
    // Handle try again logic - maybe go back to config
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-red-50">
      <View className="flex-1 justify-center items-center px-6">
        <View className="bg-white rounded-2xl p-8 shadow-lg w-full max-w-sm border border-red-100">
          {/* Icon */}
          <View className="items-center mb-6">
            <View className="w-20 h-20 bg-red-100 rounded-full items-center justify-center mb-4">
              <Text className="text-4xl">🚫</Text>
            </View>

            <Text className="text-2xl font-bold text-red-600 text-center mb-2">
              Access Denied
            </Text>

            <Text className="text-gray-600 text-center leading-relaxed">
              You don&apos;t have permission to access this application. Please verify your access or contact your administrator.
            </Text>
          </View>

          {/* Status Card */}
          <View className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <View className="flex-row items-center mb-2">
              <View className="w-3 h-3 bg-red-500 rounded-full mr-3"></View>
              <Text className="text-red-700 font-semibold">Unauthorized Device</Text>
            </View>
            <Text className="text-red-600 text-sm">
              This device is not registered or has been denied access by the administrator.
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="gap-3">
            {/* Primary Verification Button */}
            <TouchableOpacity
              onPress={handleVerification}
              className="bg-blue-500 py-3 px-6 rounded-lg shadow-sm"
            >
              <Text className="text-white text-center font-semibold">
                🔐 Enter Verification Code
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleContactAdmin}
              className="bg-red-500 py-3 px-6 rounded-lg shadow-sm"
            >
              <Text className="text-white text-center font-semibold">
                Contact Administrator
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleTryAgain}
              className="border border-gray-300 py-3 px-6 rounded-lg"
            >
              <Text className="text-gray-700 text-center font-medium">
                Try Again
              </Text>
            </TouchableOpacity>
          </View>

          {/* Help Text */}
          <View className="mt-6 pt-4 border-t border-gray-200">
            <Text className="text-xs text-gray-500 text-center leading-relaxed">
              If you have a verification code from your administrator, tap the verification button above.
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}