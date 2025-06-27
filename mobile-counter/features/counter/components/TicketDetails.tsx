import React, { memo } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Service } from '../types';


interface TicketDetailsProps {
  hasActiveTicket: boolean;
  services?: Service[];
  customerType?: string;
  isLoading?: boolean;
  onPress?: () => void;
  testID?: string;
}

interface DetailItemProps {
  label: string;
  value: string | string[] | undefined;
  isLoading?: boolean;
}

const DetailItem = memo<DetailItemProps>(({ label, value, isLoading }) => {
  const displayValue = Array.isArray(value) ? value.join(', ') : value || '---';

  return (
    <View className="items-center">
      <Text
        className="mb-1 text-sm text-gray-500 font-bold"
        accessibilityRole="text"
        accessibilityLabel={`${label} label`}
      >
        {label}
      </Text>
      {isLoading ? (
        <ActivityIndicator size="small" color="#1c3f83" />
      ) : (
        <Text
          style={{ color: '#1c3f83' }}
          className="text-center font-medium"
          accessibilityRole="text"
          accessibilityLabel={`${label} value: ${displayValue}`}
        >
          {displayValue}
        </Text>
      )}
    </View>
  );
});

DetailItem.displayName = 'DetailItem';

export const TicketDetails = memo<TicketDetailsProps>(({
  hasActiveTicket,
  services,
  customerType,
  isLoading = false,
  onPress,
  testID,
}) => {
  const serviceNames = hasActiveTicket ? services?.map((service: Service) => service.button_caption) : undefined;

  const containerClassName = `mb-4 rounded-xl border border-gray-300 bg-gray-50 p-4 ${onPress ? 'active:opacity-70' : ''}`;

  return (
    <View
      className="px-6 pb-6"
      testID={testID}
      accessibilityRole="summary"
      accessibilityLabel="Ticket details"
    >
      <View
        className={containerClassName}
        onTouchEnd={onPress}
        accessibilityRole={onPress ? 'button' : 'none'}
      >
        <View className="mb-4">
          <DetailItem
            label="Services"
            value={serviceNames}
            isLoading={isLoading}
          />
        </View>
        <DetailItem
          label="Customer Type"
          value={hasActiveTicket ? customerType : undefined}
          isLoading={isLoading}
        />
      </View>
    </View>
  );
});

TicketDetails.displayName = 'TicketDetails'; 