import { Stack } from 'expo-router';
import React from 'react';

export default function SurveyLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name='survey' />
        </Stack>
    )
}