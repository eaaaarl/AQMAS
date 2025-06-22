import { LoginFormData, LoginFormErrors } from '../types';

export const validateLoginForm = (data: LoginFormData): LoginFormErrors => {
  const errors: LoginFormErrors = {};

  // Employee ID validation
  if (!data.employeeId.trim()) {
    errors.employeeId = 'Employee number is required';
  } else if (data.employeeId.trim().length < 3) {
    errors.employeeId = 'Employee number must be at least 3 characters';
  }

  // PIN validation
  if (!data.pin.trim()) {
    errors.pin = 'PIN is required';
  } else if (data.pin.trim().length < 4) {
    errors.pin = 'PIN must be at least 4 characters';
  } else if (!/^\d+$/.test(data.pin.trim())) {
    errors.pin = 'PIN must contain only numbers';
  }

  return errors;
};

export const hasValidationErrors = (errors: LoginFormErrors): boolean => {
  return Object.keys(errors).length > 0;
};

export const formatEmployeeId = (value: string): string => {
  // Remove any non-alphanumeric characters and convert to uppercase
  return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
};

export const formatPin = (value: string): string => {
  // Remove any non-numeric characters
  return value.replace(/[^0-9]/g, '');
}; 