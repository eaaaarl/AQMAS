import {
  ActionButtons,
  CounterHeader,
  CounterSummary,
  CurrentDate,
  CurrentTime,
  SkippedTickets,
  TicketDetails,
  TicketDisplay,
} from '@/features/counter/components';
import { useCounterScreen } from '@/features/counter/hooks/useCounterScreen';
import React from 'react';
import { Linking, RefreshControl, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

export default function CounterScreen() {

  const {
    refreshing,
    hasActiveTicket,
    hasConnectionError,
    config,
    roleName,
    counterNo,
    queue,
    displayQueue,
    hasQueueData,
    onRefresh,
    onHandleNext,
    onFinish,
    onSkip,
    onReturnSkippedTicket,
    isCallingQueue,
    isRecallingQueue,
    isFinishingQueue,
    isSkippingQueue,
    queueSkippedData,
    counters,
    timeStats,
    handleRecall,
  } = useCounterScreen();

  const handlePoweredByPress = () => {
    Linking.openURL('https://g-hoven.com');
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#1c3f83" />
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

        <View className="overflow-hidden rounded-2xl bg-white shadow-lg my-2">
          <CounterHeader
            config={config ?? []}
            counterNo={counterNo as number}
            roleName={roleName as string}
            currentDate={<CurrentDate style={{ color: 'white' }} />}
            currentTime={<CurrentTime style={{ color: 'white' }} />}
            hasQueuedData={hasQueueData}
            hasConnectionError={hasConnectionError}
          />

          <TicketDisplay
            ticketNo={displayQueue?.ticketNo as string}
            customerName={displayQueue?.customerName as string}
            hasActiveTicket={hasActiveTicket}
          />

          <ActionButtons
            hasActiveTicket={hasActiveTicket}
            isCallingQueue={isCallingQueue}
            isRecallingQueue={isRecallingQueue}
            isFinishingQueue={isFinishingQueue}
            isSkippingQueue={isSkippingQueue}
            hasQueuedData={hasQueueData}
            onNext={onHandleNext}
            onRecall={handleRecall}
            onFinish={onFinish}
            onSkip={onSkip}
          />

          <TicketDetails
            hasActiveTicket={hasActiveTicket}
            services={displayQueue?.services}
            customerType={displayQueue?.customerType}
          />

          <SkippedTickets
            skippedData={queueSkippedData ?? []}
            onReturnTicket={onReturnSkippedTicket}
          />

          <CounterSummary
            finishedCount={counters.finishedCount}
            skippedCount={counters.skippedCount}
            remainingCount={counters.remainingCount}
            queue={queue ?? undefined}
            bestTime={timeStats.bestTime}
            worstTime={timeStats.worstTime}
          />

        </View>

        {/* Powered By Footer */}
        <TouchableOpacity
          className="items-center justify-center py-4 mb-2"
          onPress={handlePoweredByPress}
          activeOpacity={0.7}
        >
          <Text className="text-gray-500 text-sm font-medium">
            Powered By: GHOVEN APP WORLD
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}