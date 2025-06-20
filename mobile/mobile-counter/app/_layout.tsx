import { Stack } from "expo-router";
import Toast from 'react-native-toast-message';
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import '../global.css';
import { store as reduxStore } from "../libs/redux/store";
const persistor = persistStore(reduxStore);
export default function RootLayout() {
  return (
    <Provider store={reduxStore}>
      <PersistGate loading={null} persistor={persistor}>
        <>
          <Stack screenOptions={{ headerShown: false }} />
          <Toast />
        </>
      </PersistGate>
    </Provider>
  );
}
