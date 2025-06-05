import { Stack } from "expo-router";
import { Provider } from "react-redux";
import '../global.css';
import { store as reduxStore } from "../libs/redux/store";

export default function RootLayout() {
  return <Provider store={reduxStore}>
    <Stack screenOptions={{ headerShown: false }} />
  </Provider>;
}
