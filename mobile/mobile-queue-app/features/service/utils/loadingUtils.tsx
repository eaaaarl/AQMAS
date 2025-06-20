import { ActivityIndicator, SafeAreaView, Text } from 'react-native';

export const RenderLoading = () => (
    <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#0000FF" />
        <Text className="mt-4 text-gray-600">Loading services...</Text>
    </SafeAreaView>
);


