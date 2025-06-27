import { useGetConfigsQuery } from "../api/configApi";

export const useConfig = () => {
  const { data } = useGetConfigsQuery();

  const askCustomerName = data?.find(
    (config) =>
      config.SectionName === "Kiosk" && config.KeyName === "Ask_Customer_Name"
  )?.Value;

  const askCustomerType = data?.find(
    (config) =>
      config.SectionName === "Kiosk" && config.KeyName === "Ask_Cutomer_type"
  )?.Value;

  const enabledSequenceById = data?.find(
    (config) =>
      config.SectionName === "Kiosk" && config.KeyName === "SequenceByServices"
  )?.Value;

  const AskCustomerName = askCustomerName === "1";
  const AskCustomerType = askCustomerType === "1";
  const SequenceByServices = enabledSequenceById === "1";

  return {
    AskCustomerName,
    AskCustomerType,
    SequenceByServices,
  };
};
