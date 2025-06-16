import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, Modal, Text, TouchableOpacity, View } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface TicketModalProps {
    visible?: boolean;
    onClose: () => void;
    ticket?: string;
    confirmText?: string;
    customerName?: string;
    autoCloseDelay?: number; // Auto-close after X seconds
    showCountdown?: boolean;
}

export default function TicketModal({
    onClose,
    visible = false,
    ticket,
    confirmText = 'OK',
    customerName,
    autoCloseDelay = 0, // 0 means no auto-close
    showCountdown = false
}: TicketModalProps) {
    const [countdown, setCountdown] = useState(autoCloseDelay);
    const [scaleAnim] = useState(new Animated.Value(0));
    const [pulseAnim] = useState(new Animated.Value(1));

    useEffect(() => {
        if (visible) {
            // Entry animation
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 100,
                friction: 8,
                useNativeDriver: true,
            }).start();

            // Pulse animation for ticket number
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.05,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();

            // Auto-close countdown
            if (autoCloseDelay > 0) {
                setCountdown(autoCloseDelay);
                const timer = setInterval(() => {
                    setCountdown((prev) => {
                        if (prev <= 1) {
                            clearInterval(timer);
                            onClose();
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);

                return () => clearInterval(timer);
            }
        } else {
            scaleAnim.setValue(0);
            pulseAnim.setValue(1);
        }
    }, [visible, autoCloseDelay, onClose, scaleAnim, pulseAnim]);

    const handleClose = () => {
        Animated.timing(scaleAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            onClose();
        });
    };

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={handleClose}
            statusBarTranslucent
        >
            <View className='flex-1 justify-center items-center bg-black/70'>
                <Animated.View
                    style={{
                        transform: [{ scale: scaleAnim }],
                        minWidth: screenWidth * 0.6,
                        maxWidth: screenWidth * 0.8,
                        minHeight: screenHeight * 0.4,
                    }}
                    className='bg-white rounded-3xl p-12 items-center shadow-2xl'
                >
                    <View className='mb-8 items-center'>
                        <Text className='text-center text-gray-600 font-semibold text-2xl mb-2'>
                            Your Ticket Number
                        </Text>
                        <View className='w-24 h-1 bg-blue-500 rounded-full' />
                    </View>

                    <Animated.View
                        style={{
                            transform: [{ scale: pulseAnim }],
                            minWidth: 200,
                            minHeight: 150,
                        }}
                        className='flex mb-8 p-8 rounded-2xl items-center justify-center bg-blue-50 border-4 border-blue-500'
                    >
                        <Text
                            className='text-center font-black text-blue-500'
                            style={{
                                fontSize: Math.min(screenWidth * 0.2, 120),
                            }}
                        >
                            {ticket || 'N/A'}
                        </Text>
                    </Animated.View>

                    {customerName && (
                        <View className='mb-8 items-center'>
                            <Text className='text-center text-gray-500 font-medium text-lg mb-2'>
                                Customer Name
                            </Text>
                            <Text
                                className='text-center text-gray-800 font-bold'
                                style={{ fontSize: Math.min(screenWidth * 0.06, 32) }}
                            >
                                {customerName}
                            </Text>
                        </View>
                    )}

                    <TouchableOpacity
                        onPress={handleClose}
                        className='bg-blue-500 px-12 py-4 rounded-2xl shadow-lg active:bg-blue-600'
                        style={{ minWidth: 200 }}
                    >
                        <View className='items-center'>
                            <Text className='text-white font-bold text-xl'>
                                {showCountdown && countdown > 0
                                    ? `${confirmText} (${countdown}s)`
                                    : confirmText
                                }
                            </Text>
                        </View>
                    </TouchableOpacity>

                </Animated.View>
            </View>
        </Modal>
    );
}