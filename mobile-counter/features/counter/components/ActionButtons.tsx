import React, { memo } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

interface ActionButtonsProps {
  hasActiveTicket: boolean;
  isCallingQueue: boolean;
  isRecallingQueue: boolean;
  isFinishingQueue: boolean;
  isSkippingQueue: boolean;
  hasQueuedData: boolean;
  onNext: () => void;
  onRecall: () => void;
  onFinish: () => void;
  onSkip: () => void;
}

interface LoadingButtonProps {
  isLoading: boolean;
  text: string;
  loadingText: string;
}

const LoadingButtonComponent: React.FC<LoadingButtonProps> = ({
  isLoading,
  text,
  loadingText
}) => (
  isLoading ? (
    <View className="flex-row items-center justify-center">
      <ActivityIndicator size="small" color="white" className="mr-2" />
      <Text className="text-center font-medium text-white">
        {loadingText}
      </Text>
    </View>
  ) : (
    <Text className="text-center font-medium text-white">{text}</Text>
  )
);

LoadingButtonComponent.displayName = 'LoadingButton';
const LoadingButton = memo(LoadingButtonComponent);

const ActionButtonsComponent: React.FC<ActionButtonsProps> = ({
  hasActiveTicket,
  isCallingQueue,
  isRecallingQueue,
  isFinishingQueue,
  isSkippingQueue,
  hasQueuedData,
  onNext,
  onRecall,
  onFinish,
  onSkip,
}) => {
  // Next button is only disabled when:
  // 1. Currently calling next OR
  // 2. Has active ticket
  const isNextEnabled = !isCallingQueue && !hasActiveTicket;

  // Action buttons (Recall, Finish, Skip) are enabled ONLY when:
  // 1. Has active ticket AND
  // 2. Not currently performing their respective actions
  const isRecallEnabled = hasActiveTicket && !isRecallingQueue;
  const isFinishEnabled = hasActiveTicket && !isFinishingQueue;
  const isSkipEnabled = hasActiveTicket && !isSkippingQueue;

  return (
    <View className="px-6 pb-6">
      <View className="mb-3 flex-row gap-3">
        {/* Next button - enabled when no active ticket */}
        <TouchableOpacity
          onPress={onNext}
          style={{
            backgroundColor: isNextEnabled ? '#1c3f83' : '#ccc',
          }}
          disabled={!isNextEnabled}
          className="flex-1 rounded-xl py-3 active:opacity-80"
        >
          <LoadingButton
            isLoading={isCallingQueue}
            text={hasQueuedData ? '→ Next' : '→ Check Queue'}
            loadingText="Calling..."
          />
        </TouchableOpacity>
        {/* Recall button - only enabled with active ticket */}
        <TouchableOpacity
          onPress={onRecall}
          style={{
            backgroundColor: isRecallEnabled ? '#1c3f83' : '#ccc',
          }}
          disabled={!isRecallEnabled}
          className="flex-1 rounded-xl py-3 active:opacity-80"
        >
          <LoadingButton
            isLoading={isRecallingQueue}
            text="↻ Recall"
            loadingText="Recalling..."
          />
        </TouchableOpacity>
      </View>

      <View className="flex-row gap-3">
        {/* Finish button - only enabled with active ticket */}
        <TouchableOpacity
          onPress={onFinish}
          style={{
            backgroundColor: isFinishEnabled ? '#1c3f83' : '#ccc',
          }}
          disabled={!isFinishEnabled}
          className="flex-1 rounded-xl py-3 active:opacity-80"
        >
          <LoadingButton
            isLoading={isFinishingQueue}
            text="✓ Finished"
            loadingText="Finishing..."
          />
        </TouchableOpacity>
        {/* Skip button - only enabled with active ticket */}
        <TouchableOpacity
          onPress={onSkip}
          style={{
            backgroundColor: isSkipEnabled ? '#1c3f83' : '#ccc',
          }}
          disabled={!isSkipEnabled}
          className="flex-1 rounded-xl py-3 active:opacity-80"
        >
          <LoadingButton
            isLoading={isSkippingQueue}
            text="⏭ Skip"
            loadingText="Skipping..."
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

ActionButtonsComponent.displayName = 'ActionButtons';
export const ActionButtons = memo(ActionButtonsComponent); 