import * as KeepAwake from 'expo-keep-awake';
import { Stack } from "expo-router";
import * as ScreenOrientation from 'expo-screen-orientation';
import React, { useEffect } from "react";
import { AppState } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import '../global.css';
import { store as reduxStore } from "../libs/redux/store";

const persistor = persistStore(reduxStore);

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


  useEffect(() => {
    async function setOrientation() {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.ALL
      );
    }
    setOrientation();

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={reduxStore}>
        <PersistGate loading={null} persistor={persistor}>
          <>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(service)" options={{ headerShown: false }} />
              <Stack.Screen name="(survey)" options={{ headerShown: false }} />
              <Stack.Screen name="(developer)" options={{ headerShown: false }} />
            </Stack>
            <Toast />
          </>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}