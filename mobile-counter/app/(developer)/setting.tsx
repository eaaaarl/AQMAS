import ConfigDisplay from '@/features/developer/components/ConfigDisplay';
import { DeveloperConfigForm } from '@/features/developer/components/DeveloperConfigForm';
import { DeveloperTips } from '@/features/developer/components/DeveloperTips';
import { useDeveloperSetting } from '@/features/developer/hooks/useDeveloperSetting';
import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';

export default function Setting() {
  const {
    currentConfig,
    ipAddress,
    port,
    setIpAddress,
    setPort,
    handleSave,
    isCheckingDevice,
  } = useDeveloperSetting();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <ConfigDisplay currentConfig={currentConfig} className="mb-6" />
        <DeveloperConfigForm
          ipAddress={ipAddress}
          port={port}
          setIpAddress={setIpAddress}
          setPort={setPort}
          handleSave={handleSave}
          isCheckingDevice={isCheckingDevice}
        />
        <DeveloperTips />
        <SafeAreaView className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}