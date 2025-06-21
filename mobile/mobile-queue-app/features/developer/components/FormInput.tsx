import React from 'react';
import { Text, TextInput, View } from 'react-native';

interface FormInputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    autoCorrect?: boolean;
    editable?: boolean;
    error?: string;
    className?: string;
}

export default function FormInput({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = 'default',
    autoCapitalize = 'none',
    autoCorrect = false,
    editable = true,
    error,
    className = ""
}: FormInputProps) {
    return (
        <View className={`space-y-1 ${className}`}>
            <Text className="text-sm text-gray-700 font-medium">{label}</Text>
            <TextInput
                className={`border rounded-lg px-3 py-4  ${error
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 bg-white'
                    } ${!editable ? 'bg-gray-100' : ''}`}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                autoCorrect={autoCorrect}
                editable={editable}
            />
            {error && (
                <Text className="text-xs text-red-600">{error}</Text>
            )}
        </View>
    );
} 