import { Stack } from "expo-router";
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect } from "react";
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
          <Stack screenOptions={{ headerShown: false }} />
          <Toast />
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}