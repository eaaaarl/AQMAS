import { useDeveloperSetting } from '@/features/developer/hooks/useDeveloperSetting';
import { useState } from 'react';

export interface UseNotRegisteredScreen {
  isRegistering: boolean;
  handleRegisterDevice: () => Promise<void>;
}

export const useNotRegisteredScreen = (): UseNotRegisteredScreen => {
  const [isRegistering, setIsRegistering] = useState(false);
  const { registerDeviceSilently } = useDeveloperSetting();

  const handleRegisterDevice = async () => {
    setIsRegistering(true);
    try {
      await registerDeviceSilently();
    } finally {
      setIsRegistering(false);
    }
  };

  return {
    isRegistering,
    handleRegisterDevice,
  };
}; 