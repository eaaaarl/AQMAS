import { AuthError } from '../types';

export const handleAuthError = (error: any): AuthError => {
  console.log('Auth Error Details:', {
    error,
    status: error?.status,
    data: error?.data,
    message: error?.message,
    originalStatus: error?.originalStatus,
  });

  let errorMessage = 'Failed to login, please try again';
  let errorTitle = 'Login Failed';

  if (error?.data?.message) {
    errorMessage = error.data.message;
  } else if (error?.status === 'FETCH_ERROR') {
    errorMessage = 'Network error - check your connection';
    errorTitle = 'Connection Error';
  } else if (error?.status === 'TIMEOUT_ERROR') {
    errorMessage =
      'Request timed out. Please check your connection and try again';
    errorTitle = 'Timeout Error';
  } else if (error?.status === 'PARSING_ERROR') {
    errorMessage = 'Server response error';
  } else if (error?.status === 401) {
    errorMessage = 'Invalid employee number or PIN';
  } else if (error?.status === 404) {
    errorMessage = 'Employee not found';
  } else if (error?.status === 500) {
    errorMessage = 'Server error. Please try again later';
  } else if (error?.originalStatus === 401) {
    errorMessage = 'Invalid credentials';
  } else if (error?.error?.includes('AbortError')) {
    errorMessage = 'Request was cancelled. Please try again';
    errorTitle = 'Request Cancelled';
  }

  return {
    status: error?.status || 'UNKNOWN',
    message: errorMessage,
    title: errorTitle,
  };
};

export const isNetworkError = (error: any): boolean => {
  return error?.status === 'FETCH_ERROR' || error?.status === 'TIMEOUT_ERROR';
};

export const isAuthError = (error: any): boolean => {
  return error?.status === 401 || error?.originalStatus === 401;
};

export const isServerError = (error: any): boolean => {
  return error?.status === 500 || error?.status === 'PARSING_ERROR';
};
