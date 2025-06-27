import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Provider as ReduxProvider } from "react-redux";
import store from '@/lib/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import persistStore from 'redux-persist/es/persistStore';

const persistor = persistStore(store);

export default function Provider({ children }: { children: React.ReactNode }) {
    return (
        <BrowserRouter>
            <ReduxProvider store={store}>
                <PersistGate persistor={persistor} loading={null}>
                    {children}
                </PersistGate>
            </ReduxProvider>
        </BrowserRouter>
    )
}
