import { GlobalErrorOverlay, useGlobalError } from '@/features/error';
import { Stack } from 'expo-router';
import React from 'react';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import '../global.css';
import { store as reduxStore } from '../libs/redux/store';

const persistor = persistStore(reduxStore);

function AppContent() {
  const { hasConnectionError, isRetrying, handleRetry, handleDismiss } =
    useGlobalError();

  return (
    <React.Fragment>
      <Stack screenOptions={{ headerShown: false }} />
      <Toast position="top" />
      <GlobalErrorOverlay
        isVisible={hasConnectionError}
        onRetry={handleRetry}
        onDismiss={handleDismiss}
      />
    </React.Fragment>
  );
}

export default function RootLayout() {
  return (
    <Provider store={reduxStore}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
}
