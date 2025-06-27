import TapDetector from '@/components/TapsDetector';
import { useCheckDeviceQuery } from '@/features/device/api/deviceApi';
import { DeviceType } from '@/features/device/constants';
import * as Application from 'expo-application';
import { router, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';

export default function LayoutService() {
    console.log("LayoutService");
    const deviceId = Platform.OS === 'android'
        ? Application.getAndroidId()
        : Application.applicationId || '';

    const { data: deviceStatus, isLoading, error } = useCheckDeviceQuery({
        id: deviceId,
        type: DeviceType.KIOSK
    });

    useEffect(() => {
        if (!isLoading) {
            if (!deviceStatus?.registered) {
                router.replace('/(service)/unauthorize');
            }
        }
    }, [deviceStatus, isLoading, error]);

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
            <Stack screenOptions={{ headerShown: false }} />
        </TapDetector>
    );
}