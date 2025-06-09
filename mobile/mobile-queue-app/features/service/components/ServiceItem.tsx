import { Service } from '@/features/service/api/interface';
import { Text, TouchableOpacity } from 'react-native';

type ServiceItemProps = {
    service: Service;
    isSelected: boolean;
    onPress: () => void;
    cardWidth: number;
};

export const ServiceItem = ({ service, isSelected, onPress, cardWidth }: ServiceItemProps) => (
    <TouchableOpacity
        style={{ width: cardWidth }}
        className={`h-32 m-1 rounded-full items-center justify-center shadow-lg border border-gray-300
      ${isSelected ? 'bg-blue-500' : 'bg-gray-100'}`}
        onPress={onPress}
    >
        <Text className={`mt-2 font-medium text-3xl text-center ${isSelected ? 'text-white' : 'text-gray-800'}`}>
            {service.button_caption}
        </Text>
    </TouchableOpacity>
);