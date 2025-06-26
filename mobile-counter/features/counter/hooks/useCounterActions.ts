import {
  useCallQueueFinishMutation,
  useCallQueueMutation,
  useCallQueueRecallMutation,
  useCallQueueSkipMutation,
} from '@/features/queue/api/queueApi';
import { useAppDispatch } from '@/libs/redux/hooks';
import {
  queueSlice,
  setQueue,
  setSkippedTicket,
} from '@/libs/redux/state/queueSlice';
import { useCallback, useMemo } from 'react';
import Toast from 'react-native-toast-message';
import { QueueData } from '../types';

interface UseCounterActionsProps {
  employeeId: number;
  counterNo: number;
  hasActiveTicket: boolean;
  persistedQueue: QueueData;
  handleRefresh: () => Promise<any>;
  refetchQueuedData: () => Promise<any>;
  queueDetailRefetch: () => Promise<any>;
  refetchQueueSkippedData: () => Promise<any>;
}

// Toast configurations to avoid repetition
const TOAST_CONFIG = {
  SUCCESS: {
    type: 'success' as const,
    position: 'top' as const,
    visibilityTime: 3000,
  },
  ERROR: {
    type: 'error' as const,
    position: 'top' as const,
    visibilityTime: 4000,
  },
  INFO: {
    type: 'info' as const,
    position: 'top' as const,
    visibilityTime: 3000,
  },
} as const;

// Error messages
const ERROR_MESSAGES = {
  NO_QUEUE: 'Please wait for a queue to be available before proceeding.',
  NO_ACTIVE_TICKET: 'Please call a queue before performing this action.',
  ACTIVE_TICKET_EXISTS:
    'Please finish or skip the current ticket before calling next.',
  GENERIC_ERROR: 'Something went wrong',
} as const;

