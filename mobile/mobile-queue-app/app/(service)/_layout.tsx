import TapDetector from '@/components/TapsDetector';
import { router, Stack } from 'expo-router';
import React from 'react';

export default function LayoutService() {

    return (
        <TapDetector
            TAPS_COUNT_THRESHOLD={7}
            alertTitle="🚀 Developer Mode"
            alertMessage="You've unlocked developer settings! Want to continue?"
            onThresholdReached={() => {
                console.log("Dev mode activated!");
                router.push('/(developer)/setting');
            }}
        >
            <Stack screenOptions={{ headerShown: false }} >
            </Stack>
        </TapDetector>
    )
}