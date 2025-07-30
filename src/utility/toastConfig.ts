import type { ToastType } from '@components/ui/Toast'

export interface ToastConfig {
  type: ToastType
  title: string
  message?: string
  duration?: number
}

// Predefined toast configurations for common scenarios
export const toastConfig = {
  // Employee Management
  employeeCreated: (name: string): ToastConfig => ({
    type: 'success',
    title: 'Employee Created Successfully',
    message: `${name} has been added to your organization.`,
    duration: 6000,
  }),

  employeeUpdated: (name: string): ToastConfig => ({
    type: 'success',
    title: 'Employee Updated',
    message: `${name}'s information has been updated successfully.`,
    duration: 5000,
  }),

  employeeDeleted: (name: string): ToastConfig => ({
    type: 'success',
    title: 'Employee Removed',
    message: `${name} has been removed from the organization.`,
    duration: 5000,
  }),

  // Authentication
  loginSuccess: (): ToastConfig => ({
    type: 'success',
    title: 'Welcome Back!',
    message: 'You have been successfully logged in.',
    duration: 4000,
  }),

  registrationSuccess: (name: string): ToastConfig => ({
    type: 'success',
    title: 'Account Created!',
    message: `Welcome ${name}! Your account has been created successfully.`,
    duration: 6000,
  }),

  ownerRegistrationSuccess: (orgName: string): ToastConfig => ({
    type: 'success',
    title: 'Organization Created!',
    message: `${orgName} has been successfully registered. Welcome aboard!`,
    duration: 6000,
  }),

  logoutSuccess: (): ToastConfig => ({
    type: 'info',
    title: 'Logged Out',
    message: 'You have been successfully logged out.',
    duration: 3000,
  }), // Errors
  networkError: (): ToastConfig => ({
    type: 'error',
    title: 'Network Error',
    message: 'Unable to connect to the server. Please check your connection.',
    duration: 7000,
  }),

  permissionDenied: (): ToastConfig => ({
    type: 'error',
    title: 'Permission Denied',
    message: 'You do not have permission to perform this action.',
    duration: 6000,
  }),

  validationError: (field: string): ToastConfig => ({
    type: 'warning',
    title: 'Validation Error',
    message: `Please check the ${field} field and try again.`,
    duration: 5000,
  }),

  // General
  saveSuccess: (): ToastConfig => ({
    type: 'success',
    title: 'Changes Saved',
    message: 'Your changes have been saved successfully.',
    duration: 4000,
  }),

  loadingError: (resource: string): ToastConfig => ({
    type: 'error',
    title: `Failed to Load ${resource}`,
    message: 'Please refresh the page and try again.',
    duration: 6000,
  }),
}

// Helper function to create custom toasts
export const createToast = (
  type: ToastType,
  title: string,
  message?: string,
  duration?: number
): ToastConfig => ({
  type,
  title,
  message,
  duration: duration || 5000,
})
