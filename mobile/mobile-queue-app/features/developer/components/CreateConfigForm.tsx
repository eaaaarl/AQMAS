import FormInput from '@/features/developer/components/FormInput'
import { CONFIG_CONSTANTS } from '@/features/developer/constants'
import { useConfigUpdate } from '@/features/developer/hooks/useConfig'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

export default function CreateConfigForm() {
    const {
        handleSubmit,
        ipAddress,
        isUpdating,
        port,
        setIpAddress,
        setPort,
        validationErrors,
        resetValidation
    } = useConfigUpdate()

    const handleInputChange = (field: 'ipAddress' | 'port', value: string) => {
        if (field === 'ipAddress') {
            setIpAddress(value)
        } else {
            setPort(value)
        }

        // Reset validation when user starts typing
        if (Object.keys(validationErrors).length > 0) {
            resetValidation()
        }
    }

    return (
        <View className="space-y-6">
            {/* Section Header */}
            <View className="mb-4">
                <Text className="text-lg font-semibold text-gray-900 mb-2">
                    Update Configuration
                </Text>
                <Text className="text-sm text-gray-600">
                    Configure API connection settings for development and testing
                </Text>
            </View>

            {/* Form Fields */}
            <View className="space-y-4 gap-4">
                <FormInput
                    label={CONFIG_CONSTANTS.LABELS.IP_ADDRESS}
                    value={ipAddress}
                    onChangeText={(value) => handleInputChange('ipAddress', value)}
                    placeholder={CONFIG_CONSTANTS.PLACEHOLDERS.IP_ADDRESS}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isUpdating}
                    error={validationErrors.ipAddress}
                />

                <FormInput
                    label={CONFIG_CONSTANTS.LABELS.PORT}
                    value={port}
                    onChangeText={(value) => handleInputChange('port', value)}
                    placeholder={CONFIG_CONSTANTS.PLACEHOLDERS.PORT}
                    keyboardType="numeric"
                    editable={!isUpdating}
                    error={validationErrors.port}
                />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
                className={`mt-4 p-4 rounded-lg ${isUpdating
                    ? 'bg-gray-400'
                    : 'bg-blue-500 active:bg-blue-600'
                    }`}
                onPress={handleSubmit}
                disabled={isUpdating}
                activeOpacity={0.8}
            >
                <Text className="text-white text-center font-semibold text-base">
                    {isUpdating
                        ? CONFIG_CONSTANTS.LABELS.UPDATING_BUTTON
                        : CONFIG_CONSTANTS.LABELS.UPDATE_BUTTON
                    }
                </Text>
            </TouchableOpacity>
        </View>
    )
}