import TapDetector from '@/components/TapsDetector';
import { router, Stack } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import React, { useEffect } from 'react';

export default function LayoutService() {
    useEffect(() => {
        async function setOrientation() {
            await ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.ALL
            );
        }
        setOrientation();

        return () => {
            ScreenOrientation.unlockAsync();
        };
    }, []);
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
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
            </Stack>
        </TapDetector>
    )
}