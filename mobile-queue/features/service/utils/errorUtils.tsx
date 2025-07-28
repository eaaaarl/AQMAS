import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

export const RenderError = ({
    message = 'Something went wrong',
    description = 'We encountered an error while loading the content. Please try again.',
    onRetry = null,
    showIcon = true,
    type = 'error'
}) => {
    const getIconColor = () => {
        switch (type) {
            case 'warning': return '#f59e0b';
            case 'info': return '#3b82f6';
            default: return '#ef4444';
        }
    };

    const getTextColor = () => {
        switch (type) {
            case 'warning': return 'text-amber-600';
            case 'info': return 'text-blue-600';
            default: return 'text-red-600';
        }
    };

    const getBorderColor = () => {
        switch (type) {
            case 'warning': return 'border-amber-200';
            case 'info': return 'border-blue-200';
            default: return 'border-red-200';
        }
    };

    const getBackgroundColor = () => {
        switch (type) {
            case 'warning': return 'bg-amber-50';
            case 'info': return 'bg-blue-50';
            default: return 'bg-red-50';
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50 p-4 justify-center items-center">
            <View className={`max-w-sm w-full p-6 rounded-xl border-2 ${getBorderColor()} ${getBackgroundColor()} shadow-sm`}>
                {showIcon && (
                    <View className="items-center mb-4">
                        <View className={`w-16 h-16 rounded-full bg-white items-center justify-center shadow-sm`}>
                            <Ionicons name="alert-circle-outline" size={32} color={getIconColor()} />
                        </View>
                    </View>
                )}

                <View className="items-center mb-6">
                    <Text className={`text-xl font-bold ${getTextColor()} text-center mb-2`}>
                        {message}
                    </Text>
                    <Text className="text-gray-600 text-center text-base leading-relaxed">
                        {description}
                    </Text>
                </View>

                {onRetry && (
                    <TouchableOpacity
                        onPress={onRetry}
                        className="bg-white border-2 border-gray-200 rounded-lg px-6 py-3 flex-row items-center justify-center shadow-sm active:bg-gray-50"
                    >
                        <MaterialIcons name="refresh" size={18} color="#6b7280" />
                        <Text className="text-gray-700 font-semibold ml-2">Try Again</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
};
