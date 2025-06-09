import TapDetector from '@/components/TapsDetector';
import { Stack } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import React, { useEffect } from 'react';

export default function LayoutService() {
    useEffect(() => {
        async function setOrientation() {
            await ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.PORTRAIT
            );
        }
        setOrientation();

        return () => {
            ScreenOrientation.unlockAsync();
        };
    }, []);
    return (
        <TapDetector>
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
            </Stack>
        </TapDetector>
    )
}