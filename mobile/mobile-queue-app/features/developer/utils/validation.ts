export interface ValidationResult {
    isValid: boolean;
    errors: {
        ipAddress?: string;
        port?: string;
    };
}

export const validateIpAddress = (ipAddress: string): string | undefined => {
    if (!ipAddress.trim()) {
        return 'IP address is required';
    }
    
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(ipAddress.trim())) {
        return 'Please enter a valid IP address (e.g., 192.168.1.100)';
    }
    
    return undefined;
};

export const validatePort = (port: string): string | undefined => {
    if (!port.trim()) {
        return 'Port is required';
    }
    
    const portNumber = parseInt(port.trim(), 10);
    if (isNaN(portNumber)) {
        return 'Port must be a valid number';
    }
    
    if (portNumber < 1 || portNumber > 65535) {
        return 'Port must be between 1 and 65535';
    }
    
    return undefined;
};

export const validateConfig = (ipAddress: string, port: string): ValidationResult => {
    const ipError = validateIpAddress(ipAddress);
    const portError = validatePort(port);
    
    return {
        isValid: !ipError && !portError,
        errors: {
            ipAddress: ipError,
            port: portError,
        },
    };
}; 