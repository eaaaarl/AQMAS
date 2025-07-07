import ConfigDisplay from '@/features/developer/components/ConfigDisplay';
import { useDeveloperSetting } from '@/features/developer/hooks/useDeveloperSetting';
import EscPosEncoder from '@manhnd/esc-pos-encoder';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, PermissionsAndroid, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import RNBluetoothClassic, { BluetoothDevice } from 'react-native-bluetooth-classic';

export default function Setting() {
    const { currentConfig, ipAddress, port, setIpAddress, setPort, handleSave } =
        useDeveloperSetting();

    // Bluetooth states
    const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
    const [bluetoothPermissions, setBluetoothPermissions] = useState(false);
    const [pairedDevices, setPairedDevices] = useState<BluetoothDevice[]>([]);
    const [availableDevices, setAvailableDevices] = useState<BluetoothDevice[]>([]);
    const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null);
    const [isDiscovering, setIsDiscovering] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [debugInfo, setDebugInfo] = useState('');

    // Check Bluetooth status on component mount
    useEffect(() => {
        requestBluetoothPermissions();
    }, []);

    const requestBluetoothPermissions = async () => {
        addDebugInfo('Requesting Bluetooth permissions...');

        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                ]);

                const allPermissionsGranted = Object.values(granted).every(
                    permission => permission === PermissionsAndroid.RESULTS.GRANTED
                );

                if (allPermissionsGranted) {
                    setBluetoothPermissions(true);
                    addDebugInfo('All Bluetooth permissions granted');
                    // Now check Bluetooth status and load devices
                    await checkBluetoothStatus();
                    await loadPairedDevices();
                    await checkConnectedDevices();
                } else {
                    setBluetoothPermissions(false);
                    addDebugInfo('Some Bluetooth permissions denied');
                    Alert.alert(
                        'Permissions Required',
                        'Bluetooth permissions are required for device discovery and connection. Please grant permissions in Settings.',
                        [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Retry', onPress: requestBluetoothPermissions }
                        ]
                    );
                }
            } else {
                // iOS doesn't need explicit permission request for Bluetooth Classic
                setBluetoothPermissions(true);
                addDebugInfo('iOS - Bluetooth permissions assumed');
                await checkBluetoothStatus();
                await loadPairedDevices();
                await checkConnectedDevices();
            }
        } catch (error: any) {
            addDebugInfo(`Permission request error: ${error.message}`);
            setBluetoothPermissions(false);
            Alert.alert('Permission Error', `Error requesting Bluetooth permissions: ${error.message}`);
        }
    };

    const addDebugInfo = (info: string) => {
        const timestamp = new Date().toLocaleTimeString();
        setDebugInfo(prev => `[${timestamp}] ${info}\n${prev}`);
    };

    const checkBluetoothStatus = async () => {
        try {
            const enabled = await RNBluetoothClassic.isBluetoothEnabled();
            setBluetoothEnabled(enabled);
            addDebugInfo(`Bluetooth enabled: ${enabled}`);
        } catch (error: any) {
            addDebugInfo(`Error checking Bluetooth status: ${error.message}`);
        }
    };

    const loadPairedDevices = async () => {
        try {
            const devices = await RNBluetoothClassic.getBondedDevices();
            setPairedDevices(devices);
            addDebugInfo(`Found ${devices.length} paired devices`);
        } catch (error: any) {
            addDebugInfo(`Error loading paired devices: ${error.message}`);
        }
    };

    const checkConnectedDevices = async () => {
        try {
            const devices = await RNBluetoothClassic.getConnectedDevices();
            if (devices.length > 0) {
                setConnectedDevice(devices[0]);
                addDebugInfo(`Already connected to: ${devices[0].name}`);
            } else {
                setConnectedDevice(null);
                addDebugInfo('No devices currently connected');
            }
        } catch (error: any) {
            addDebugInfo(`Error checking connected devices: ${error.message}`);
        }
    };

    const startDiscovery = async () => {
        if (!bluetoothEnabled) {
            Alert.alert('Bluetooth Disabled', 'Please enable Bluetooth first');
            return;
        }

        if (!bluetoothPermissions) {
            Alert.alert(
                'Permissions Required',
                'Bluetooth permissions are required for device discovery',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Grant Permissions', onPress: requestBluetoothPermissions }
                ]
            );
            return;
        }

        setIsDiscovering(true);
        setAvailableDevices([]);
        addDebugInfo('Starting device discovery...');

        try {
            const devices = await RNBluetoothClassic.startDiscovery();
            setAvailableDevices(devices);
            addDebugInfo(`Discovery completed. Found ${devices.length} devices`);
        } catch (error: any) {
            addDebugInfo(`Discovery error: ${error.message}`);
            Alert.alert('Discovery Error', error.message);
        } finally {
            setIsDiscovering(false);
        }
    };

    const pairDevice = async (device: BluetoothDevice) => {
        addDebugInfo(`Attempting to pair with: ${device.name}`);
        try {
            const paired = await RNBluetoothClassic.pairDevice(device.address);
            if (paired) {
                addDebugInfo(`Successfully paired with: ${device.name}`);
                loadPairedDevices(); // Refresh paired devices list
                Alert.alert('Success', `Paired with ${device.name}`);
            } else {
                addDebugInfo(`Failed to pair with: ${device.name}`);
                Alert.alert('Pairing Failed', `Could not pair with ${device.name}`);
            }
        } catch (error: any) {
            addDebugInfo(`Pairing error: ${error.message}`);
            Alert.alert('Pairing Error', error.message);
        }
    };

    const connectToDevice = async (device: BluetoothDevice) => {
        if (connectedDevice) {
            Alert.alert('Already Connected', `Disconnect from ${connectedDevice.name} first`);
            return;
        }

        setIsConnecting(true);
        addDebugInfo(`Connecting to: ${device.name}`);

        try {
            const connected = await RNBluetoothClassic.connectToDevice(device.address);
            if (connected) {
                setConnectedDevice(device);
                addDebugInfo(`Successfully connected to: ${device.name}`);
                Alert.alert('Connected', `Connected to ${device.name}`);
            } else {
                addDebugInfo(`Failed to connect to: ${device.name}`);
                Alert.alert('Connection Failed', `Could not connect to ${device.name}`);
            }
        } catch (error: any) {
            addDebugInfo(`Connection error: ${error.message}`);
            Alert.alert('Connection Error', error.message);
        } finally {
            setIsConnecting(false);
        }
    };

    const disconnectDevice = async () => {
        if (!connectedDevice) return;

        addDebugInfo(`Disconnecting from: ${connectedDevice.name}`);
        try {
            await RNBluetoothClassic.disconnectFromDevice(connectedDevice.address);
            setConnectedDevice(null);
            addDebugInfo('Successfully disconnected');
            Alert.alert('Disconnected', 'Device disconnected');
        } catch (error: any) {
            addDebugInfo(`Disconnect error: ${error.message}`);
            Alert.alert('Disconnect Error', error.message);
        }
    };

    const clearDebugInfo = () => {
        setDebugInfo('');
    };

    const testThermalPrinter = async () => {
        if (!connectedDevice) {
            Alert.alert('No Device Connected', 'Please connect to a Bluetooth thermal printer first');
            return;
        }

        setIsTesting(true);
        addDebugInfo('Starting thermal printer test...');

        try {
            // Create ESC/POS encoder instance
            const encoder = new EscPosEncoder();

            // Build test receipt
            const testData = encoder
                .initialize()
                .align('center')
                .bold(true)
                .size(1)
                .text('THERMAL PRINTER TEST')
                .newline()
                .text('===================')
                .newline()
                .bold(false)
                .align('left')
                .text('Device: ' + connectedDevice.name)
                .newline()
                .text('Address: ' + connectedDevice.address)
                .newline()
                .text('Test Time: ' + new Date().toLocaleString())
                .newline()
                .align('center')
                .text('--- TEST PATTERNS ---')
                .newline()
                .align('left')
                .text('Normal Text: Hello World!')
                .newline()
                .bold(true)
                .text('Bold Text: This is bold')
                .newline()
                .bold(false)
                .size(0)
                .text('Small Text: Compact printing')
                .newline()
                .size(1)
                .underline(true)
                .text('Underlined Text')
                .newline()
                .underline(false)
                .newline()
                .align('center')
                .text('--- ALIGNMENT TEST ---')
                .newline()
                .align('left')
                .text('Left aligned text')
                .newline()
                .align('center')
                .text('Center aligned text')
                .newline()
                .align('right')
                .text('Right aligned text')
                .newline()
                .align('left')
                .newline()
                .text('--- SPECIAL CHARACTERS ---')
                .newline()
                .text('Currency: $ € £ ¥')
                .newline()
                .text('Symbols: © ® ™ § °')
                .newline()
                .text('Numbers: 0123456789')
                .newline()
                .align('center')
                .text('--- QR CODE TEST ---')
                .newline()
                .qrcode('https://example.com/test', 1, 8, 'h')
                .newline()
                .text('QR Code: https://example.com/test')
                .newline()
                .text('--- BARCODE TEST ---')
                .newline()
                .barcode('1234567890', 'code128', 60)
                .newline()
                .text('Barcode: 1234567890')
                .newline()
                .align('center')
                .bold(true)
                .text('TEST COMPLETED')
                .newline()
                .bold(false)
                .text('If you can see this clearly,')
                .newline()
                .text('your thermal printer is working!')
                .newline()
                .cut()
                .encode();

            // Convert to base64 for transmission
            const base64Data = btoa(String.fromCharCode(...new Uint8Array(testData)));

            addDebugInfo(`Sending test data (${testData.length} bytes) to printer...`);

            // Send to printer
            const result = await RNBluetoothClassic.writeToDevice(
                connectedDevice.address,
                base64Data,
                'base64'
            );

            if (result) {
                addDebugInfo('Test print sent successfully!');
                Alert.alert(
                    'Test Sent!',
                    'Test receipt has been sent to the thermal printer. Check if it prints correctly.',
                    [{ text: 'OK', style: 'default' }]
                );
            } else {
                addDebugInfo('Failed to send test data');
                Alert.alert('Test Failed', 'Could not send test data to printer');
            }

        } catch (error: any) {
            addDebugInfo(`Thermal printer test error: ${error.message}`);
            Alert.alert('Test Error', `Error testing thermal printer: ${error.message}`);
        } finally {
            setIsTesting(false);
        }
    };

    const testSimplePrint = async () => {
        if (!connectedDevice) {
            Alert.alert('No Device Connected', 'Please connect to a Bluetooth thermal printer first');
            return;
        }

        setIsTesting(true);
        addDebugInfo('Starting simple print test...');

        try {
            const encoder = new EscPosEncoder();

            const simpleData = encoder
                .initialize()
                .align('center')
                .bold(true)
                .text('SIMPLE TEST')
                .newline()
                .bold(false)
                .text('Hello from React Native!')
                .newline()
                .text(new Date().toLocaleString())
                .newline()
                .cut()
                .encode();

            const base64Data = btoa(String.fromCharCode(...new Uint8Array(simpleData)));

            addDebugInfo(`Sending simple test (${simpleData.length} bytes)...`);

            const result = await RNBluetoothClassic.writeToDevice(
                connectedDevice.address,
                base64Data,
                'base64'
            );

            if (result) {
                addDebugInfo('Simple test sent successfully!');
                Alert.alert('Simple Test Sent!', 'Check your thermal printer for output.');
            } else {
                addDebugInfo('Failed to send simple test');
                Alert.alert('Test Failed', 'Could not send simple test to printer');
            }

        } catch (error: any) {
            addDebugInfo(`Simple print test error: ${error.message}`);
            Alert.alert('Test Error', `Error in simple print test: ${error.message}`);
        } finally {
            setIsTesting(false);
        }
    };

    const renderDevice = ({ item, isPaired = false }: { item: BluetoothDevice, isPaired: boolean }) => (
        <View className="flex-row items-center justify-between border-b border-gray-100 py-3">
            <View className="flex-1">
                <Text className="font-medium text-gray-900">{item.name || 'Unknown Device'}</Text>
                <Text className="text-sm text-gray-500">{item.address}</Text>
            </View>
            <View className="flex-row gap-2">
                {isPaired ? (
                    <TouchableOpacity
                        onPress={() => connectToDevice(item)}
                        disabled={isConnecting || connectedDevice?.address === item.address}
                        className={`rounded-lg px-4 py-2 ${connectedDevice?.address === item.address
                            ? 'bg-green-100'
                            : isConnecting
                                ? 'bg-gray-100'
                                : 'bg-blue-100'
                            }`}
                    >
                        <Text className={`text-sm font-medium ${connectedDevice?.address === item.address
                            ? 'text-green-700'
                            : isConnecting
                                ? 'text-gray-500'
                                : 'text-blue-700'
                            }`}>
                            {connectedDevice?.address === item.address
                                ? 'Connected'
                                : isConnecting
                                    ? 'Connecting...'
                                    : 'Connect'
                            }
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        onPress={() => pairDevice(item)}
                        className="rounded-lg bg-orange-100 px-4 py-2"
                    >
                        <Text className="text-sm font-medium text-orange-700">Pair</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    return (
        <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
        >
            <View className="mb-6">
                <Text className="text-2xl font-bold text-gray-900">
                    Developer Settings
                </Text>
                <Text className="mt-1 text-sm text-gray-600">
                    Configure API connection and Bluetooth settings for development
                </Text>
            </View>

            {/* Configuration Display */}
            <ConfigDisplay currentConfig={currentConfig} className="mb-6" />

            {/* API Configuration Form */}
            <View className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm mb-6">
                <View className="mb-4">
                    <Text className="text-lg font-semibold text-gray-900 mb-1">
                        API Configuration
                    </Text>
                    <Text className="text-sm text-gray-600">
                        Enter your server details to establish connection
                    </Text>
                </View>

                <View className="space-y-4">
                    {/* IP Address Input */}
                    <View>
                        <Text className="mb-2 text-sm font-medium text-gray-700">
                            IP Address
                        </Text>
                        <TextInput
                            value={ipAddress}
                            onChangeText={setIpAddress}
                            placeholder="e.g., 192.168.1.100"
                            className="rounded-lg border border-gray-300 bg-gray-50 font-bold text-black px-4 py-3 text-base"
                            keyboardType="url"
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    {/* Port Input */}
                    <View>
                        <Text className="mb-2 text-sm font-medium text-gray-700">
                            Port
                        </Text>
                        <TextInput
                            value={port}
                            onChangeText={setPort}
                            placeholder="e.g., 3000"
                            className="rounded-lg border text-black font-bold border-gray-300 bg-gray-50 px-4 py-3 text-base"
                            keyboardType="numeric"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity
                        onPress={handleSave}
                        className="mt-6 rounded-lg bg-blue-600 py-3 px-4 shadow-sm active:bg-blue-700"
                        activeOpacity={0.8}
                    >
                        <Text className="text-center text-base font-semibold text-white">
                            Save Configuration
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Bluetooth Configuration */}
            <View className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm mb-6">
                <View className="mb-4">
                    <Text className="text-lg font-semibold text-gray-900 mb-1">
                        Bluetooth Configuration
                    </Text>
                    <Text className="text-sm text-gray-600">
                        Manage Bluetooth connections and pairing
                    </Text>
                </View>

                {/* Bluetooth Status */}
                <View className="mb-4">
                    <View className="flex-row items-center justify-between mb-2">
                        <Text className="text-sm font-medium text-gray-700">Bluetooth Status</Text>
                        <View className={`rounded-full px-3 py-1 ${bluetoothEnabled ? 'bg-green-100' : 'bg-red-100'}`}>
                            <Text className={`text-sm font-medium ${bluetoothEnabled ? 'text-green-700' : 'text-red-700'}`}>
                                {bluetoothEnabled ? 'Enabled' : 'Disabled'}
                            </Text>
                        </View>
                    </View>
                    <View className="flex-row items-center justify-between">
                        <Text className="text-sm font-medium text-gray-700">Permissions</Text>
                        <View className="flex-row space-x-2">
                            <View className={`rounded-full px-3 py-1 ${bluetoothPermissions ? 'bg-green-100' : 'bg-red-100'}`}>
                                <Text className={`text-sm font-medium ${bluetoothPermissions ? 'text-green-700' : 'text-red-700'}`}>
                                    {bluetoothPermissions ? 'Granted' : 'Denied'}
                                </Text>
                            </View>
                            {!bluetoothPermissions && (
                                <TouchableOpacity
                                    onPress={requestBluetoothPermissions}
                                    className="rounded-full bg-blue-100 px-3 py-1"
                                >
                                    <Text className="text-sm font-medium text-blue-700">Grant</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>

                {/* Connected Device Status */}
                {connectedDevice && (
                    <View className="mb-4 rounded-lg bg-green-50 p-3">
                        <Text className="text-sm font-medium text-green-800 mb-1">Connected Device</Text>
                        <Text className="text-sm text-green-700">{connectedDevice.name}</Text>
                        <Text className="text-xs text-green-600">{connectedDevice.address}</Text>
                        <View className="flex-row space-x-2 mt-2">
                            <TouchableOpacity
                                onPress={disconnectDevice}
                                className="rounded-lg bg-red-100 py-2 px-3"
                            >
                                <Text className="text-sm font-medium text-red-700">Disconnect</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={testSimplePrint}
                                disabled={isTesting}
                                className={`rounded-lg py-2 px-3 ${isTesting ? 'bg-gray-100' : 'bg-orange-100'
                                    }`}
                            >
                                <Text className={`text-sm font-medium ${isTesting ? 'text-gray-500' : 'text-orange-700'
                                    }`}>
                                    {isTesting ? 'Testing...' : 'Quick Test'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={testThermalPrinter}
                                disabled={isTesting}
                                className={`rounded-lg py-2 px-3 ${isTesting ? 'bg-gray-100' : 'bg-purple-100'
                                    }`}
                            >
                                <Text className={`text-sm font-medium ${isTesting ? 'text-gray-500' : 'text-purple-700'
                                    }`}>
                                    {isTesting ? 'Testing...' : 'Full Test'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Discovery Button */}
                <TouchableOpacity
                    onPress={startDiscovery}
                    disabled={isDiscovering || !bluetoothEnabled || !bluetoothPermissions}
                    className={`rounded-lg py-3 px-4 mb-4 ${isDiscovering || !bluetoothEnabled || !bluetoothPermissions
                        ? 'bg-gray-100'
                        : 'bg-purple-600 active:bg-purple-700'
                        }`}
                    activeOpacity={0.8}
                >
                    <Text className={`text-center text-base font-semibold ${isDiscovering || !bluetoothEnabled || !bluetoothPermissions
                        ? 'text-gray-500'
                        : 'text-white'
                        }`}>
                        {isDiscovering ? 'Discovering...' : 'Start Discovery'}
                    </Text>
                </TouchableOpacity>

                {/* Paired Devices */}
                {pairedDevices.length > 0 && (
                    <View className="mb-4">
                        <Text className="text-sm font-medium text-gray-700 mb-2">Paired Devices</Text>
                        <View className="rounded-lg border border-gray-200 bg-gray-50">
                            <FlatList
                                data={pairedDevices}
                                renderItem={({ item }) => renderDevice({ item, isPaired: true })}
                                keyExtractor={(item) => item.address}
                                scrollEnabled={false}
                            />
                        </View>
                    </View>
                )}

                {/* Available Devices */}
                {availableDevices.length > 0 && (
                    <View className="mb-4">
                        <Text className="text-sm font-medium text-gray-700 mb-2">Available Devices</Text>
                        <View className="rounded-lg border border-gray-200 bg-gray-50">
                            <FlatList
                                data={availableDevices}
                                renderItem={({ item }) => renderDevice({ item, isPaired: false })}
                                keyExtractor={(item) => item.address}
                                scrollEnabled={false}
                            />
                        </View>
                    </View>
                )}
            </View>

            {/* Debug Information */}
            <View className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm mb-6">
                <View className="mb-4 flex-row items-center justify-between">
                    <Text className="text-lg font-semibold text-gray-900">
                        Debug Information
                    </Text>
                    <TouchableOpacity
                        onPress={clearDebugInfo}
                        className="rounded-lg bg-red-100 px-3 py-1"
                    >
                        <Text className="text-sm font-medium text-red-700">Clear</Text>
                    </TouchableOpacity>
                </View>
                <View className="rounded-lg bg-gray-900 p-4 max-h-40">
                    <ScrollView showsVerticalScrollIndicator={true}>
                        <Text className="text-xs text-green-400 font-mono">
                            {debugInfo || 'No debug information yet...'}
                        </Text>
                    </ScrollView>
                </View>
            </View>

            {/* Development Tips */}
            <View className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
                <View className="flex-row items-start">
                    <View className="mr-3 mt-0.5 h-4 w-4 rounded-full bg-blue-400 flex items-center justify-center">
                        <Text className="text-xs font-bold text-white">i</Text>
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm font-medium text-blue-800 mb-1">
                            Development Tips
                        </Text>
                        <Text className="text-xs text-blue-700 leading-relaxed">
                            • Make sure your development server is running and accessible{'\n'}
                            • Use your computer&apos;s local IP address (not localhost) for device testing{'\n'}
                            • Ensure both device and server are on the same network{'\n'}
                            • Check firewall settings if connection fails{'\n'}
                            • Enable Bluetooth and location permissions for device discovery{'\n'}
                            • Keep devices close during pairing and connection{'\n'}
                            • For thermal printing: ensure printer is powered on and has paper{'\n'}
                            • Use Quick Test for basic connectivity, Full Test for comprehensive testing
                        </Text>
                    </View>
                </View>
            </View>

            <View className="h-6" />
        </ScrollView>
    );
}