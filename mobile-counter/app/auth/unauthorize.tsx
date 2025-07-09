import { UnauthorizeContent } from '@/features/auth/components/UnauthorizeContent';
import { useUnauthorizeScreen } from '@/features/auth/hooks/useUnauthorizeScreen';
import React from 'react';

export default function Unauthorize() {
  const {
    isLoading,
    handleVerification,
    handleContactAdmin,
    handleTryAgain,
  } = useUnauthorizeScreen();

  return (
    <UnauthorizeContent
      isLoading={isLoading}
      onVerification={handleVerification}
      onContactAdmin={handleContactAdmin}
      onTryAgain={handleTryAgain}
    />
  );
}