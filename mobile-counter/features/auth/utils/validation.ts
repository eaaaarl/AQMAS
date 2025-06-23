import { LoginFormData, LoginFormErrors } from '../types';

export const validateLoginForm = (data: LoginFormData): LoginFormErrors => {
  const errors: LoginFormErrors = {};

  // Employee ID validation
  if (!data.employeeId.trim()) {
    errors.employeeId = 'Employee number is required';
  }

  // PIN validation
  if (!data.pin.trim()) {
    errors.pin = 'PIN is required';
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
