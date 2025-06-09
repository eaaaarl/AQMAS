import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';

const TAP_COUNT_THRESHOLD = 5;
const TAP_TIMEOUT = 3000;

const TapDetector: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tapCount, setTapCount] = useState(0);
    const [lastTapTime, setLastTapTime] = useState(0);

    useEffect(() => {
        if (tapCount === 0) return;

        const timer = setTimeout(() => {
            setTapCount(0);
        }, TAP_TIMEOUT);

        return () => clearTimeout(timer);
    }, [tapCount]);

    const handleTap = () => {
        const now = Date.now();

        if (now - lastTapTime > TAP_TIMEOUT) {
            setTapCount(1);
        } else {
            const newCount = tapCount + 1;
            setTapCount(newCount);

            if (newCount >= TAP_COUNT_THRESHOLD) {
                setTapCount(0);
                router.push('/(developer)/setting');
            }
        }

        setLastTapTime(now);
    };

    return (
        <TouchableWithoutFeedback onPress={handleTap}>
            <View style={{ flex: 1 }}>
                {children}
            </View>
        </TouchableWithoutFeedback>
    );
};

export default TapDetector;