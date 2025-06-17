import { router } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

export default function BackButton() {
    return (
        <TouchableOpacity
            className="absolute top-12 left-4 bg-white p-4 rounded-full shadow-lg z-10"
            onPress={() => router.push('/(service)')}
        >
            <Text className="text-gray-700 font-bold text-lg">←</Text>
        </TouchableOpacity>
    )
}