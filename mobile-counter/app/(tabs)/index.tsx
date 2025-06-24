import { useCounter } from '@/features/counter/hooks';
import { OfflineIndicator, useGlobalError } from '@/features/error';
import {
  useCallQueueFinishMutation,
  useCallQueueMutation,
  useCallQueueRecallMutation,
  useCallQueueSkipMutation,
  useGetQueueDetailEmpIdQuery,
  useGetQueueQueuedQuery,
  useGetQueueSkippedQuery,
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
  const [callQueueSkip, { isLoading: isSkippingQueue }] =
    useCallQueueSkipMutation();
  const { data: queueSkippedData, refetch: refetchQueueSkippedData } =
    useGetQueueSkippedQuery(
      {
        employeeId: emp.employee_id as number,
      },
      { skip: !emp.employee_id }
    );

  // Get queued data (for skipped tickets)
  const { data: queueQueuedData, refetch: refetchQueuedData } =
    useGetQueueQueuedQuery(
      {
        employeeId: emp.employee_id as number,
      },
      {
        skip: !emp.employee_id,
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
      }
    );

  const onHandleNext = async () => {
    try {
      // Get fresh data in parallel
      const [freshQueueResult, queuedDataResult] = await Promise.all([
        QueueRefetch(),
        refetchQueuedData(),
      ]);

      // Priority order: freshQueue -> queue -> queuedData (for skipped tickets)
      const queueToUse =
        freshQueueResult.data || queue || queuedDataResult.data;

      console.log('Fresh queue data:', freshQueueResult.data);
      console.log('Regular queue data:', queue);
      console.log('Queued data (skipped):', queuedDataResult.data);
      console.log('Queue to use:', queueToUse);

      if (!queueToUse) {
        Toast.show({
          type: 'error',
          text1: 'No queue available',
          text2: 'Please wait for a queue to be available before proceeding.',
        });
        return;
      }

      if (
        (hasActiveTicket && persistedQueue.ticketNo) ||
        persistedQueue.queuedData?.ticketNo
      ) {
        Toast.show({
          type: 'info',
          text1: 'Active Ticket Found',
          text2:
            'Please finish or skip the current ticket before calling next.',
        });
        return;
      }

      const res = await callQueue({
        employeeId: emp.employee_id as number,
        counterNo: counterNo as unknown as number,
        ticketNo: queueToUse?.ticketNo as string,
      }).unwrap();

      dispatch(
        setQueue({
          employeeId: emp.employee_id as number,
          counterNo: counterNo as unknown as number,
          ticketNo: queueToUse?.ticketNo as string,
          customerName: queueToUse?.customerName as string,
          services: queueToUse?.services,
          customerType: queueToUse?.customerType as string,
        })
      );

      Toast.show({
        type: 'success',
        text1: 'Queue Called Successfully',
        text2: res.message || `Ticket ${queueToUse?.ticketNo} has been called.`,
      });

      setHasActiveTicket(true);

      // Refresh all data in parallel after successful call
      await Promise.all([
        handleRefresh(),
        refetchQueuedData(),
        queueDetailRefetch(),
      ]);
      setLastUpdated(new Date());
    } catch (error: any) {
      console.error('Failed to call queue:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to Call Queue',
        text2: error?.data?.message || error?.message || 'Failed to call queue',
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

    try {
      const finishPromise = callQueueFinish({
        ticketNo: persistedQueue.ticketNo,
      }).unwrap();

      dispatch(queueSlice.actions.resetQueue());
      setHasActiveTicket(false);

      // Wait for finish operation to complete
      await finishPromise;

      // Refresh all data in parallel
      await Promise.all([
        handleRefresh(),
        refetchQueuedData(),
        queueDetailRefetch(),
      ]);
      setLastUpdated(new Date());

      Toast.show({
        type: 'success',
        text1: 'Ticket Finished',
        text2: 'Ticket has been completed successfully.',
      });
    } catch (error: any) {
      console.error('Failed to finish queue:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to Finish Ticket',
        text2: error?.data?.message || 'Something went wrong',
      });
    }
  };

  const onHandleSkip = async () => {
    if (!hasActiveTicket || !persistedQueue.ticketNo) {
      Toast.show({
        type: 'info',
        text1: 'No Active Ticket',
        text2: 'Please call a queue before skipping.',
      });
      return;
    }

    try {
      // Call the skip mutation with the current ticket
      await callQueueSkip({
        ticketNo: persistedQueue.ticketNo,
      }).unwrap();

      // Reset state immediately
      dispatch(queueSlice.actions.resetQueue());
      setHasActiveTicket(false);

      // Refresh all data in parallel
      await Promise.all([
        handleRefresh(),
        refetchQueuedData(),
        queueDetailRefetch(),
        refetchQueueSkippedData(), // Add this to refresh skipped queue data
      ]);
      setLastUpdated(new Date());

      Toast.show({
        type: 'info',
        text1: 'Ticket Skipped',
        text2:
          'The current ticket has been skipped and is available for recall.',
      });
    } catch (error: any) {
      console.error('Error during skip:', error);
      Toast.show({
        type: 'error',
        text1: 'Skip Failed',
        text2:
          error?.data?.message || 'There was an error skipping the ticket.',
      });
    }
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
    try {
      await callQueueRecall({
        ticketNo: persistedQueue.ticketNo as string,
      }).unwrap();

      Toast.show({
        type: 'success',
        text1: 'Queue Recalled Successfully',
        text2: `Ticket ${persistedQueue.ticketNo} has been recalled.`,
      });

      // Refresh all data in parallel
      await Promise.all([
        handleRefresh(),
        refetchQueuedData(),
        queueDetailRefetch(),
      ]);
      setLastUpdated(new Date());
    } catch (error: any) {
      console.error('Failed to recall queue:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to Recall',
        text2: error?.data?.message || 'Something went wrong',
      });
    }
  };

  // Queue data hooks with different purposes:
  // 1. queue: Gets available tickets based on employee's services and customer types
  // 2. queueSkippedData: Gets tickets that were skipped by this employee
  // 3. queueQueuedData: Gets tickets that are in queue for this employee
  // 4. queueDetail: Gets detailed transaction history for this employee

  const finishedCount =
    queueDetail?.filter(item => item.trans_status === 3).length ?? 0;

  const remainingCount =
    queueDetail?.filter(item => item.trans_status === 0).length ?? 0;

  const skippedCount =
    queueDetail?.filter(item => item.trans_status === 2).length ?? 0;

  // Display queue prioritizes active ticket over available queue
  // If there's an active ticket (hasActiveTicket), show that from persistedQueue
  // Otherwise, show the next available ticket from queue
  const displayQueue =
    hasActiveTicket && persistedQueue.ticketNo ? persistedQueue : queue;

  // Indicates if there are queued tickets available to be served
  // This helps show the orange indicator when there are tickets waiting
  const hasQueuedData = queueQueuedData && queueQueuedData.ticketNo;

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
              {hasQueuedData && (
                <View className="rounded-full bg-orange-500 px-2 py-1">
                  <Text className="text-xs font-semibold text-white">
                    Queued Available
                  </Text>
                </View>
              )}
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
                disabled={!hasActiveTicket || isRecallingQueue}
                className="flex-1 rounded-xl py-3 active:opacity-80"
              >
                <Text className="text-center font-medium text-white">
                  {isRecallingQueue ? 'Recalling...' : '↻ Recall'}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="mb-6 flex-row gap-3">
              <TouchableOpacity
                onPress={onHandleFinished}
                style={{
                  backgroundColor: hasActiveTicket ? '#1c3f83' : '#ccc',
                }}
                disabled={!hasActiveTicket || isFinishingQueue}
                className="flex-1 rounded-xl py-3 active:opacity-80"
              >
                <Text className="text-center font-medium text-white">
                  {isFinishingQueue ? 'Finishing...' : '✓ Finished'}
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
              Skipped Tickets
            </Text>
            {/* Display skipped tickets if available */}
            {queueSkippedData ? (
              <View className="space-y-3">
                {/* If queueSkippedData is a single object, wrap it in an array */}
                {[queueSkippedData].flat().map((ticket: any) => (
                  <View
                    key={ticket.ticketNo}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-3"
                  >
                    <View className="flex-row items-center justify-between">
                      <View>
                        <Text className="text-lg font-semibold text-orange-500">
                          {ticket.ticketNo}
                        </Text>
                        <Text className="text-sm text-gray-600">
                          {ticket.customerName}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          // Set the persisted queue with the skipped ticket data
                          dispatch(
                            setQueue({
                              employeeId: emp.employee_id as number,
                              counterNo: counterNo as unknown as number,
                              ticketNo: ticket.ticketNo,
                              customerName: ticket.customerName,
                              services: ticket.services,
                              customerType: ticket.customerType,
                            })
                          );
                          setHasActiveTicket(true);
                          // Call the recall function
                          onHandleRecall();
                        }}
                        className="rounded-lg bg-blue-500 px-3 py-2"
                      >
                        <Text className="text-sm font-medium text-white">
                          Return
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <Text className="text-center text-gray-500">
                No skipped tickets
              </Text>
            )}
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
