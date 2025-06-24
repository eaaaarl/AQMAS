import React from 'react';
import { View } from 'react-native';
import { Service } from '../api/interface';
import { ServiceItem } from './ServiceItem';

interface ServiceGridProps {
  services: Service[];
  selectedTransactions: Service[];
  isLoadingMutation: boolean;
  onServicePress: (service: Service) => void;
  cardWidth: number;
  isLandscape: boolean;
}

export const ServiceGrid: React.FC<ServiceGridProps> = ({
  services,
  selectedTransactions,
  isLoadingMutation,
  onServicePress,
  cardWidth,
  isLandscape,
}) => {
  return (
    <View className='gap-4' style={{
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      maxWidth: isLandscape ? '90%' : '100%',
    }}>
      {services.map((service) => (
        <View key={service.service_id} style={{ width: cardWidth, minWidth: isLandscape ? 180 : cardWidth }}>
          <ServiceItem
            isLoading={isLoadingMutation}
            service={service}
            cardWidth={cardWidth}
            isSelected={selectedTransactions.some(item => item.service_id === service.service_id)}
            onPress={() => onServicePress(service)}
          />
        </View>
      ))}
    </View>
  );
}; 