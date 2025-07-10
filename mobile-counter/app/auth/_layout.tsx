import TapDetector from '@/features/developer/components/TapDetector';
import { useAppSelector } from '@/libs/redux/hooks';
import { Redirect, router, Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  const emp = useAppSelector(state => state.employee);

  if (emp.employee_id) {
    return <Redirect href={'/(tabs)'} />;
  }


  return (
    <TapDetector
      TAPS_COUNT_THRESHOLD={7}
      alertTitle="🚀 Developer Mode"
      alertMessage="You've unlocked developer settings! Want to continue?"
      onThresholdReached={() => {
        console.log('Dev mode activated!');
        router.push('/(developer)/setting');
      }}
    >
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="not-registered" options={{ headerShown: false }} />
        <Stack.Screen name="unauthorize" options={{ headerShown: false }} />
        <Stack.Screen name="verification" options={{ headerShown: false }} />
      </Stack>
    </TapDetector>
  );
}
