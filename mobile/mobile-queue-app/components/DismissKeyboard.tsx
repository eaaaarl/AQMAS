import React, { ReactNode } from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

interface DismissKeyboardProps {
    children: ReactNode,

}

export default function DismissKeyboard({ children }: DismissKeyboardProps) {
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };
    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            {children}
        </TouchableWithoutFeedback>
    )
}