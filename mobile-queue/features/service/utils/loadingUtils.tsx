import { Dimensions, SafeAreaView, View } from 'react-native';

export const RenderLoading = () => {
    const { width, height } = Dimensions.get('window');
    const isLandscape = width > height;
    const cardWidth = isLandscape ? (width - 60) / 3 : (width - 40) / 2;

    const SkeletonBox = () => (
        <View
            style={{ width: cardWidth }}
            className="h-32 m-1 rounded-full items-center justify-center shadow-lg border border-gray-300"
        >
            {/* <View className="w-20 h-8 bg-gray-300 rounded-md animate-pulse" /> */}
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-white justify-center items-center">
            <View className="flex-row flex-wrap justify-center px-4">
                <SkeletonBox />
                <SkeletonBox />
                <SkeletonBox />
                <SkeletonBox />
                <SkeletonBox />
                <SkeletonBox />
            </View>
        </SafeAreaView>
    );
};