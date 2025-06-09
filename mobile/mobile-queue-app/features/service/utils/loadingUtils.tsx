import { ActivityIndicator, SafeAreaView, Text } from 'react-native';

export const renderLoading = () => (
    <SafeAreaView className="flex-1 bg-white p-4 justify-center items-center">
        <ActivityIndicator size="large" color="#0000FF" />
    </SafeAreaView>
);

export const renderNoServices = () => (
    <SafeAreaView className="flex-1 bg-white p-4 justify-center items-center">
        <Text className="text-lg text-gray-500">No services available</Text>
    </SafeAreaView>
);