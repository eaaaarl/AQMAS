import { Text, TouchableOpacity, View } from 'react-native';

type PaginationControlsProps = {
    currentPage: number;
    totalPages: number;
    onPrev: () => void;
    onNext: () => void;
};

export const PaginationControls = ({ currentPage, totalPages, onPrev, onNext }: PaginationControlsProps) => (
    <View className="flex-row justify-center items-center my-4 space-x-2 gap-4">
        <TouchableOpacity
            className="px-6 py-3 rounded-lg bg-blue-100"
            onPress={onPrev}
            disabled={currentPage === 0}
        >
            <Text className={`text-xl font-bold ${currentPage === 0 ? 'text-gray-400' : 'text-blue-800'}`}>◀ Prev</Text>
        </TouchableOpacity>

        <View className="px-4 py-2 bg-blue-500 rounded-full">
            <Text className="text-xl font-bold text-white">
                {currentPage + 1} / {totalPages}
            </Text>
        </View>

        <TouchableOpacity
            className="px-6 py-3 rounded-lg bg-blue-100"
            onPress={onNext}
            disabled={currentPage === totalPages - 1}
        >
            <Text className={`text-xl font-bold ${currentPage === totalPages - 1 ? 'text-gray-400' : 'text-blue-800'}`}>Next ▶</Text>
        </TouchableOpacity>
    </View>
);