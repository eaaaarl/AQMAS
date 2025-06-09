import { Stack } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import React, { useEffect } from 'react';

export default function LayoutService() {
    useEffect(() => {
        // Lock orientation to landscape when this layout mounts
        async function setOrientation() {
            await ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.LANDSCAPE
            );
        }
        setOrientation();

        return () => {
            ScreenOrientation.unlockAsync();
        };
    }, []);

    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
    )
}