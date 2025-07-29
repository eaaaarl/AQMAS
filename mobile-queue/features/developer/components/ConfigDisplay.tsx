import { ApiConfig } from '@/libs/redux/state/configSlice';
import * as Application from 'expo-application';
import * as Device from 'expo-device';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface DeviceInfo {
    androidId: string | null;
    deviceName: string | null;
    deviceType: Device.DeviceType | null;
    brand: string | null;
    manufacturer: string | null;
    modelName: string | null;
    osName: string | null;
    osVersion: string | null;
    platformApiLevel: number | null;
    appVersion: string | null;
    buildVersion: string | null;
}

interface ConfigDisplayProps {
    currentConfig: ApiConfig;
    className?: string;
}

export default function ConfigDisplay({
    currentConfig,
    className = '',
}: ConfigDisplayProps) {
    const hasConfig = currentConfig?.ipAddress && currentConfig?.port;
    const [isVisible, setIsVisible] = useState(false);
    const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
        androidId: null,
        deviceName: null,
        deviceType: null,
        brand: null,
        manufacturer: null,
        modelName: null,
        osName: null,
        osVersion: null,
        platformApiLevel: null,
        appVersion: null,
        buildVersion: null,
    });
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        async function getDeviceInfo() {
            try {
                const [
                    androidId,
                    deviceName,
                    appVersion,
                    buildVersion,
                ] = await Promise.all([
                    Application.getAndroidId(),
                    Device.deviceName,
                    Application.nativeApplicationVersion,
                    Application.nativeBuildVersion,
                ]);

                setDeviceInfo({
                    androidId,
                    deviceName,
                    deviceType: Device.deviceType,
                    brand: Device.brand,
                    manufacturer: Device.manufacturer,
                    modelName: Device.modelName,
                    osName: Device.osName,
                    osVersion: Device.osVersion,
                    platformApiLevel: Device.platformApiLevel,
                    appVersion,
                    buildVersion,
                });
            } catch (error) {
                console.error('Error fetching device info:', error);
            } finally {
                setIsLoading(false);
            }
        }

        getDeviceInfo();
    }, []);

    const getDeviceTypeLabel = (deviceType: Device.DeviceType | null) => {
        switch (deviceType) {
            case Device.DeviceType.PHONE:
                return 'Phone';
            case Device.DeviceType.TABLET:
                return 'Tablet';
            case Device.DeviceType.DESKTOP:
                return 'Desktop';
            case Device.DeviceType.TV:
                return 'TV';
            default:
                return 'Unknown';
        }
    };

    const InfoRow = ({ label, value, monospace = false }: {
        label: string;
        value: string | number | null;
        monospace?: boolean;
    }) => (
        <View className="flex-row items-center justify-between py-1">
            <Text className="text-xs font-medium text-gray-600 flex-1">
                {label}
            </Text>
            <Text className={`text-xs text-gray-800 flex-1 text-right ${monospace ? 'font-mono bg-gray-100 px-2 py-1 rounded' : ''
                }`}>
                {value || 'N/A'}
            </Text>
        </View>
    );

    if (!hasConfig) {
        return (
            <View className={`rounded-xl border border-amber-200 bg-amber-50 ${className}`}>
                {/* Toggle Button */}
                <TouchableOpacity
                    onPress={() => setIsVisible(!isVisible)}
                    className="flex-row items-center justify-between p-4 border-b border-amber-200"
                >
                    <View className="flex-row items-center">
                        <View className="mr-3 h-3 w-3 rounded-full bg-amber-400" />
                        <Text className="text-base font-semibold text-amber-800">
                            Configuration Status
                        </Text>
                    </View>
                    <Text className="text-amber-600 text-lg">
                        {isVisible ? '−' : '+'}
                    </Text>
                </TouchableOpacity>

                {isVisible && (
                    <View className="p-5">
                        {/* Configuration Status */}
                        <View className="mb-4">
                            <View className="mb-2 flex-row items-center">
                                <View className="mr-3 h-3 w-3 rounded-full bg-amber-400" />
                                <Text className="text-base font-semibold text-amber-800">
                                    No Configuration Set
                                </Text>
                            </View>
                            <Text className="ml-6 text-sm text-amber-700">
                                Please configure the API settings below to connect to your server
                            </Text>
                        </View>

                        {/* Device Information */}
                        <View className="border-t border-amber-200 pt-4">
                            <View className="mb-3 flex-row items-center">
                                <View className="mr-3 h-2 w-2 rounded-full bg-amber-500" />
                                <Text className="text-sm font-semibold text-amber-800">
                                    Device Information
                                </Text>
                            </View>

                            {isLoading ? (
                                <Text className="ml-5 text-xs text-amber-600">Loading device info...</Text>
                            ) : (
                                <View className="ml-5 space-y-1">
                                    <InfoRow label="Device Name" value={deviceInfo.deviceName} />
                                    <InfoRow label="Device Type" value={getDeviceTypeLabel(deviceInfo.deviceType)} />
                                    <InfoRow label="Brand" value={deviceInfo.brand} />
                                    <InfoRow label="Manufacturer" value={deviceInfo.manufacturer} />
                                    <InfoRow label="Model" value={deviceInfo.modelName} />
                                    <InfoRow label="OS" value={`${deviceInfo.osName} ${deviceInfo.osVersion}`} />
                                    <InfoRow label="API Level" value={deviceInfo.platformApiLevel} />
                                    <InfoRow label="App Version" value={deviceInfo.appVersion} />
                                    <InfoRow label="Build Version" value={deviceInfo.buildVersion} />
                                    <InfoRow label="Android ID" value={deviceInfo.androidId} monospace />
                                </View>
                            )}
                        </View>

                        {/* Developer Notes */}
                        <View className="mt-4 border-t border-amber-200 pt-4">
                            <Text className="text-xs font-medium text-amber-700 mb-2">
                                Developer Notes:
                            </Text>
                            <Text className="text-xs text-amber-600 leading-relaxed">
                                • Configure IP address and port to establish server connection{'\n'}
                                • Android ID can be used for device identification{'\n'}
                                • Check device compatibility and OS version for feature support
                            </Text>
                        </View>
                    </View>
                )}
            </View>
        );
    }

    return (
        <View className={`rounded-xl border border-emerald-200 bg-emerald-50 ${className}`}>
            {/* Toggle Button */}
            <TouchableOpacity
                onPress={() => setIsVisible(!isVisible)}
                className="flex-row items-center justify-between p-4 border-b border-emerald-200"
            >
                <View className="flex-row items-center">
                    <View className="mr-3 h-3 w-3 rounded-full bg-emerald-500" />
                    <Text className="text-base font-semibold text-emerald-800">
                        Active Configuration
                    </Text>
                </View>
                <Text className="text-emerald-600 text-lg">
                    {isVisible ? '−' : '+'}
                </Text>
            </TouchableOpacity>

            {isVisible && (
                <View className="p-5">
                    {/* Configuration Status */}
                    <View className="mb-4">
                        <View className="mb-3 flex-row items-center">
                            <View className="mr-3 h-3 w-3 rounded-full bg-emerald-500" />
                            <Text className="text-base font-semibold text-emerald-800">
                                Active Configuration
                            </Text>
                        </View>

                        <View className="ml-6 space-y-2">
                            <InfoRow label="Server IP" value={currentConfig.ipAddress} monospace />
                            <InfoRow label="Port" value={currentConfig.port} monospace />
                            <View className="mt-2 p-2 bg-emerald-100 rounded">
                                <Text className="text-xs text-emerald-700">
                                    ✓ Connected to: {currentConfig.ipAddress}:{currentConfig.port}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Device Information */}
                    <View className="border-t border-emerald-200 pt-4">
                        <View className="mb-3 flex-row items-center">
                            <View className="mr-3 h-2 w-2 rounded-full bg-emerald-600" />
                            <Text className="text-sm font-semibold text-emerald-800">
                                Device Information
                            </Text>
                        </View>

                        {isLoading ? (
                            <Text className="ml-5 text-xs text-emerald-600">Loading device info...</Text>
                        ) : (
                            <View className="ml-5 space-y-1">
                                <InfoRow label="Device Name" value={deviceInfo.deviceName} />
                                <InfoRow label="Device Type" value={getDeviceTypeLabel(deviceInfo.deviceType)} />
                                <InfoRow label="Brand" value={deviceInfo.brand} />
                                <InfoRow label="Manufacturer" value={deviceInfo.manufacturer} />
                                <InfoRow label="Model" value={deviceInfo.modelName} />
                                <InfoRow label="OS" value={`${deviceInfo.osName} ${deviceInfo.osVersion}`} />
                                <InfoRow label="API Level" value={deviceInfo.platformApiLevel} />
                                <InfoRow label="App Version" value={deviceInfo.appVersion} />
                                <InfoRow label="Build Version" value={deviceInfo.buildVersion} />
                                <InfoRow label="Android ID" value={deviceInfo.androidId} monospace />
                            </View>
                        )}
                    </View>

                    {/* Connection Health */}
                    <View className="mt-4 border-t border-emerald-200 pt-4">
                        <View className="mb-2 flex-row items-center">
                            <View className="mr-3 h-2 w-2 rounded-full bg-emerald-600" />
                            <Text className="text-sm font-semibold text-emerald-800">
                                Connection Status
                            </Text>
                        </View>
                        <View className="ml-5">
                            <View className="p-3 bg-emerald-100 rounded-lg">
                                <Text className="text-xs font-medium text-emerald-700 mb-1">
                                    Ready for API calls
                                </Text>
                                <Text className="text-xs text-emerald-600">
                                    Device is configured and ready to communicate with the server
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Developer Notes */}
                    <View className="mt-4 border-t border-emerald-200 pt-4">
                        <Text className="text-xs font-medium text-emerald-700 mb-2">
                            Developer Notes:
                        </Text>
                        <Text className="text-xs text-emerald-600 leading-relaxed">
                            • All API requests will be sent to {currentConfig.ipAddress}:{currentConfig.port}{'\n'}
                            • Device info can be sent as headers for server-side logging{'\n'}
                            • Monitor API level compatibility for feature availability{'\n'}
                            • Android ID persists across app reinstalls but may change on factory reset
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );
}