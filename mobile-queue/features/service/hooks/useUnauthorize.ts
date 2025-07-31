import {
  useLazyCheckDeviceQuery,
  useRegisteredDeviceMutation,
} from "@/features/device/api/deviceApi";
import { DeviceType } from "@/features/device/constants";
import * as Application from "expo-application";
import * as Device from "expo-device";
import { router } from "expo-router";
import { useState } from "react";
import Toast from "react-native-toast-message";

interface UseUnauthorize {
  isLoading: boolean;
  handleVerification: () => void;
  handleContactAdmin: () => void;
  handleTryAgain: () => Promise<void>;
}

export const useUnauthorize = (): UseUnauthorize => {
  const [registerDevice, { isLoading }] = useRegisteredDeviceMutation();
  const [checkDevice, { isLoading: isCheckingDevice }] =
    useLazyCheckDeviceQuery();

  const [isProcessing, setIsProcessing] = useState(false);

  const handleVerification = () => {
    router.push("/(service)/verification");
  };

  const handleContactAdmin = () => {
    // Implement contact admin logic here (e.g., open mail, show info, etc.)
    Toast.show({
      type: "info",
      text1: "Contact Administrator",
      text2: "Please reach out to your administrator for assistance.",
    });
  };

  const handleTryAgain = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const deviceId =
        Device.osName === "Android"
          ? Application.getAndroidId()
          : await Application.getIosIdForVendorAsync();

      if (!deviceId) {
        Toast.show({
          type: "error",
          text1: "Device ID not available",
          text2: "Unable to identify this device",
        });
        return;
      }

      const osType = Device.osName === "Android" ? 1 : 2;

      // 🚨 UNCOMMENT THIS - IT'S CRUCIAL! 🚨
      const { registered } = await checkDevice({
        id: deviceId,
        type: DeviceType.KIOSK,
      }).unwrap();

      console.log("registered", registered);

      if (registered) {
        // Device already registered, just navigate
        Toast.show({
          type: "success",
          text1: "Device already registered",
          text2: "Redirecting to service...",
        });
        router.replace("/(service)");
        return;
      }

      // Only register if NOT already registered
      await registerDevice({
        id: deviceId,
        os: osType,
        type: DeviceType.KIOSK,
        deviceName: Device.deviceName || "Unknown Device",
      }).unwrap();

      Toast.show({
        type: "success",
        text1: "Device registered.",
        text2: "Please contact your administrator to verify your device.",
      });

      router.replace("/(service)");
    } catch (error: any) {
      console.log("Device registration error:", error);

      // Add more specific error logging
      console.log("Error status:", error?.status);
      console.log("Error data:", error?.data);

      if (error?.status === 409) {
        router.replace("/(service)");
        return;
      }

      Toast.show({
        type: "error",
        text1: "Registration failed",
        text2:
          error?.data?.message || "Please try again or contact administrator",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isLoading: isLoading || isCheckingDevice,
    handleVerification,
    handleContactAdmin,
    handleTryAgain,
  };
};