export const useCounterActions = ({
  employeeId,
  counterNo,
  hasActiveTicket,
  persistedQueue,
  handleRefresh,
  refetchQueuedData,
  queueDetailRefetch,
  refetchQueueSkippedData,
}: UseCounterActionsProps) => {
  const dispatch = useAppDispatch();

  const [callQueue, { isLoading: isCallingQueue }] = useCallQueueMutation();
  const [callQueueFinish, { isLoading: isFinishingQueue }] =
    useCallQueueFinishMutation();
  const [callQueueRecall, { isLoading: isRecallingQueue }] =
    useCallQueueRecallMutation();
  const [callQueueSkip, { isLoading: isSkippingQueue }] =
    useCallQueueSkipMutation();

  // Memoize refresh function to prevent unnecessary re-renders
  const refreshAll = useCallback(async () => {
    try {
      await Promise.all([
        handleRefresh(),
        refetchQueuedData(),
        queueDetailRefetch(),
        refetchQueueSkippedData(),
      ]);
    } catch (error) {
      console.error('Failed to refresh data:', error);
      // Consider whether to show toast for refresh errors
    }
  }, [
    handleRefresh,
    refetchQueuedData,
    queueDetailRefetch,
    refetchQueueSkippedData,
  ]);

  // Centralized error handler
  const handleError = useCallback((title: string, error: any) => {
    console.error(`${title}:`, error);
    Toast.show({
      ...TOAST_CONFIG.ERROR,
      text1: title,
      text2:
        error?.data?.message || error?.message || ERROR_MESSAGES.GENERIC_ERROR,
    });
  }, []);

  // Validation helpers
  const validateActiveTicket = useCallback(
    (actionName: string): boolean => {
      if (!hasActiveTicket || !persistedQueue?.ticketNo) {
        Toast.show({
          ...TOAST_CONFIG.INFO,
          text1: 'No Active Ticket',
          text2: ERROR_MESSAGES.NO_ACTIVE_TICKET,
        });
        return false;
      }
      return true;
    },
    [hasActiveTicket, persistedQueue?.ticketNo]
  );

  const handleNext = useCallback(
    async (queue: QueueData) => {
      try {
        // Early validation
        if (hasActiveTicket && persistedQueue?.ticketNo) {
          Toast.show({
            ...TOAST_CONFIG.INFO,
            text1: 'Active Ticket Found',
            text2: ERROR_MESSAGES.ACTIVE_TICKET_EXISTS,
          });
          return;
        }

        if (!queue?.ticketNo) {
          Toast.show({
            ...TOAST_CONFIG.ERROR,
            text1: 'No Queue Available',
            text2: ERROR_MESSAGES.NO_QUEUE,
          });
          return;
        }

        const response = await callQueue({
          employeeId,
          counterNo,
          ticketNo: queue.ticketNo,
        }).unwrap();

        // Update Redux state
        dispatch(
          setQueue({
            employeeId,
            counterNo,
            ticketNo: queue.ticketNo,
            customerName: queue.customerName,
            services: queue.services,
            customerType: queue.customerType,
          })
        );

        Toast.show({
          ...TOAST_CONFIG.SUCCESS,
          text1: 'Queue Called Successfully',
          text2:
            response.message || `Ticket ${queue.ticketNo} has been called.`,
        });

        await refreshAll();
      } catch (error: any) {
        handleError('Failed to Call Queue', error);
      }
    },
    [
      hasActiveTicket,
      persistedQueue?.ticketNo,
      callQueue,
      employeeId,
      counterNo,
      dispatch,
      refreshAll,
      handleError,
    ]
  );

  const handleFinish = useCallback(async () => {
    if (!validateActiveTicket('finish')) return;

    try {
      await callQueueFinish({
        ticketNo: persistedQueue.ticketNo,
      }).unwrap();

      dispatch(queueSlice.actions.resetQueue());
      await refreshAll();

      Toast.show({
        ...TOAST_CONFIG.SUCCESS,
        text1: 'Ticket Finished',
        text2: 'Ticket has been completed successfully.',
      });
    } catch (error: any) {
      handleError('Failed to Finish Ticket', error);
    }
  }, [
    validateActiveTicket,
    callQueueFinish,
    persistedQueue.ticketNo,
    dispatch,
    refreshAll,
    handleError,
  ]);

  const handleSkip = useCallback(async () => {
    if (!validateActiveTicket('skip')) return;

    try {
      await callQueueSkip({
        ticketNo: persistedQueue.ticketNo,
      }).unwrap();

      // Create skipped ticket data
      const currentTime = new Date();
      dispatch(
        setSkippedTicket({
          trans_id: persistedQueue.ticketNo,
          trans_date: currentTime.toISOString(),
          customer_name: persistedQueue.customerName,
          time_start: currentTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }),
          services: persistedQueue.services,
          customerType: persistedQueue.customerType,
        })
      );

      dispatch(queueSlice.actions.resetQueue());
      await refreshAll();

      Toast.show({
        ...TOAST_CONFIG.INFO,
        text1: 'Ticket Skipped',
        text2:
          'The current ticket has been skipped and is available for recall.',
      });
    } catch (error: any) {
      handleError('Skip Failed', error);
    }
  }, [
    validateActiveTicket,
    callQueueSkip,
    persistedQueue.ticketNo,
    persistedQueue.customerName,
    persistedQueue.services,
    persistedQueue.customerType,
    dispatch,
    refreshAll,
    handleError,
  ]);

  const handleRecall = useCallback(
    async (ticketNo?: string) => {
      const targetTicketNo = ticketNo || persistedQueue?.ticketNo;

      if (!targetTicketNo) {
        Toast.show({
          ...TOAST_CONFIG.ERROR,
          text1: 'Invalid Ticket',
          text2: 'No ticket number provided for recall.',
        });
        return;
      }

      try {
        await callQueueRecall({
          ticketNo: targetTicketNo,
        }).unwrap();

        Toast.show({
          ...TOAST_CONFIG.SUCCESS,
          text1: 'Queue Recalled Successfully',
          text2: `Ticket ${targetTicketNo} has been recalled.`,
        });

        await refreshAll();
      } catch (error: any) {
        handleError('Failed to Recall', error);
      }
    },
    [persistedQueue?.ticketNo, callQueueRecall, refreshAll, handleError]
  );

  // Memoize loading states to prevent unnecessary re-renders
  const loadingStates = useMemo(
    () => ({
      isCallingQueue,
      isFinishingQueue,
      isSkippingQueue,
      isRecallingQueue,
      isAnyLoading:
        isCallingQueue ||
        isFinishingQueue ||
        isSkippingQueue ||
        isRecallingQueue,
    }),
    [isCallingQueue, isFinishingQueue, isSkippingQueue, isRecallingQueue]
  );

  // Memoize return object to prevent unnecessary re-renders
  return useMemo(
    () => ({
      handleNext,
      handleFinish,
      handleSkip,
      handleRecall,
      ...loadingStates,
    }),
    [handleNext, handleFinish, handleSkip, handleRecall, loadingStates]
  );
};
