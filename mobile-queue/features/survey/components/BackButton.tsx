import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface BackButtonProps {
    onPress: () => void;
}

export default function BackButton(props: BackButtonProps) {
    const {
        onPress
    } = props;
    return (
        <TouchableOpacity
            className="absolute top-12 left-4 bg-white p-4 rounded-full shadow-lg z-10"
            onPress={onPress}
        >
            <Text className="text-gray-700 font-bold text-lg">←</Text>
        </TouchableOpacity>
    )
}