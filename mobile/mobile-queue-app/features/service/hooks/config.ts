import { useAppSelector } from "@/libs/redux/hooks";

export const useConfig = () => {
  const { serverIp: currentServerIp, serverPort: currentServerPort } =
    useAppSelector((state) => state.config);

  if (!currentServerIp || !currentServerPort) {
    return {
      API_URL: "",
      WS_URL: "",
    };
  }

  return {
    API_URL: `http://${currentServerIp}:${currentServerPort}/api`,
  };
};
