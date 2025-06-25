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

  const handleNext = async (queue: QueueData) => {
    try {
      if (hasActiveTicket && persistedQueue.ticketNo) {
        Toast.show({
          type: 'info',
          text1: 'Active Ticket Found',
          text2:
            'Please finish or skip the current ticket before calling next.',
        });
        return;
      }

      // If no queue data available, show error toast and return
      if (!queue) {
        Toast.show({
          type: 'error',
          text1: 'No Queue Available',
          text2: 'Please wait for a queue to be available before proceeding.',
          position: 'top',
          visibilityTime: 2000,
        });
        return;
      }

      const res = await callQueue({
        employeeId,
        counterNo,
        ticketNo: queue.ticketNo,
      }).unwrap();

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
        type: 'success',
        text1: 'Queue Called Successfully',
        text2: res.message || `Ticket ${queue.ticketNo} has been called.`,
      });

      await refreshAll();
    } catch (error: any) {
      handleError('Failed to Call Queue', error);
    }
  };

  const handleFinish = async () => {
    if (!hasActiveTicket || !persistedQueue.ticketNo) {
      Toast.show({
        type: 'info',
        text1: 'No Active Ticket',
        text2: 'Please call a queue before finishing.',
      });
      return;
    }

    try {
      await callQueueFinish({
        ticketNo: persistedQueue.ticketNo,
      }).unwrap();

      dispatch(queueSlice.actions.resetQueue());
      await refreshAll();

      Toast.show({
        type: 'success',
        text1: 'Ticket Finished',
        text2: 'Ticket has been completed successfully.',
      });
    } catch (error: any) {
      handleError('Failed to Finish Ticket', error);
    }
  };

  const handleSkip = async () => {
    if (!hasActiveTicket || !persistedQueue.ticketNo) {
      Toast.show({
        type: 'info',
        text1: 'No Active Ticket',
        text2: 'Please call a queue before skipping.',
      });
      return;
    }

    try {
      await callQueueSkip({
        ticketNo: persistedQueue.ticketNo,
      }).unwrap();

      dispatch(
        setSkippedTicket({
          trans_id: persistedQueue.ticketNo,
          trans_date: new Date().toISOString(),
          customer_name: persistedQueue.customerName,
          time_start: new Date().toLocaleTimeString('en-US', {
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
        type: 'info',
        text1: 'Ticket Skipped',
        text2:
          'The current ticket has been skipped and is available for recall.',
      });
    } catch (error: any) {
      handleError('Skip Failed', error);
    }
  };

  const handleRecall = async (ticketNo?: string) => {
    try {
      await callQueueRecall({
        ticketNo: ticketNo || persistedQueue.ticketNo,
      }).unwrap();

      Toast.show({
        type: 'success',
        text1: 'Queue Recalled Successfully',
        text2: `Ticket ${persistedQueue.ticketNo} has been recalled.`,
      });

      await refreshAll();
    } catch (error: any) {
      handleError('Failed to Recall', error);
    }
  };

  const refreshAll = async () => {
    await Promise.all([
      handleRefresh(),
      refetchQueuedData(),
      queueDetailRefetch(),
      refetchQueueSkippedData(),
    ]);
  };

  const handleError = (title: string, error: any) => {
    console.error(`${title}:`, error);
    Toast.show({
      type: 'error',
      text1: title,
      text2: error?.data?.message || error?.message || 'Something went wrong',
    });
  };

  return {
    handleNext,
    handleFinish,
    handleSkip,
    handleRecall,
    isCallingQueue,
    isFinishingQueue,
    isSkippingQueue,
    isRecallingQueue,
  };
};
