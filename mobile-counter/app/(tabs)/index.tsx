import { useCounter } from '@/features/counter/hooks';
import { OfflineIndicator, useGlobalError } from '@/features/error';
import {
  useCallQueueFinishMutation,
  useCallQueueMutation,
  useCallQueueRecallMutation,
  useGetQueueDetailEmpIdQuery,
  useGetQueueQueuedQuery,
} from '@/features/queue/api/queueApi';
import { useAppDispatch, useAppSelector } from '@/libs/redux/hooks';
import { queueSlice, setQueue } from '@/libs/redux/state/queueSlice';
import React, { useEffect, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

export default function CounterScreen() {
  const dispatch = useAppDispatch();
  const emp = useAppSelector(state => state.employee);
  const persistedQueue = useAppSelector(state => state.queue);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [hasActiveTicket, setHasActiveTicket] = useState(false);
  const { hasConnectionError } = useGlobalError();
  const {
    config,
    roleName,
    counterNo,
    currentTime,
    queue,
    handleRefresh,
    QueueRefetch,
  } = useCounter();

  useEffect(() => {
    if (persistedQueue.ticketNo && persistedQueue.ticketNo !== '') {
      setHasActiveTicket(true);
    }
  }, [persistedQueue.ticketNo]);

  const onRefresh = async () => {
    setRefreshing(true);
    await handleRefresh();
    await queueDetailRefetch();
    setLastUpdated(new Date());
    setRefreshing(false);
  };

  const [callQueue, { isLoading: isCallingQueue }] = useCallQueueMutation();
  const [callQueueFinish, { isLoading: isFinishingQueue }] =
    useCallQueueFinishMutation();
  const [callQueueRecall, { isLoading: isRecallingQueue }] =
    useCallQueueRecallMutation();
  const { data: queueQueuedData } = useGetQueueQueuedQuery(
    {
      employeeId: emp.employee_id as number,
    },
    {
      skip: !emp.employee_id,
    }
  );
  const onHandleNext = async () => {
    await QueueRefetch();
    if (hasActiveTicket && persistedQueue.ticketNo) {
      Toast.show({
        type: 'info',
        text1: 'Active Ticket Found',
        text2: 'Please finish or skip the current ticket before calling next.',
      });
      return;
    }

    if (!queue) {
      Toast.show({
        type: 'error',
        text1: 'No queue available',
        text2: 'Please wait for a queue to be available before proceeding.',
      });
      return;
    }

    if (
      !emp.employee_id ||
      emp.employee_id === undefined ||
      emp.employee_id === null
    ) {
      Toast.show({
        type: 'error',
        text1: 'Missing Employee ID',
        text2: 'Employee ID is required to call queue.',
      });
      return;
    }

    if (
      !counterNo ||
      counterNo === undefined ||
      counterNo === null ||
      counterNo === 'undefined'
    ) {
      Toast.show({
        type: 'error',
        text1: 'Missing Counter Number',
        text2: 'Counter Number is required to call queue.',
      });
      return;
    }

    if (
      !queue.ticketNo ||
      queue.ticketNo === undefined ||
      queue.ticketNo === null
    ) {
      Toast.show({
        type: 'error',
        text1: 'Missing Ticket Number',
        text2: 'Ticket Number is required to call queue.',
      });
      return;
    }

    // Convert and validate counterNo
    const counterNumber = Number(counterNo);
    if (isNaN(counterNumber)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Counter Number',
        text2: 'Counter Number must be a valid number.',
      });
      return;
    }

    try {
      console.log('Calling queue with:', {
        empId: emp.employee_id,
        counterNo: counterNumber,
        ticketNo: queue.ticketNo,
      });

      const res = await callQueue({
        employeeId: emp.employee_id as number,
        counterNo: counterNumber,
        ticketNo: queue.ticketNo,
      }).unwrap();

      console.log('Call Queue Response:', res);

      dispatch(
        setQueue({
          employeeId: emp.employee_id,
          counterNo: counterNumber,
          ticketNo: queue.ticketNo,
          customerName: queue.customerName,
          services: queue.services,
          customerType: queue.customerType,
        })
      );

      Toast.show({
        type: 'success',
        text1: 'Queue Called Successfully',
        text2: res.message || `Ticket ${queue.ticketNo} has been called.`,
      });

      setHasActiveTicket(true);

      await handleRefresh();
      await queueDetailRefetch();
      setLastUpdated(new Date());
    } catch (error: any) {
      console.error('Failed to call queue:', error);

      const errorMessage =
        error?.data?.message || error?.message || 'Failed to call queue';

      Toast.show({
        type: 'error',
        text1: 'Failed to Call Queue',
        text2: errorMessage,
      });
    }
  };
  const onHandleFinished = async () => {
    if (!hasActiveTicket || !persistedQueue.ticketNo) {
      Toast.show({
        type: 'info',
        text1: 'No Active Ticket',
        text2: 'Please call a queue before finishing.',
      });
      return;
    }
    await callQueueFinish({
      ticketNo: persistedQueue.ticketNo,
    }).unwrap();
    dispatch(queueSlice.actions.resetQueue());
    setHasActiveTicket(false);
    await handleRefresh();
    await queueDetailRefetch();
    setLastUpdated(new Date());
  };

  const onHandleSkip = async () => {
    dispatch(queueSlice.actions.resetQueue());
    setHasActiveTicket(false);
  };

  const { data: queueDetail, refetch: queueDetailRefetch } =
    useGetQueueDetailEmpIdQuery(
      {
        employee_id: emp.employee_id as number,
      },
      {
        skip: !emp.employee_id,
        refetchOnMountOrArgChange: 30,
        refetchOnFocus: false,
      }
    );

  const onHandleRecall = async () => {
    const res = await callQueueRecall({
      ticketNo: persistedQueue.ticketNo,
    }).unwrap();
    console.log('Recall Response:', res);
    Toast.show({
      type: 'success',
      text1: 'Queue Recalled Successfully',
      text2: `Ticket ${persistedQueue.ticketNo} has been recalled.`,
    });
  };

  const finishedCount =
    queueDetail?.filter(item => item.trans_status === 3).length ?? 0;

  const remainingCount =
    queueDetail?.filter(item => item.trans_status === 0).length ?? 0;

  const skippedCount =
    queueDetail?.filter(item => item.trans_status === 2).length ?? 0;

  const displayQueue =
    hasActiveTicket && persistedQueue.ticketNo ? persistedQueue : queue;

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
            </View>
            <View>
              <Text className="text-sm text-white/80">{roleName}</Text>
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
              <Text className="text-xs text-white/60">
                Last updated:{' '}
                {lastUpdated.toLocaleTimeString('en-PH', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </Text>
            </View>
          </View>

          <View className="items-center px-6 py-8">
            <Text className="mb-2 text-sm text-gray-500">Ticket Number</Text>
            <Text className="mb-4 text-5xl font-bold tracking-widest text-orange-500">
              {hasActiveTicket && displayQueue?.ticketNo
                ? displayQueue.ticketNo
                : '---'}
            </Text>
            <Text className="mb-1 text-sm text-gray-500">Customer Name</Text>
            <Text
              style={{ color: '#1c3f83' }}
              className="text-xl font-semibold"
            >
              {hasActiveTicket && displayQueue?.customerName
                ? displayQueue.customerName
                : '---'}
            </Text>
          </View>

          <View className="px-6 pb-6">
            <View className="mb-3 flex-row gap-3">
              <TouchableOpacity
                onPress={onHandleNext}
                style={{
                  backgroundColor: hasActiveTicket ? '#ccc' : '#1c3f83',
                }}
                disabled={hasActiveTicket || isCallingQueue}
                className="flex-1 rounded-xl py-3 active:opacity-80"
              >
                <Text className="text-center font-medium text-white">
                  {isCallingQueue ? 'Calling...' : '→ Next'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onHandleRecall}
                style={{
                  backgroundColor: hasActiveTicket ? '#1c3f83' : '#ccc',
                }}
                disabled={!hasActiveTicket}
                className="flex-1 rounded-xl py-3 active:opacity-80"
              >
                <Text className="text-center font-medium text-white">
                  ↻ Recall
                </Text>
              </TouchableOpacity>
            </View>

            <View className="mb-6 flex-row gap-3">
              <TouchableOpacity
                onPress={onHandleFinished}
                style={{
                  backgroundColor: hasActiveTicket ? '#1c3f83' : '#ccc',
                }}
                disabled={!hasActiveTicket}
                className="flex-1 rounded-xl py-3 active:opacity-80"
              >
                <Text className="text-center font-medium text-white">
                  ✓ Finished
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onHandleSkip}
                style={{
                  backgroundColor: hasActiveTicket ? '#1c3f83' : '#ccc',
                }}
                disabled={!hasActiveTicket}
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
                  {(hasActiveTicket &&
                    displayQueue?.services?.map(
                      service => service.button_caption
                    )) ||
                    '---'}
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
                  {(hasActiveTicket && displayQueue?.customerType) || '---'}
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
                  {finishedCount}
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-600">Skipped</Text>
                <Text style={{ color: '#1c3f83' }} className="font-semibold">
                  {skippedCount}
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-600">Best Time</Text>
                <Text className="text-gray-400">{'00:00:00'}</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-600">Worst Time</Text>
                <Text className="text-gray-400">{'00:00:00'}</Text>
              </View>
              <View className="flex-row items-center justify-between border-t border-gray-200 pt-3">
                <Text className="font-medium text-gray-600">Remaining</Text>
                <Text
                  style={{ color: '#1c3f83' }}
                  className="text-lg font-bold"
                >
                  {queue?.remaining ? Number(queue.remaining) : remainingCount}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
