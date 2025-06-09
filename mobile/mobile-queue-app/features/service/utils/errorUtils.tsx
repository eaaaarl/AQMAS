import { SafeAreaView, Text } from 'react-native';

export const renderError = (message = 'Error loading services') => (
    <SafeAreaView className="flex-1 bg-white p-4 justify-center items-center">
        <Text className="text-lg text-red-500">{message}</Text>
    </SafeAreaView>
);