export const CONFIG_CONSTANTS = {
    PLACEHOLDERS: {
        IP_ADDRESS: 'Enter IP Address (e.g. 192.168.1.100)',
        PORT: 'Enter Port (e.g. 4000)',
    },
    LABELS: {
        IP_ADDRESS: 'IP Address',
        PORT: 'Port',
        UPDATE_BUTTON: 'Update Configuration',
        UPDATING_BUTTON: 'Updating...',
    },
    MESSAGES: {
        SUCCESS_TITLE: 'Configuration Updated',
        SUCCESS_MESSAGE: 'The configuration and cache have been updated successfully!',
        ERROR_TITLE: 'Error',
        VALIDATION_ERROR: 'Please fix the validation errors before submitting',
        UPDATE_ERROR: 'Failed to update configuration',
    },
    VALIDATION: {
        PORT_MIN: 1,
        PORT_MAX: 65535,
    },
} as const; 