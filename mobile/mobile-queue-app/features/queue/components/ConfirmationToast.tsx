import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, Modal, Text, TouchableOpacity, View } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface ToastProps {
    visible: boolean;
    onClose?: () => void;
    message?: string;
    confirmText?: string;
    autoCloseDelay?: number;
    showCountdown?: boolean;
}

export default function ConfirmationToast({
    visible = false,
    onClose,
    message = '',
    confirmText = 'OK',
    autoCloseDelay = 0,
    showCountdown = false
}: ToastProps) {
    const [countdown, setCountdown] = useState(autoCloseDelay);
    const [scaleAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        if (visible) {
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 100,
                friction: 8,
                useNativeDriver: true,
            }).start();

            if (autoCloseDelay > 0) {
                setCountdown(autoCloseDelay);
                const timer = setInterval(() => {
                    setCountdown((prev) => {
                        if (prev <= 1) {
                            clearInterval(timer);
                            onClose?.();
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);

                return () => clearInterval(timer);
            }
        } else {
            scaleAnim.setValue(0);
        }
    }, [visible, autoCloseDelay, onClose, scaleAnim]);

    const handleClose = () => {
        Animated.timing(scaleAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            onClose?.();
        });
    };

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={handleClose}
        >
            <View className='flex-1 justify-center items-center bg-black/50'>
                <Animated.View
                    style={{
                        transform: [{ scale: scaleAnim }],
                        minWidth: screenWidth * 0.7,
                        maxWidth: screenWidth * 0.85,
                    }}
                    className='bg-white rounded-2xl p-8 items-center shadow-xl'
                >
                    <View className='w-20 h-20 bg-green-100 rounded-full justify-center items-center mb-6'>
                        <Text className='text-green-600 text-5xl font-bold'>✓</Text>
                    </View>

                    <Text className='text-2xl font-bold mb-3 text-center text-gray-800'>
                        Thank you!
                    </Text>

                    <Text className='text-lg mb-8 text-center text-gray-600 leading-relaxed'>
                        {message}
                    </Text>

                    <TouchableOpacity
                        onPress={handleClose}
                        className='bg-blue-500 px-10 py-3 rounded-xl active:bg-blue-600'
                        style={{ minWidth: 150 }}
                    >
                        <Text className='text-white font-bold text-lg text-center'>
                            {showCountdown && countdown > 0
                                ? `${confirmText} (${countdown}s)`
                                : confirmText
                            }
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
}