import { useGetConfigsQuery } from "../api/configApi";

export const useConfig = () => {
  const {
    isLoading: isConfigsLoading,
    isError: isConfigsError,
    data: configData,
  } = useGetConfigsQuery();

  const screenType = configData?.find(
    (config) =>
      config.SectionName === "Kiosk" && config.KeyName === "Screen_type"
  )?.Value;

  const shouldShowAllServices = screenType === "1";

  const askCustomerType = configData?.find(
    (config) =>
      config.SectionName === "Kiosk" && config.KeyName === "Ask_Cutomer_type"
  )?.Value;
  const showAskCustomerType = askCustomerType === "1";

  const askCustomerName = configData?.find(
    (config) =>
      config.SectionName === "Kiosk" && config.KeyName === "Ask_Customer_Name"
  )?.Value;

  const showAskCustomerName = askCustomerName === "1";

  return {
    configData,
    isConfigsLoading,
    isConfigsError,
    shouldShowAllServices,
    showAskCustomerType,
    showAskCustomerName,
  };
};
