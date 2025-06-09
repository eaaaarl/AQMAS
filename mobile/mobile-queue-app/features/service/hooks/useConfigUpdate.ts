import { useAppDispatch, useAppSelector } from "@/libs/redux/hooks";
import { setConfig } from "@/libs/redux/state/configSlice";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { serviceApi } from "../api/serviceApi";

export const useConfigUpdate = () => {
  const [ipAddress, setIpAddress] = useState("");
  const [port, setPort] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const dispatch = useAppDispatch();
  const currentConfig = useAppSelector((state) => state.config);

  useEffect(() => {
    if (currentConfig?.ipAddress) {
      setIpAddress(currentConfig.ipAddress);
    }
    if (currentConfig?.port) {
      setPort(currentConfig.port);
    }
  }, [currentConfig]);

  const handleSubmit = async () => {
    if (!ipAddress.trim() || !port.trim()) {
      Alert.alert("Error", "Please enter both IP address and port");
      return;
    }

    setIsUpdating(true);

    try {
      dispatch(
        setConfig({
          ipAddress: ipAddress.trim(),
          port: port.trim(),
        })
      );

      dispatch(serviceApi.util.resetApiState());

      // Alternative: Invalidate specific tags (if you use tags)
      // dispatch(serviceApi.util.invalidateTags(['Services']));

      // 3. Show success and navigate back
      Alert.alert(
        "Configuration Updated",
        "The configuration and cache have been updated successfully!",
        [
          {
            text: "OK",
            onPress: () => {
              router.back();
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error updating configuration:", error);
      Alert.alert("Error", "Failed to update configuration");
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    currentConfig,

    ipAddress,
    setIpAddress,

    isUpdating,

    port,
    setPort,

    handleSubmit,
  };
};
