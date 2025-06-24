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

  const sequenceByService = configData?.find(
    (config) =>
      config.SectionName === "Kiosk" && config.KeyName === "SequenceByServices"
  )?.Value;

  const enabledSequenceByService = sequenceByService === "1";

  const survey = configData?.find(
    (config) =>
      config.SectionName === "Kiosk" && config.KeyName === "Enable_Survey"
  )?.Value;
  const enabledSurvey = survey === "1";

  const surveyMessage = configData?.find(
    (config) =>
      config.SectionName === "Kiosk" && config.KeyName === "Survey_Message"
  )?.Value;

  const ticket = configData?.find(
    (config) =>
      config.SectionName === "Kiosk" && config.KeyName === "Show_Ticket"
  )?.Value;

  const enabledTicket = ticket === "1";

  return {
    configData,
    isConfigsLoading,
    isConfigsError,
    shouldShowAllServices,
    showAskCustomerType,
    showAskCustomerName,
    enabledSequenceByService,
    enabledSurvey,
    surveyMessage,
    enabledTicket,
  };
};
