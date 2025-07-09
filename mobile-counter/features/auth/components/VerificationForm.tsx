import React from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';

export interface VerificationFormProps {
  passcode: string;
  setPasscode: (val: string) => void;
  isVerifying: boolean;
  onVerify: () => void;
  onGoBack: () => void;
}

export const VerificationForm: React.FC<VerificationFormProps> = ({
  passcode,
  setPasscode,
  isVerifying,
  onVerify,
  onGoBack,
}) => (
  <View className="gap-3">
    <View className="mb-6">
      <Text className="text-sm font-medium text-gray-700 mb-2">Verification Code</Text>
      <TextInput
        value={passcode}
        onChangeText={setPasscode}
        placeholder="Enter verification code"
        className="border text-black border-gray-300 rounded-lg px-4 py-3 text-center text-lg font-bold bg-gray-50"
        secureTextEntry
        maxLength={10}
        keyboardType="numeric"
        autoFocus
      />
    </View>
    <TouchableOpacity
      onPress={onVerify}
      disabled={isVerifying || !passcode.trim()}
      className={`py-3 px-6 rounded-lg shadow-sm ${isVerifying || !passcode.trim() ? 'bg-gray-400' : 'bg-blue-500'}`}
    >
      <Text className="text-white text-center font-semibold">
        {isVerifying ? <ActivityIndicator size="small" color="white" /> : 'Verify Access'}
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      onPress={onGoBack}
      className="border border-gray-300 py-3 px-6 rounded-lg"
      disabled={isVerifying}
    >
      <Text className="text-gray-700 text-center font-medium">Go Back</Text>
    </TouchableOpacity>
  </View>
); 