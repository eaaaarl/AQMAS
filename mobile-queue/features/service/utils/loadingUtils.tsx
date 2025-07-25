import { Image, SafeAreaView, View, useColorScheme } from 'react-native';

export const RenderLoading = () => {
    const colorScheme = useColorScheme();
    const splashIcon = colorScheme === 'dark'
        ? require('../../../assets/icons/splash-icon-dark.png')
        : require('../../../assets/icons/splash-icon-light.png');

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black justify-center items-center">
            <View className="animate-pulse">
                <Image
                    source={splashIcon}
                    style={{ width: 200, height: 200 }}
                    resizeMode="contain"
                />
            </View>
        </SafeAreaView>
    );
};