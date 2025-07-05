import {
  useLazyCheckDeviceQuery,
  useRegisteredDeviceMutation,
} from "@/features/device/api/deviceApi";
import { DeviceType } from "@/features/device/constants";
import { useAppDispatch, useAppSelector } from "@/libs/redux/hooks";
import { setConfig } from "@/libs/redux/state/configSlice";
import * as Application from "expo-application";
import * as Device from "expo-device";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";

const validateIpAddress = (ip: string): boolean => {
  if (!ip.trim()) return false;

  const ipRegex =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(ip.trim());
};

const validatePort = (port: string): boolean => {
  if (!port.trim()) return false;

  const portNum = parseInt(port.trim(), 10);
  return !isNaN(portNum) && portNum >= 1 && portNum <= 65535;
};

export const useDeveloperSetting = () => {
  const dispatch = useAppDispatch();
  const currentConfig = useAppSelector((state) => state.config);
  const [ipAddress, setIpAddress] = useState("");
  const [port, setPort] = useState("");
  const [isCheckingDevice, setIsCheckingDevice] = useState(false);

  const [checkDevice] = useLazyCheckDeviceQuery();
  const [registerDevice] = useRegisteredDeviceMutation();

  useEffect(() => {
    if (currentConfig.ipAddress) {
      setIpAddress(currentConfig.ipAddress);
    }
    if (currentConfig.port) {
      setPort(currentConfig.port);
    }
  }, [currentConfig]);

  const checkDeviceRegistration = async () => {
    setIsCheckingDevice(true);
    try {
      const androidId = Application.getAndroidId();
      const deviceType = Device.osName === "Android" ? 1 : 2;

      const checkResponse = await checkDevice({
        type: deviceType,
        id: androidId,
      }).unwrap();

      if (!checkResponse.registered) {
        router.push("/(service)/not-registered");
      } else {
        router.push("/(service)");
      }
    } catch (error) {
      console.error("Device check failed:", error);
      Toast.show({
        type: "error",
        text1: "Connection Error",
        text2: "Failed to check device registration",
      });
    } finally {
      setIsCheckingDevice(false);
    }
  };

  const registerDeviceSilently = async () => {
    try {
      const androidId = Application.getAndroidId();
      const deviceType = Device.osName === "Android" ? 1 : 2;

      const deviceInfo = {
        id: androidId,
        os: deviceType,
        type: DeviceType.KIOSK,
      };

      const res = await registerDevice(deviceInfo).unwrap();
      console.log("Device registered silently", res);
      return true;
    } catch (error) {
      console.error("Silent device registration failed:", error);
      return false;
    }
  };

  const handleSave = async () => {
    try {
      if (!validateIpAddress(ipAddress)) {
        Toast.show({
          type: "error",
          text1: "Invalid IP Address",
          text2: "Please enter a valid IP address (e.g., 192.168.1.1)",
        });
        return;
      }
      if (!validatePort(port)) {
        Toast.show({
          type: "error",
          text1: "Invalid Port",
          text2: "Please enter a valid port number (1-65535)",
        });
        return;
      }

      // Save config first
      dispatch(setConfig({ ipAddress, port }));

      Toast.show({
        type: "success",
        text1: "Settings Saved",
        text2: "The new configuration has been applied.",
      });

      // await checkDeviceRegistration();
    } catch (error) {
      console.error("Error saving settings:", error);
      Toast.show({
        type: "error",
        text1: "Error Saving Settings",
        text2: "Please check your input and try again.",
      });
    }
  };

  return {
    currentConfig,
    ipAddress,
    port,
    handleSave,
    setIpAddress,
    setPort,
    isCheckingDevice,
    registerDeviceSilently,
    checkDevice,
  };
};
