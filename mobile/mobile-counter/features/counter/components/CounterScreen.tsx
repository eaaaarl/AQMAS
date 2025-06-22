import { OfflineIndicator, useGlobalError } from '@/features/error';
import React, { useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCounter } from '../hooks';

export default function CounterScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const { hasConnectionError } = useGlobalError();
  const {
    config,
    roleName,
    counterNo,
    currentTime,
    currentTicket,
    handleRefresh,
    handleNext,
    handleRecall,
    handleFinished,
    handleSkip,
  } = useCounter();

  const onRefresh = async () => {
    setRefreshing(true);
    await handleRefresh();
    setRefreshing(false);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#1c3f83" />
      <OfflineIndicator isOffline={hasConnectionError} />
      <ScrollView
        className="flex-1 p-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#1c3f83']}
            tintColor="#1c3f83"
          />
        }
      >
        <View className="overflow-hidden rounded-2xl bg-white shadow-lg">
          <View style={{ backgroundColor: '#1c3f83' }} className="px-6 py-4">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-white">
                {config?.[0]?.Value} {counterNo}
              </Text>
              <TouchableOpacity>
                <Text className="text-xl text-white/80">☰</Text>
              </TouchableOpacity>
            </View>
            <View>
              <Text className="text-sm text-white/80">
                {counterNo} {roleName}
              </Text>
              <Text className="text-xl font-bold text-white">
                {currentTime.toLocaleTimeString('en-PH', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true,
                })}
              </Text>
              <Text className="text-sm text-white/80">
                Today,{' '}
                {currentTime.toLocaleDateString('en-PH', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            </View>
          </View>

          <View className="items-center px-6 py-8">
            <Text className="mb-2 text-sm text-gray-500">Ticket Number</Text>
            <Text className="mb-4 text-5xl font-bold tracking-widest text-orange-500">
              {currentTicket.number}
            </Text>
            <Text className="mb-1 text-sm text-gray-500">Customer Name</Text>
            <Text
              style={{ color: '#1c3f83' }}
              className="text-xl font-semibold"
            >
              {currentTicket.customerName}
            </Text>
          </View>

          <View className="px-6 pb-6">
            <View className="mb-3 flex-row gap-3">
              <TouchableOpacity
                onPress={handleNext}
                style={{ backgroundColor: '#1c3f83' }}
                className="flex-1 rounded-xl py-3 active:opacity-80"
              >
                <Text className="text-center font-medium text-white">
                  → Next
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleRecall}
                style={{ backgroundColor: '#1c3f83' }}
                className="flex-1 rounded-xl py-3 active:opacity-80"
              >
                <Text className="text-center font-medium text-white">
                  ↻ Recall
                </Text>
              </TouchableOpacity>
            </View>

            <View className="mb-6 flex-row gap-3">
              <TouchableOpacity
                onPress={handleFinished}
                style={{ backgroundColor: '#1c3f83' }}
                className="flex-1 rounded-xl py-3 active:opacity-80"
              >
                <Text className="text-center font-medium text-white">
                  ✓ Finished
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSkip}
                style={{ backgroundColor: '#1c3f83' }}
                className="flex-1 rounded-xl py-3 active:opacity-80"
              >
                <Text className="text-center font-medium text-white">
                  ⏭ Skip
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="px-6 pb-6">
            <View className="mb-4 rounded-xl border border-gray-300 bg-gray-50 p-4">
              <View className="mb-4 items-center">
                <Text className="mb-1 text-sm text-gray-500">Service</Text>
                <Text
                  style={{ color: '#1c3f83' }}
                  className="text-lg font-semibold"
                >
                  {currentTicket.service}
                </Text>
              </View>
              <View className="items-center">
                <Text className="mb-1 text-sm text-gray-500">
                  Customer Type
                </Text>
                <Text
                  style={{ color: '#1c3f83' }}
                  className="text-center font-medium"
                >
                  {currentTicket.customerType}
                </Text>
              </View>
            </View>
          </View>

          <View className="px-6 pb-6">
            <Text className="mb-4 text-center text-sm font-medium text-gray-500">
              Summary
            </Text>
            <View className="gap-3 space-y-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-600">Finished</Text>
                <Text style={{ color: '#1c3f83' }} className="font-semibold">
                  {currentTicket.finished}
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-600">Skipped</Text>
                <Text style={{ color: '#1c3f83' }} className="font-semibold">
                  {currentTicket.skipped}
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-600">Best Time</Text>
                <Text className="text-gray-400">
                  {currentTicket.bestTime || '-'}
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-600">Worst Time</Text>
                <Text className="text-gray-400">
                  {currentTicket.worstTime || '-'}
                </Text>
              </View>
              <View className="flex-row items-center justify-between border-t border-gray-200 pt-3">
                <Text className="font-medium text-gray-600">Remaining</Text>
                <Text
                  style={{ color: '#1c3f83' }}
                  className="text-lg font-bold"
                >
                  {currentTicket.remaining}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
