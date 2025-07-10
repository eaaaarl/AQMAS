import { QueueData } from '@/features/counter';
import { useCounter, useCounterActions } from '@/features/counter/hooks';
import { useGlobalError } from '@/features/error';
import { TickitSkipped } from '@/features/queue/api/interface';
import {
  useCallQueueSkipMutation,
  useGetQueueDetailEmpIdQuery,
  useGetQueueQueuedQuery,
  useGetQueueSkippedQuery,
  useLazyGetQueueByIDQuery,
} from '@/features/queue/api/queueApi';
import { useAppDispatch, useAppSelector } from '@/libs/redux/hooks';
import {
  resetQueue,
  setQueue,
  setSkippedTicket,
} from '@/libs/redux/state/queueSlice';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Toast from 'react-native-toast-message';

export interface UseCounterScreenResult {
  refreshing: boolean;
  hasActiveTicket: boolean;
  hasConnectionError: boolean;
  config: any;
  roleName: string;
  counterNo: number | string;
  queue: QueueData | null;
  emp: any;
  queueQueuedData: any;
  queueSkippedData: any;
  queueDetail: any;
  hasQueueData: boolean;
  displayQueue: QueueData | null;
  counters: {
    finishedCount: number;
    remainingCount: number;
    skippedCount: number;
  };
  timeStats: {
    bestTime: string;
    worstTime: string;
  };
  isCallingQueue: boolean;
  isFinishingQueue: boolean;
  isSkippingQueue: boolean;
  isRecallingQueue: boolean;
  onRefresh: () => Promise<void>;
  onHandleNext: () => Promise<void>;
  onFinish: () => Promise<void>;
  onSkip: () => Promise<void>;
  onReturnSkippedTicket: (ticket: TickitSkipped) => Promise<void>;
  handleRecall: () => Promise<void>;
}

