import { GlobalErrorOverlay, useGlobalError } from '@/features/error';
import * as KeepAwake from 'expo-keep-awake';
import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { AppState } from 'react-native';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import '../global.css';
import { store as reduxStore } from '../libs/redux/store';


const persistor = persistStore(reduxStore);

function AppContent() {
  const { hasConnectionError, handleRetry, handleDismiss } =
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

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        // App has come to the foreground
        KeepAwake.activateKeepAwakeAsync();
      } else {
        // App has gone to the background or inactive
        KeepAwake.deactivateKeepAwake();
      }
    });

    // Initial activation when component mounts and app is active
    if (AppState.currentState === 'active') {
      KeepAwake.activateKeepAwakeAsync();
    }

    return () => {
      // Cleanup subscription and ensure keep awake is deactivated
      subscription.remove();
      KeepAwake.deactivateKeepAwake();
    };
  }, []);

  return (
    <Provider store={reduxStore}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
}
