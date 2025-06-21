import { useAppDispatch, useAppSelector } from "@/libs/redux/hooks";
import { setConfig } from "@/libs/redux/state/configSlice";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { serviceApi } from "../../service/api/serviceApi";
import { CONFIG_CONSTANTS } from "../constants";
import { validateConfig, ValidationResult } from "../utils/validation";

export const useConfigUpdate = () => {
  const [ipAddress, setIpAddress] = useState("");
  const [port, setPort] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationResult['errors']>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  const dispatch = useAppDispatch();
  const currentConfig = useAppSelector((state) => state.config);

  // Initialize form with current config
  useEffect(() => {
    if (currentConfig?.ipAddress) {
      setIpAddress(currentConfig.ipAddress);
    }
    if (currentConfig?.port) {
      setPort(currentConfig.port);
    }
  }, [currentConfig]);

  // Validate on input change if form has been submitted
  useEffect(() => {
    if (hasSubmitted) {
      const validation = validateConfig(ipAddress, port);
      setValidationErrors(validation.errors);
    }
  }, [ipAddress, port, hasSubmitted]);

  const validateForm = useCallback((): boolean => {
    const validation = validateConfig(ipAddress, port);
    setValidationErrors(validation.errors);
    setHasSubmitted(true);
    return validation.isValid;
  }, [ipAddress, port]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      Alert.alert(
        CONFIG_CONSTANTS.MESSAGES.ERROR_TITLE,
        CONFIG_CONSTANTS.MESSAGES.VALIDATION_ERROR
      );
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

      Alert.alert(
        CONFIG_CONSTANTS.MESSAGES.SUCCESS_TITLE,
        CONFIG_CONSTANTS.MESSAGES.SUCCESS_MESSAGE,
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
      Alert.alert(
        CONFIG_CONSTANTS.MESSAGES.ERROR_TITLE,
        CONFIG_CONSTANTS.MESSAGES.UPDATE_ERROR
      );
    } finally {
      setIsUpdating(false);
    }
  }, [ipAddress, port, validateForm, dispatch]);

  const resetValidation = useCallback(() => {
    setValidationErrors({});
    setHasSubmitted(false);
  }, []);

  return {
    // State
    currentConfig,
    ipAddress,
    port,
    isUpdating,
    validationErrors,
    
    // Actions
    setIpAddress,
    setPort,
    handleSubmit,
    resetValidation,
  };
};
