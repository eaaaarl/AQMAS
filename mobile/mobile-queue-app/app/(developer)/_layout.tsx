

import { Stack } from 'expo-router'
import React from 'react'

export default function ConfigLayout() {
    return (
        <Stack>
            <Stack.Screen name="setting" options={{
                headerShown: true,
                title: "Developer Settings",
                presentation: 'modal'
            }} />
        </Stack>
    )
}