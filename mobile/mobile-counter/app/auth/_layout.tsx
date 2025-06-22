import { useAppSelector } from '@/libs/redux/hooks';
import { Redirect, Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  const emp = useAppSelector(state => state.employee);
  if (emp.employee_id) {
    return <Redirect href={'/(tabs)'} />;
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}
