

import { router, Stack } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

export default function ConfigLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="setting"
                options={{
                    headerShown: true,
                    title: "Developer Settings",
                    presentation: 'modal',
                    headerStyle: {
                        backgroundColor: '#f8f9fa',
                    },
                    headerTitleStyle: {
                        fontWeight: 'bold',
                        color: '#333',
                    },
                    headerLeft: () => null,
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={{ padding: 8 }}
                        >
                            <Text style={{ color: '#007AFF', fontSize: 16 }}>Done</Text>
                        </TouchableOpacity>
                    ),
                    // Animation options
                    animationTypeForReplace: 'push',
                    gestureEnabled: true,
                }}
            />
        </Stack>
    )
}