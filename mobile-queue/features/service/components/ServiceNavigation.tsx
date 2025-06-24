import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ServiceNavigationProps {
  showMore: boolean;
  additionalServicesCount: number;
  isLoadingMutation: boolean;
  onShowMore: () => void;
  onShowLess: () => void;
  cardWidth: number;
  isLandscape: boolean;
}

export const ServiceNavigation: React.FC<ServiceNavigationProps> = ({
  showMore,
  additionalServicesCount,
  isLoadingMutation,
  onShowMore,
  onShowLess,
  cardWidth,
  isLandscape,
}) => {
  if (showMore) {
    return (
      <View style={{ width: cardWidth, minWidth: isLandscape ? 180 : cardWidth }}>
        <TouchableOpacity
          className="h-32 m-1 rounded-full shadow-lg border border-gray-300 items-center justify-center bg-gray-100"
          onPress={onShowLess}
          disabled={isLoadingMutation}
        >
          <Text className="mt-2 font-medium text-center text-3xl text-gray-800">Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (additionalServicesCount > 0) {
    return (
      <View style={{ width: cardWidth }}>
        <TouchableOpacity
          className="h-32 m-1 rounded-full items-center shadow-lg border border-gray-300 justify-center bg-gray-100"
          onPress={onShowMore}
          disabled={isLoadingMutation}
        >
          <Text className="mt-2 text-3xl font-medium text-center text-gray-800">More</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
}; 