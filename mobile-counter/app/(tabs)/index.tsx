import { QueueData } from '@/features/counter';
import {
  ActionButtons,
  CounterHeader,
  CounterSummary,
  SkippedTickets,
  TicketDetails,
  TicketDisplay,
} from '@/features/counter/components';
import { useCounter, useCounterActions } from '@/features/counter/hooks';
import { useGlobalError } from '@/features/error';
import { TickitSkipped } from '@/features/queue/api/interface';
import {
  useCallQueueSkipMutation,
  useGetQueueDetailEmpIdQuery,
  useGetQueueQueuedQuery,
  useGetQueueSkippedQuery,
  useLazyGetQueueByIDQuery
} from '@/features/queue/api/queueApi';
import { useAppDispatch, useAppSelector } from '@/libs/redux/hooks';
import { resetQueue, setQueue, setSkippedTicket } from '@/libs/redux/state/queueSlice';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StatusBar, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function CounterScreen() {
  const dispatch = useAppDispatch();
  const persistedQueue = useAppSelector(state => state.queue);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [hasActiveTicket, setHasActiveTicket] = useState(() => {
    return !!(persistedQueue?.ticketNo && persistedQueue.ticketNo !== '');
  });
  const { hasConnectionError } = useGlobalError();

  const {
    config,
    roleName,
    counterNo,
    currentTime,
    queue,
    handleRefresh,
    QueueRefetch,
    emp,
  } = useCounter();

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

  const { data: queueSkippedData, refetch: refetchQueueSkippedData } =
    useGetQueueSkippedQuery(
      {
        employeeId: emp.employee_id as number,
      },
      {
        skip: !emp.employee_id,
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
      }
    );

  const [getQueueByID] = useLazyGetQueueByIDQuery();
  const [callQueueSkip] = useCallQueueSkipMutation();

  const { data: queueDetail, refetch: queueDetailRefetch } =
    useGetQueueDetailEmpIdQuery(
      {
        employee_id: emp.employee_id as number,
      },
      {
        skip: !emp.employee_id,
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
      }
    );

  const {
    handleNext,
    handleFinish,
    handleSkip,
    handleRecall,
    isCallingQueue,
    isFinishingQueue,
    isSkippingQueue,
    isRecallingQueue,
  } = useCounterActions({
    employeeId: emp.employee_id as number,
    counterNo: counterNo as unknown as number,
    hasActiveTicket,
    persistedQueue: persistedQueue as unknown as QueueData,
    handleRefresh,
    refetchQueuedData,
    queueDetailRefetch,
    refetchQueueSkippedData,
  });

  // Check if there's any queue data available
  const hasQueueData = !!queue || !!queueQueuedData;

  // Effect to check for active ticket changes
  useEffect(() => {
    const hasTicket = !!(persistedQueue?.ticketNo && persistedQueue.ticketNo !== '');
    console.log('Setting hasActiveTicket:', {
      hasTicket,
      currentTicketNo: persistedQueue?.ticketNo,
      previousState: hasActiveTicket
    });

    if (hasTicket !== hasActiveTicket) {
      setHasActiveTicket(hasTicket);
    }
  }, [persistedQueue?.ticketNo, hasActiveTicket]);

  // Effect to reset active ticket state when component mounts
  useEffect(() => {
    // Reset active ticket state on mount if no ticket in persistedQueue
    if (!persistedQueue?.ticketNo) {
      console.log('Resetting hasActiveTicket on mount');
      setHasActiveTicket(false);
      dispatch(resetQueue());
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Effect to show toast when queue data changes
  useEffect(() => {
    if (hasQueueData && !hasActiveTicket) {
      Toast.show({
        type: 'info',
        text1: 'Queue Available',
        text2: 'You can now call the next ticket.',
        position: 'top',
        visibilityTime: 2000,
      });
    }
  }, [hasQueueData, hasActiveTicket]);

  const onRefresh = async () => {
    setRefreshing(true);
    await handleRefresh();
    await queueDetailRefetch();
    await refetchQueueSkippedData();
    setLastUpdated(new Date());
    setRefreshing(false);
  };

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

      await handleNext(queueToUse as unknown as QueueData);
      setHasActiveTicket(true);
    } catch (error) {
      console.error('Error in onHandleNext:', error);
    }
  };

  const onFinish = async () => {
    try {
      await handleFinish();
      setHasActiveTicket(false);
      // Reset queue state after finishing
      dispatch(resetQueue());
    } catch (error) {
      console.error('Error in onFinish:', error);
    }
  };

  const onSkip = async () => {
    try {
      // First skip the current ticket
      await handleSkip();

      // If we have an active ticket, save it to skipped list
      if (persistedQueue?.ticketNo) {
        dispatch(setSkippedTicket({
          trans_id: persistedQueue.ticketNo,
          trans_date: new Date().toISOString(),
          customer_name: persistedQueue.customerName || '',
          time_start: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
          services: persistedQueue.services || [],
          customerType: persistedQueue.customerType || 'Regular',
        }));
      }

      setHasActiveTicket(false);
      dispatch(resetQueue());

      // Refresh the skipped list
      await refetchQueueSkippedData();
    } catch (error) {
      console.error('Error in onSkip:', error);
    }
  };


  const OnReturnSkippedTicket = async (ticket: TickitSkipped) => {
    try {
      await handleRecall(ticket.trans_id);

      if (hasActiveTicket && persistedQueue?.ticketNo) {
        await callQueueSkip({
          ticketNo: persistedQueue.ticketNo,
        }).unwrap();
      }

      // Directly fetch the ticket details with the specific ticket number
      const ticketDetailResult = await getQueueByID({
        ticketNo: ticket.trans_id
      }).unwrap();

      dispatch(setQueue({
        employeeId: emp.employee_id as number,
        counterNo: counterNo as unknown as number,
        ticketNo: ticket.trans_id,
        customerName: ticket.customer_name,
        services: ticketDetailResult?.services ?? [], // Fresh data guaranteed
        customerType: ticketDetailResult?.customerType ?? '',
      }));

      Toast.show({
        type: 'success',
        text1: 'Ticket Returned',
        text2: hasActiveTicket ?
          `Ticket ${ticket.trans_id} is now active and previous ticket was skipped.` :
          `Ticket ${ticket.trans_id} is now active.`,
        position: 'top',
        visibilityTime: 2000,
      });

      setHasActiveTicket(true);
      await handleRefresh();
      await queueDetailRefetch();
      await refetchQueueSkippedData();
      setLastUpdated(new Date());

    } catch (error) {
      console.error('Error in OnReturnSkippedTicket:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to return ticket. Please try again.',
        position: 'top',
      });
    }
  };

  const finishedCount =
    queueDetail?.filter(item => item.trans_status === 3).length ?? 0;
  const remainingCount =
    queueDetail?.filter(item => item.trans_status === 0).length ?? 0;
  const skippedCount =
    queueDetail?.filter(item => item.trans_status === 2).length ?? 0;

  const completedTransactions = queueDetail?.filter(item =>
    item.trans_status === 3 && item.trans_time !== null
  ) ?? [];

  // Convert time string (HH:MM:SS) to seconds
  const timeToSeconds = (timeStr: string | null): number => {
    if (!timeStr) return 0;
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    return (hours * 3600) + (minutes * 60) + seconds;
  };

  let bestTime = '---';
  let worstTime = '---';

  if (completedTransactions.length > 0) {
    let minSeconds = Number.MAX_SAFE_INTEGER;
    let maxSeconds = -1;

    completedTransactions.forEach(transaction => {
      if (transaction.trans_time) {
        const seconds = timeToSeconds(transaction.trans_time);
        if (seconds < minSeconds) {
          minSeconds = seconds;
          bestTime = transaction.trans_time;
        }
        if (seconds > maxSeconds) {
          maxSeconds = seconds;
          worstTime = transaction.trans_time;
        }
      }
    });
  }

  // Display queue prioritizes active ticket over available queue
  const displayQueue =
    hasActiveTicket && persistedQueue?.ticketNo ? persistedQueue : queue;


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
        <View className="overflow-hidden rounded-2xl bg-white shadow-lg">
          <CounterHeader
            config={config}
            counterNo={counterNo as unknown as number}
            roleName={roleName as string}
            currentTime={currentTime}
            lastUpdated={lastUpdated}
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
            onReturnTicket={OnReturnSkippedTicket}
          />

          <CounterSummary
            finishedCount={finishedCount}
            skippedCount={skippedCount}
            remainingCount={remainingCount}
            queue={queue}
            bestTime={bestTime}
            worstTime={worstTime}
          />
        </View>
      </ScrollView>
    </View>
  );
}