export function useCounterScreen(): UseCounterScreenResult {
  const dispatch = useAppDispatch();
  const persistedQueue = useAppSelector(state => state.queue);
  const [refreshing, setRefreshing] = useState(false);
  const [hasActiveTicket, setHasActiveTicket] = useState(() => {
    return !!(persistedQueue?.ticketNo && persistedQueue.ticketNo !== '');
  });
  const { hasConnectionError } = useGlobalError();
  const {
    config,
    roleName,
    counterNo,
    queue,
    handleRefresh,
    queueRefetch,
    emp,
  } = useCounter();

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

  const hasQueueData = useMemo(
    () => !!queue || !!queueQueuedData,
    [queue, queueQueuedData]
  );

  const displayQueue = useMemo(
    () =>
      hasActiveTicket && persistedQueue?.ticketNo ? persistedQueue : queue,
    [hasActiveTicket, persistedQueue, queue]
  );

  // Ensure displayQueue is QueueData or null and ticketNo is a string
  const safeDisplayQueue =
    displayQueue && typeof (displayQueue as any).ticketNo === 'string'
      ? (displayQueue as QueueData)
      : null;

  const counters = useMemo(() => {
    const finishedCount =
      queueDetail?.filter(item => item.trans_status === 3).length ?? 0;
    const remainingCount =
      queueDetail?.filter(item => item.trans_status === 0).length ?? 0;
    const skippedCount =
      queueDetail?.filter(item => item.trans_status === 2).length ?? 0;
    return { finishedCount, remainingCount, skippedCount };
  }, [queueDetail]);

  const timeStats = useMemo(() => {
    const completedTransactions =
      queueDetail?.filter(
        item => item.trans_status === 3 && item.trans_time !== null
      ) ?? [];
    const timeToSeconds = (timeStr: string | null): number => {
      if (!timeStr) return 0;
      const [hours, minutes, seconds] = timeStr.split(':').map(Number);
      return hours * 3600 + minutes * 60 + seconds;
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
    return { bestTime, worstTime };
  }, [queueDetail]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await handleRefresh();
    await queueDetailRefetch();
    await refetchQueueSkippedData();
    setRefreshing(false);
  }, [handleRefresh, queueDetailRefetch, refetchQueueSkippedData]);

  const onHandleNext = useCallback(async () => {
    try {
      const [freshQueueResult, queuedDataResult] = await Promise.all([
        queueRefetch(),
        refetchQueuedData(),
      ]);
      const queueToUse =
        freshQueueResult.data || queue || queuedDataResult.data;
      await handleNext(queueToUse as unknown as QueueData);
      setHasActiveTicket(true);
    } catch (error) {
      console.error('Error in onHandleNext:', error);
    }
  }, [queueRefetch, refetchQueuedData, queue, handleNext]);

  const onFinish = useCallback(async () => {
    try {
      await handleFinish();
      setHasActiveTicket(false);
      dispatch(resetQueue());
    } catch (error) {
      console.error('Error in onFinish:', error);
    }
  }, [handleFinish, dispatch]);

  const onSkip = useCallback(async () => {
    try {
      await handleSkip();
      if (persistedQueue?.ticketNo) {
        dispatch(
          setSkippedTicket({
            trans_id: persistedQueue.ticketNo,
            trans_date: new Date().toISOString(),
            customer_name: persistedQueue.customerName || '',
            time_start: new Date().toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            }),
            services: persistedQueue.services || [],
            customerType: persistedQueue.customerType || 'Regular',
          })
        );
      }
      setHasActiveTicket(false);
      dispatch(resetQueue());
      await refetchQueueSkippedData();
    } catch (error) {
      console.error('Error in onSkip:', error);
    }
  }, [handleSkip, persistedQueue, dispatch, refetchQueueSkippedData]);

  const onReturnSkippedTicket = useCallback(
    async (ticket: TickitSkipped) => {
      try {
        await handleRecall(ticket.trans_id);
        if (hasActiveTicket && persistedQueue?.ticketNo) {
          await callQueueSkip({
            ticketNo: persistedQueue.ticketNo,
          }).unwrap();
        }
        const ticketDetailResult = await getQueueByID({
          ticketNo: ticket.trans_id,
        }).unwrap();
        dispatch(
          setQueue({
            employeeId: emp.employee_id as number,
            counterNo: counterNo as unknown as number,
            ticketNo: ticket.trans_id,
            customerName: ticket.customer_name,
            services: ticketDetailResult?.services ?? [],
            customerType: ticketDetailResult?.customerType ?? '',
          })
        );
        Toast.show({
          type: 'success',
          text1: 'Ticket Returned',
          text2: hasActiveTicket
            ? `Ticket ${ticket.trans_id} is now active and previous ticket was skipped.`
            : `Ticket ${ticket.trans_id} is now active.`,
          position: 'top',
          visibilityTime: 2000,
        });
        setHasActiveTicket(true);
        await handleRefresh();
        await queueDetailRefetch();
        await refetchQueueSkippedData();
      } catch (error) {
        console.error('Error in OnReturnSkippedTicket:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to return ticket. Please try again.',
          position: 'top',
        });
      }
    },
    [
      handleRecall,
      hasActiveTicket,
      persistedQueue?.ticketNo,
      callQueueSkip,
      getQueueByID,
      dispatch,
      emp.employee_id,
      counterNo,
      handleRefresh,
      queueDetailRefetch,
      refetchQueueSkippedData,
    ]
  );

  useEffect(() => {
    const hasTicket = !!(
      persistedQueue?.ticketNo && persistedQueue.ticketNo !== ''
    );
    if (hasTicket !== hasActiveTicket) {
      setHasActiveTicket(hasTicket);
    }
  }, [persistedQueue?.ticketNo, hasActiveTicket]);

  useEffect(() => {
    if (!persistedQueue?.ticketNo) {
      setHasActiveTicket(false);
      dispatch(resetQueue());
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  return {
    refreshing,
    hasActiveTicket,
    hasConnectionError,
    config,
    roleName: roleName ?? '',
    counterNo: counterNo ?? '',
    queue: queue ?? null,
    emp,
    queueQueuedData,
    queueSkippedData,
    queueDetail,
    hasQueueData,
    displayQueue: safeDisplayQueue,
    counters,
    timeStats,
    isCallingQueue,
    isFinishingQueue,
    isSkippingQueue,
    isRecallingQueue,
    onRefresh,
    onHandleNext,
    onFinish,
    handleRecall,
    onSkip,
    onReturnSkippedTicket,
  };
}
