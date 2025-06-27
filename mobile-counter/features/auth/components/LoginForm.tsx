import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LoginFormData } from '../types';
import { formatEmployeeId, formatPin } from '../utils/validation';

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  isLoading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState<LoginFormData>({
    employeeId: '',
    pin: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const isFormValid = formData.employeeId.trim() && formData.pin.trim();

  return (
    <View className="gap-5 space-y-4">
      <View>
        <Text className="mb-1 text-gray-700">Employee No.</Text>
        <View className="flex-row items-center rounded-lg border border-gray-200 bg-white px-4 py-3">
          <Ionicons name="person" size={18} color="#6b7280" />
          <TextInput
            className="ml-2 flex-1 p-2 text-black font-bold"
            placeholder="Enter your employee no"
            value={formData.employeeId}
            onChangeText={value =>
              setFormData(prev => ({
                ...prev,
                employeeId: formatEmployeeId(value),
              }))
            }
            keyboardType="default"
            autoCapitalize="none"
            editable={!isLoading}
          />
        </View>
      </View>

      <View>
        <Text className="mb-1 text-gray-700">PIN</Text>
        <View className="flex-row items-center rounded-lg border border-gray-200 bg-white px-4 py-3">
          <Ionicons name="lock-closed" size={18} color="#6b7280" />
          <TextInput
            className="ml-2 flex-1 p-2 text-black font-bold"
            placeholder="Enter your PIN"
            value={formData.pin}
            onChangeText={value =>
              setFormData(prev => ({
                ...prev,
                pin: formatPin(value),
              }))
            }
            secureTextEntry={!showPassword}
            keyboardType="numeric"
            editable={!isLoading}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={18}
              color="#6b7280"
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={isLoading || !isFormValid}
        className={`rounded-lg p-4 ${isLoading || !isFormValid ? 'bg-blue-400' : 'bg-blue-600'
          } items-center`}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text className="font-medium text-white">Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};
